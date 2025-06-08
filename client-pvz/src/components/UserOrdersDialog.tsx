'use client'

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { pvzService } from "@/src/app/my/pvz.service"
import { orderService, OrderStatus } from "../app/tracking/order.service"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export function UserOrdersDialog({ open, setOpen }: Props) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pvzCache, setPvzCache] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      loadOrdersWithPvz()
    }
  }, [open])

  const loadOrdersWithPvz = async () => {
    setLoading(true)
    try {
      const res = await orderService.getUserOrders()
      const orders = res.data

      const pvzMap: Record<string, string> = {}

      for (const order of orders) {
        const pvzId = order.pvzId
        if (pvzId && !pvzMap[pvzId]) {
          try {
            const pvzRes = await pvzService.getPvzById(pvzId)
            pvzMap[pvzId] = pvzRes.data.address
          } catch (err) {
            console.error(`Ошибка получения ПВЗ ${pvzId}`, err)
            pvzMap[pvzId] = "Адрес недоступен"
          }
        }
      }

      setOrders(orders)
      setPvzCache(pvzMap)
    } catch (e) {
      console.error("Ошибка загрузки заказов", e)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (orderId: string) => {
    const confirmed = window.confirm("Вы уверены, что хотите отменить эту посылку?")
    if (!confirmed) return

    try {
      await orderService.changeOrderStatusToCanceled(orderId)
      await loadOrdersWithPvz() // обновляем список
    } catch (error) {
      console.error("Ошибка при отмене посылки:", error)
      alert("Не удалось отменить посылку.")
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case OrderStatus.READY_FOR_PICKUP:
        return "border border-green-500 text-green-700 bg-green-50 px-2 py-1 rounded text-xs inline-block"
      case OrderStatus.CREATED:
      case OrderStatus.IN_PROGRESS:
        return "border border-gray-400 text-gray-700 bg-gray-50 px-2 py-1 rounded text-xs inline-block"
      default:
        return "px-2 py-1 text-xs inline-block"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ваши посылки</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p>Загрузка...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-sm">У вас нет посылок.</p>
        ) : (
          <div className="max-h-[400px] overflow-y-auto space-y-3 text-sm">
            {orders.map(order => {
              const isShown =
                order.status === OrderStatus.IN_PROGRESS ||
                order.status === OrderStatus.CREATED ||
                order.status === OrderStatus.READY_FOR_PICKUP

              if (!isShown) return null

              return (
                <div key={order.id} className="border-b pb-2 flex justify-between items-start">
                  <div>
                    <p><strong>Трек-код:</strong> {order.trackingCode}</p>
                    <p>
                      <strong>Статус:</strong>{" "}
                      <span className={getStatusStyle(order.status)}>{order.status}</span>
                    </p>
                    <p><strong>Описание:</strong> {order.description || "—"}</p>
                    <p><strong>ПВЗ:</strong> {pvzCache[order.pvzId] || "—"}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancel(order.id)}
                  >
                    Отменить
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

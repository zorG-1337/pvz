'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { orderService } from "@/src/app/tracking/order.service"
import { useState, useMemo } from "react"

interface User {
  id: string
  name: string
  surname: string
  email: string
}

interface Order {
  id: string
  trackingCode: string
  description: string | null
  status: string
  userId: string
  pvzId: string | null
  user: User
}

interface PvzOrdersDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  orders: Order[]
}

export const PvzOrdersDialog = ({ open, setOpen, orders }: PvzOrdersDialogProps) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order =>
        ["CREATED", "IN_PROGRESS", "READY_FOR_PICKUP"].includes(order.status)
      )
      .filter(order =>
        order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [orders, searchTerm])

  const handleStatusChange = async (orderId: string) => {
    setUpdatingOrderId(orderId)
    try {
      await orderService.changeOrderStatusToReadyForPickup(orderId)
      alert("Статус успешно изменён")
    } catch (err) {
      console.error("Ошибка при обновлении статуса", err)
      alert("Не удалось изменить статус")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleClientReceived = async (orderId: string) => {
    const confirmed = confirm("Вы уверены, что клиент получил заказ?")
    if (!confirmed) return

    setUpdatingOrderId(orderId)
    try {
      await orderService.changeOrderStatusToReadyForCompleted(orderId)
      alert("Статус успешно изменён на COMPLETED")
    } catch (err) {
      console.error("Ошибка при завершении заказа", err)
      alert("Не удалось завершить заказ")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Посылки этого ПВЗ</DialogTitle>
          <DialogDescription>
            Только посылки в статусах CREATED, IN_PROGRESS, READY_FOR_PICKUP
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Поиск по трек-номеру"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {filteredOrders.length === 0 ? (
          <p className="text-sm text-gray-500">Нет подходящих посылок</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="border rounded p-3 bg-gray-50 space-y-1"
              >
                <p>
                  <span className="font-medium text-gray-900">Трек-номер:</span>{" "}
                  {order.trackingCode}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Описание:</span>{" "}
                  {order.description || "—"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Статус:</span>{" "}
                  {order.status}
                  {order.status === "IN_PROGRESS" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleStatusChange(order.id)}
                    >
                      {updatingOrderId === order.id
                        ? "Обновление..."
                        : "Заказ прибыл в пункт выдачи"}
                    </Button>
                  )}
                  {order.status === "READY_FOR_PICKUP" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={updatingOrderId === order.id}
                      onClick={() => handleClientReceived(order.id)}
                    >
                      {updatingOrderId === order.id
                        ? "Завершение..."
                        : "Клиент получил заказ"}
                    </Button>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Пользователь: {order.user.name} {order.user.surname} ({order.user.email})
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

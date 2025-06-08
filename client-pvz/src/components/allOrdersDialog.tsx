'use client'

import { useEffect, useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { orderService, OrderStatus } from "../app/tracking/order.service"
import { userService } from "@/src/services/user.service"
import { pvzService } from "@/src/app/my/pvz.service"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select"
import toast, { Toaster } from "react-hot-toast"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export function AllOrdersDialog({ open, setOpen }: Props) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userCache, setUserCache] = useState<Record<string, any>>({})
  const [pvzCache, setPvzCache] = useState<Record<string, any>>({})
  const [filters, setFilters] = useState({
    trackCode: "",
    address: "",
    status: "",
  })

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.CREATED)

  useEffect(() => {
    if (open) {
      loadOrdersWithUsersAndPvz()
    }
  }, [open])

  const loadOrdersWithUsersAndPvz = async () => {
    setLoading(true)
    try {
      const res = await orderService.getAllOrders()
      const fetchedOrders = res.data

      // Получаем уникальные userId и pvzId
      const uniqueUserIds = [...new Set(fetchedOrders.map((o: any) => o.userId))]
      const uniquePvzIds = [...new Set(fetchedOrders.map((o: any) => o.pvzId).filter(Boolean))]

      // Загружаем данные пользователей
      const usersMap: Record<string, any> = {}
      for (const id of uniqueUserIds) {
        try {
          const userRes = await userService.getUserById(String(id))
          usersMap[String(id)] = userRes.data
        } catch (err) {
          console.error(`Ошибка при загрузке пользователя ${id}:`, err)
        }
      }

      // Загружаем данные ПВЗ
      const pvzMap: Record<string, any> = {}
      for (const id of uniquePvzIds) {
        try {
          const pvzId = String(id)
          const pvzRes = await pvzService.getPvzById(pvzId)
          pvzMap[pvzId] = pvzRes.data
        } catch (err) {
          console.error(`Ошибка при загрузке ПВЗ ${id}:`, err)
        }
      }

      // Обогащаем заказы пользователями и ПВЗ
      const enrichedOrders = fetchedOrders.map((order: any) => ({
        ...order,
        user: usersMap[order.userId] || null,
        pvz: pvzMap[order.pvzId] || null,
      }))

      // Фильтруем по статусу: оставляем только CREATED и IN_PROGRESS
      const filteredByStatus = enrichedOrders.filter(
        (order: any) =>
          order.status === OrderStatus.CREATED ||
          order.status === OrderStatus.IN_PROGRESS
      )

      setOrders(filteredByStatus)
    } catch (e) {
      console.error("Ошибка загрузки заказов", e)
    } finally {
      setLoading(false)
    }
  }

  // Дополнительная фильтрация по трек-коду, адресу ПВЗ и пользовательскому полю "статус" (если нужно)
  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.trackingCode.toLowerCase().includes(filters.trackCode.toLowerCase()) &&
      (order.pvz?.address || "").toLowerCase().includes(filters.address.toLowerCase()) &&
      order.status.toLowerCase().includes(filters.status.toLowerCase())
    )
  }, [orders, filters])

  const openStatusDialog = (orderId: string) => {
    setSelectedOrderId(orderId)
    setStatusDialogOpen(true)
  }

  const handleStatusChange = async () => {
    if (!selectedOrderId || !newStatus) return
    try {
      await orderService.changeOrderStatus(newStatus, selectedOrderId)
      await loadOrdersWithUsersAndPvz()
      toast.success("Статус посылки успешно изменен")
      setStatusDialogOpen(false)
      setNewStatus(OrderStatus.CREATED)
    } catch (err) {
      toast.error("Ошибка при изменении статуса")
      console.error("Ошибка изменения статуса:", err)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Toaster position="top-right" reverseOrder={false} />
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Все посылки</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Поиск по трек-коду"
                value={filters.trackCode}
                onChange={e => setFilters({ ...filters, trackCode: e.target.value })}
              />
              <Input
                placeholder="Поиск по адресу ПВЗ"
                value={filters.address}
                onChange={e => setFilters({ ...filters, address: e.target.value })}
              />
              <Input
                placeholder="Поиск по статусу"
                value={filters.status}
                onChange={e => setFilters({ ...filters, status: e.target.value })}
              />
            </div>

            {loading ? (
              <p>Загрузка...</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto border rounded p-2 space-y-2 text-sm">
                {filteredOrders.map(order => (
                  <div key={order.id} className="border-b pb-2">
                    <p><strong>Трек-код:</strong> {order.trackingCode}</p>
                    <p><strong>Статус:</strong> {order.status}</p>
                    <p><strong>ПВЗ:</strong> {order.pvz?.address || "—"}</p>
                    <p><strong>Описание ПВЗ:</strong> {order.pvz?.description || "—"}</p>
                    <p><strong>Пользователь:</strong> {order.user?.email} ({order.user?.name} {order.user?.surname})</p>

                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => openStatusDialog(order.id)}
                    >
                      Изменить статус
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог изменения статуса */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Изменить статус посылки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newStatus} onValueChange={val => setNewStatus(val as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATED">CREATED</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusChange} disabled={!newStatus}>
              Подтвердить изменение
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

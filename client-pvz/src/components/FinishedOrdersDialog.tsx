'use client'

import { useEffect, useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { orderService, OrderStatus } from "../app/tracking/order.service"
import { pvzService } from "@/src/app/my/pvz.service"
import { useProfile } from "@/src/hooks/useProfile"
import { ReviewsService } from "../app/my/reviews.service"
import { Textarea } from "./ui/textarea"

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  filterByPvzId?: string
}

export function FinishedOrdersDialog({ open, setOpen, filterByPvzId }: Props) {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pvzCache, setPvzCache] = useState<Record<string, string>>({})
  const [pvzReviewMap, setPvzReviewMap] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [reviewDialog, setReviewDialog] = useState<{ pvzId: string; open: boolean }>({ pvzId: "", open: false })
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const { data: profile } = useProfile()
  const reviewsService = new ReviewsService()

  useEffect(() => {
    if (open) {
      loadOrdersAndReviews()
    }
  }, [open])

  const loadOrdersAndReviews = async () => {
    setLoading(true)
    try {
      // 1. Получаем все заказы пользователя
      const res = await orderService.getUserOrders()
      const filtered = res.data.filter(
        (order: any) =>
          (order.status === OrderStatus.CANCELED || order.status === OrderStatus.COMPLETED) &&
          (!filterByPvzId || order.pvzId === filterByPvzId)
      )

      // 2. Собираем уникальные pvzId
      const uniquePvzIds = Array.from(
        new Set(filtered.map((order: any) => order.pvzId).filter(Boolean))
      ) as string[]

      // 3. Загружаем адреса ПВЗ параллельно
      const pvzPromises = uniquePvzIds.map(pvzId =>
        pvzService.getPvzById(pvzId)
          .then(resp => ({ pvzId, address: resp.data.address }))
          .catch(() => ({ pvzId, address: "Адрес недоступен" }))
      )
      const pvzResults = await Promise.allSettled(pvzPromises)
      const pvzMap: Record<string, string> = {}
      pvzResults.forEach(r => {
        if (r.status === "fulfilled") {
          pvzMap[r.value.pvzId] = r.value.address
        }
      })

      // 4. Параллельно запрашиваем рейтинг пользователя для каждого PVZ
      const reviewPromises = uniquePvzIds.map(async pvzId => {
        try {
          const resp = await reviewsService.getUserReviewsAtPvz({ pvzId })
          const raw = resp.data as any
          const maybeNumber =
            typeof raw === "object" && raw !== null && "data" in raw
              ? (raw.data as number)
              : raw
          if (typeof maybeNumber === "number" && maybeNumber >= 1 && maybeNumber <= 5) {
            return { pvzId, rating: maybeNumber }
          } else {
            return { pvzId, rating: 0 }
          }
        } catch {
          return { pvzId, rating: 0 }
        }
      })

      const reviewResults = await Promise.allSettled(reviewPromises)
      const reviewMap: Record<string, number> = {}
      reviewResults.forEach(r => {
        if (r.status === "fulfilled") {
          const { pvzId, rating: userRating } = r.value
          if (userRating >= 1 && userRating <= 5) {
            reviewMap[pvzId] = userRating
          }
        }
      })

      // 5. Получаем список всех отзывов, чтобы решать, показывать ли кнопку
      const reviewsRes = await reviewsService.getMyReviews()
      setMyReviews(reviewsRes.data || [])

      setOrders(filtered)
      setPvzCache(pvzMap)
      setPvzReviewMap(reviewMap)
    } catch (e) {
      console.error("Ошибка загрузки данных", e)
    } finally {
      setLoading(false)
    }
  }

  // Фильтрация по трек-коду
  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.trackingCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [orders, searchTerm])

  const hasLeftReview = (pvzId: string) => {
    return myReviews.some(r => r.pvzId === pvzId)
  }

  const submitReview = async () => {
    try {
      await reviewsService.leaveReview({
        rating,
        comment,
        pvzId: reviewDialog.pvzId
      })
      alert("Спасибо за отзыв!")
      setReviewDialog({ open: false, pvzId: "" })
      loadOrdersAndReviews()
    } catch (e) {
      console.error("Ошибка при отправке отзыва", e)
      alert("Не удалось отправить отзыв")
    }
  }

  const getStatusStyle = (status: string) => {
    if (status === OrderStatus.CANCELED) {
      return "border border-red-500 text-red-700 bg-red-50 px-2 py-1 rounded text-xs inline-block"
    }
    if (status === OrderStatus.COMPLETED) {
      return "border border-blue-500 text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs inline-block"
    }
    return "text-xs"
  }

  // Группируем заказы по pvzId
  const ordersByPvz = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const order of filteredOrders) {
      const key = order.pvzId ? String(order.pvzId) : "no-pvz"
      if (!map[key]) {
        map[key] = []
      }
      map[key].push(order)
    }
    return map
  }, [filteredOrders])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Завершённые и отменённые посылки</DialogTitle>
          <DialogDescription>Поиск по трек-номеру</DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Введите трек-номер"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        {loading ? (
          <p>Загрузка...</p>
        ) : Object.keys(ordersByPvz).length === 0 ? (
          <p className="text-sm text-gray-500">Нет подходящих посылок.</p>
        ) : (
          // Оборачиваем список в контейнер с фиксированной высотой и скроллом
          <div className="max-h-[400px] overflow-y-auto space-y-6">
            {Object.entries(ordersByPvz).map(([pvzId, ordersList]) => (
              <div key={pvzId} className="border rounded p-4 space-y-3">
                <p className="font-medium">
                  <strong>ПВЗ:</strong> {pvzCache[pvzId] || "—"}
                </p>

                {ordersList.map(order => (
                  <div key={order.id} className="border-b pb-2 space-y-1">
                    <p><strong>Трек-код:</strong> {order.trackingCode}</p>
                    <p>
                      <strong>Статус:</strong>{" "}
                      <span className={getStatusStyle(order.status)}>{order.status}</span>
                    </p>
                    <p><strong>Описание:</strong> {order.description || "—"}</p>
                    <p>
                      <strong>Заказ {order.status === OrderStatus.CANCELED ? "отменен" : "получен"}:</strong>{" "}
                      {order.updatedAt
                        ? new Date(order.updatedAt).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "—"}
                    </p>

                    {order.status === OrderStatus.COMPLETED && order.pvzId && !hasLeftReview(order.pvzId) && (
                      <Button
                        variant="outline"
                        onClick={() => setReviewDialog({ pvzId: order.pvzId, open: true })}
                      >
                        Оставить отзыв о ПВЗ
                      </Button>
                    )}

                    {/* Рисуем звёздный рейтинг только для COMPLETED заказов, у которых есть review */}
                    {order.status === OrderStatus.COMPLETED &&
                      hasLeftReview(order.pvzId) &&
                      pvzReviewMap[pvzId] != null && (
                        <p className="mt-2 text-sm text-yellow-600">
                          Ваш рейтинг для этого ПВЗ:{" "}
                          {Array.from({ length: pvzReviewMap[pvzId] }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                          {Array.from({ length: 5 - pvzReviewMap[pvzId] }).map((_, i) => (
                            <span key={i} className="text-gray-300">★</span>
                          ))}
                        </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </DialogContent>

      {/* Диалог для ввода нового отзыва */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={() => setReviewDialog({ open: false, pvzId: "" })}
      >
        <DialogContent className="max-w-md space-y-3">
          <DialogHeader>
            <DialogTitle>Оставить отзыв</DialogTitle>
          </DialogHeader>
          <label className="block text-sm font-medium">Оценка (1–5)</label>
          <Input
            type="number"
            min={1}
            max={5}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          />
          <label className="block text-sm font-medium">Комментарий</label>
          <Textarea
            value={comment}
            onChange={(e: any) => setComment(e.target.value)}
            placeholder="Ваш отзыв"
          />
          <div className="flex justify-end">
            <Button onClick={submitReview}>Отправить</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

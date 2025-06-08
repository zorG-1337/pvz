'use client'

import { useEffect, useState, useMemo } from "react"
import { useProfile } from "@/src/hooks/useProfile"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Bell, Star } from "lucide-react"
import Link from "next/link"
import { authService } from "@/src/services/auth/auth.service"
import { getAllUsers } from "@/src/hooks/getAllUsers"

import { YMaps } from '@pbe/react-yandex-maps'
import { getAllPvz } from "./getPvz"
import { CreatePackageDialog } from "@/src/components/createPackage"
import { ViewUsersDialog } from "@/src/components/viewUsersDialog"
import { CreateUserDialog } from "@/src/components/сreateUserDialog"
import { CreatePvzDialog } from "@/src/components/createPvzDialog"
import { EditNameDialog } from "@/src/components/editNameDialog"
import { useMyPvz } from "@/src/hooks/useMyPvz"
import { PvzOrdersDialog } from "@/src/components/pvzOrdersDialog"
import { AllOrdersDialog } from "@/src/components/allOrdersDialog"
import { UserOrdersDialog } from "@/src/components/UserOrdersDialog"
import { FinishedOrdersDialog } from "@/src/components/FinishedOrdersDialog"
import { ReviewsService } from "@/src/app/my/reviews.service"
import { pvzService } from "./pvz.service"
import { changeData } from "@/src/services/data/changeNameAndSurname"
import toast, { Toaster } from "react-hot-toast"
import { LogoutButton } from "@/src/components/LogoutButton"

const YANDEX_API_KEY = '5d855952-b664-4ce5-aa6e-593fc3cefe7e'

export function My() {
  const { data, isLoading, refetch } = useProfile()
  const { data: users, isLoading: loadingUsers } = getAllUsers()
  const [openCreatePackageDialog, setOpenCreatePackageDialog] = useState(false)
  const { data: pvzs, isLoading: isLoadingPvzs } = getAllPvz()
  const { data: myPvz, isLoading: loadingMyPvz } = useMyPvz()

  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [viewUsersOpen, setViewUsersOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false)
  const [openAllOrdersDialog, setOpenAllOrdersDialog] = useState(false)
  const [userOrdersOpen, setUserOrdersOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openFinishedOrdersDialog, setOpenFinishedOrdersDialog] = useState(false)
  const [openPvzFinishedOrdersDialog, setOpenPvzFinishedOrdersDialog] = useState(false)

  // Новый стейт для среднего рейтинга
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [ratingLoading, setRatingLoading] = useState(false)
  const reviewsService = new ReviewsService()

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (open && data) {
      setName(data.name || "")
      setSurname(data.surname || "")
    }
    if (!open) {
      refetch()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await changeData.changNameAndSurname({ name, surname })
      toast.success("Данные успешно изменены")
      setDialogOpen(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const filteredUsers = useMemo(() => {
    if (!users?.data) return []
    if (!searchTerm.trim()) return users.data

    const term = searchTerm.toLowerCase()
    return users.data.filter((user: any) =>
      user.name?.toLowerCase().includes(term) ||
      user.surname?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    )
  }, [searchTerm, users])

  // При изменении myPvz (когда подгружен), запрашиваем средний рейтинг
  useEffect(() => {
    if (myPvz && myPvz.length > 0) {
      const pvzId = myPvz[0].id
      setRatingLoading(true)
      pvzService.getAveragePvzRating
        ({ pvzId })
        .then((resp: any) => {
          // Предположим, что API возвращает объект { data: { averageRating: number } }
          const raw = resp.data as any
          const avg = raw.averageRating ?? raw?.data ?? 0
          setAvgRating(typeof avg === "number" ? avg : 0)
        })
        .catch(() => setAvgRating(0))
        .finally(() => setRatingLoading(false))
    } else {
      setAvgRating(null)
    }
  }, [myPvz, reviewsService])

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
        <Link href={"/"}>
          <div className="flex items-center space-x-3">
            <img
            src="https://sun9-43.userapi.com/s/v1/ig2/ANp5WUgPgDaWQT5nOhU4Mzm2vq22iU6M6rk3I47Lo4z7Ot6hqvb2ncMQbAJgQAIMRgsA_fMEeI8qb7e_QIakuLhF.jpg?quality=95&as=32x32,48x48,72x71,108x107,160x159,240x238,360x357,480x476,540x536,640x635,720x715,1080x1072,1280x1271,1440x1430,1511x1500&from=bu&u=N1TEgnyAjM5fKGvReyUUJfb36xGErIOZzhteZWHKNS8&cs=807x801"
            alt="Логотип"
            className="w-12 h-12 rounded-full object-cover"
          />
            <h1 className="text-xl font-bold text-gray-800">RB Delivery</h1>
          </div>
        </Link>
        <nav className="space-x-4">
          <Button asChild variant="ghost">
            <Link href="/">Главная</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/tracking">Отслеживание</Link>
          </Button>
          <LogoutButton />
        </nav>
      </header>

      <Card className="w-full max-w-8xl mx-auto">
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : data ? (
            <div>
              <p>Имя: {data.name}</p>
              <p>Фамилия: {data.surname}</p>
              <p>Email: {data.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Button onClick={() => setDialogOpen(true)}>Изменить имя и фамилию</Button>
                <Button onClick={() => setOpenCreatePackageDialog(true)}>Создать новую посылку</Button>
                <Button onClick={() => setUserOrdersOpen(true)} className="ml-2">Мои посылки</Button>
              </div>
              <div className="flex space-x-2 mt-4">
                {data?.status === "SUPER_ADMIN" && 
                <>
                <Button onClick={() => setMapOpen(true)}>Создать ПВЗ</Button>
                <Button onClick={() => setOpenAllOrdersDialog(true)} className="ml-2">
                  Посмотреть все посылки
                </Button>
                <Button onClick={() => setOpenFinishedOrdersDialog(true)} className="ml-2">
                  Завершённые и отменённые посылки
                </Button>
                <Button onClick={() => setCreateUserOpen(true)} className="ml-2">
                  Создать пользователя
                </Button>
                <Button onClick={() => setViewUsersOpen(true)} className="ml-2">
                  Посмотреть всех пользователей
                </Button>
                </>
                }          
              </div>
            </div>
          ) : (
            <p>Нет данных</p>
          )}
        </CardContent>
      </Card>

      <EditNameDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        name={name}
        surname={surname}
        onChangeName={setName}
        onChangeSurname={setSurname}
        onSubmit={handleSubmit}
      />

      <CreateUserDialog open={createUserOpen} setOpen={setCreateUserOpen} />
      <ViewUsersDialog
        open={viewUsersOpen}
        setOpen={setViewUsersOpen}
        users={filteredUsers}
        loading={loadingUsers}
      />

      <UserOrdersDialog open={userOrdersOpen} setOpen={setUserOrdersOpen} />

      <YMaps query={{ apikey: YANDEX_API_KEY }}>
        <CreatePvzDialog open={mapOpen} setOpen={setMapOpen} />
      </YMaps>

      <CreatePackageDialog
        open={openCreatePackageDialog}
        setOpen={setOpenCreatePackageDialog}
        allPvz={pvzs?.data ?? []}
      />

      {myPvz && myPvz.length > 0 && (data?.status === "ADMIN_PVZ" || data?.status === "SUPER_ADMIN" ) ? (
        <div className="mt-6 rounded-xl border bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Ваш ПВЗ</h2>
            <div className="space-x-2">
              <Button size="sm" onClick={() => setOpenOrdersDialog(true)}>
                Посмотреть посылки
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setOpenPvzFinishedOrdersDialog(true)}
              >
                Завершённые посылки
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <div>
                <span className="font-medium text-gray-900">Название:</span>{" "}
                {myPvz[0].name || "—"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Адрес:</span>{" "}
                {myPvz[0].address}
              </div>
              <div>
                <span className="font-medium text-gray-900">Описание:</span>{" "}
                {myPvz[0].description || "—"}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {ratingLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : avgRating !== null ? (
                <Badge className="text-lg font-medium">
                  {avgRating.toFixed(1)} / 5
                </Badge>
              ) : (
                <Badge variant="outline">— / 5</Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 text-sm text-gray-500">{data?.status === "ADMIN_PVZ" ? "У вас нет назначенного ПВЗ" : ""}</div>
      )}

      <PvzOrdersDialog
        open={openOrdersDialog}
        setOpen={setOpenOrdersDialog}
        orders={myPvz?.[0]?.orders ?? []}
      />

      <FinishedOrdersDialog
        open={openPvzFinishedOrdersDialog}
        setOpen={setOpenPvzFinishedOrdersDialog}
        filterByPvzId={myPvz?.[0]?.id}
      />

      <FinishedOrdersDialog
        open={openFinishedOrdersDialog}
        setOpen={setOpenFinishedOrdersDialog}
      />

      <AllOrdersDialog open={openAllOrdersDialog} setOpen={setOpenAllOrdersDialog} />
    </div>
  )
}

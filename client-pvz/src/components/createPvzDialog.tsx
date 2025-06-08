'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { YMaps, Map, Placemark, useYMaps } from "@pbe/react-yandex-maps"
import { useEffect, useMemo, useState } from "react"
import { getAllUsers } from "@/src/hooks/getAllUsers"
import { pvzService } from "@/src/app/my/pvz.service"

const YANDEX_API_KEY = '5d855952-b664-4ce5-aa6e-593fc3cefe7c'

export const CreatePvzDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const { data: users, isLoading } = getAllUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [placemarkCoords, setPlacemarkCoords] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const filteredUsers = useMemo(() => {
    if (!users?.data) return []
    const term = searchTerm.toLowerCase()
    return users.data.filter((user: any) =>
      user.name.toLowerCase().includes(term) ||
      user.surname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    )
  }, [searchTerm, users])

  const ymaps = useYMaps(['geocode'])
  const [center, setCenter] = useState<[number, number]>([54.7388, 55.9721])
  const [zoom, setZoom] = useState(11)
  const [inputAddress, setInputAddress] = useState("")

  const handleMapClick = async (e: any) => {
    const coords = e.get("coords") as [number, number]
    setPlacemarkCoords(coords)
    setCenter(coords)
    setZoom(15)

    if (ymaps) {
      const result = await ymaps.geocode(coords)
      const firstGeoObject = result.geoObjects.get(0) as any
      const foundAddress = firstGeoObject?.getAddressLine?.() || "Адрес не найден"
      setAddress(foundAddress)
      setInputAddress(foundAddress)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ymaps) return
    const result = await ymaps.geocode(inputAddress)
    const firstGeoObject = result.geoObjects.get(0) as any
    const coords = firstGeoObject.geometry.getCoordinates() as [number, number]
    setPlacemarkCoords(coords)
    setCenter(coords)
    setZoom(15)
    setAddress(inputAddress)
  }

  const handleCreatePVZ = async () => {
    if (!placemarkCoords || !selectedUserId) return

    const payload = {
      name: "-",
      address,
      description,
      latitude: placemarkCoords[0],
      longitude: placemarkCoords[1],
      userIds: [selectedUserId],
    }

    try {
      await pvzService.createPvz(payload)
      setOpen(false)
      setPlacemarkCoords(null)
      setAddress("")
      setDescription("")
      setSelectedUserId(null)
    } catch (error) {
      console.error("Ошибка при создании ПВЗ:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать ПВЗ</DialogTitle>
        </DialogHeader>
        <YMaps query={{ apikey: YANDEX_API_KEY }}>
          <Map
            state={{ center, zoom }}
            width="100%"
            height="400px"
            onClick={handleMapClick}
          >
            {placemarkCoords && <Placemark geometry={placemarkCoords} />}
          </Map>
        </YMaps>

        <form onSubmit={handleAddressSubmit} className="space-x-2 mt-4">
          <Input
            placeholder="Введите адрес"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <Button type="submit">Найти</Button>
        </form>

        <Input
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />

        <Input
          placeholder="Поиск пользователя"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />

        <div className="max-h-48 overflow-y-auto border rounded p-2">
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
            filteredUsers.map((user: any) => (
              <label key={user.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="selectedUser"
                  checked={selectedUserId === user.id}
                  onChange={() => setSelectedUserId(user.id)}
                />
                <span>{user.name} {user.surname} ({user.email})</span>
              </label>
            ))
          )}
        </div>

        <Button onClick={handleCreatePVZ} className="mt-4" disabled={!selectedUserId || !placemarkCoords}>
          Создать ПВЗ
        </Button>
      </DialogContent>
    </Dialog>
  )
}

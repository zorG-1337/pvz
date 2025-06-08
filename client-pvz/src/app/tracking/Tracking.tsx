'use client'

import { useEffect, useState } from 'react'
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import Link from 'next/link'
import { useProfile } from '@/src/hooks/useProfile'
import { orderService } from './order.service'
import { pvzService } from '../my/pvz.service'

import { YMaps, Map } from '@pbe/react-yandex-maps'
import toast, { Toaster } from 'react-hot-toast'

export function Tracking() {
  const [trackNumber, setTrackNumber] = useState('')
  const [trackingInfo, setTrackingInfo] = useState<null | string>(null)
  const [pvzData, setPvzData] = useState<null | any>(null)
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [ymapsInstance, setYmapsInstance] = useState<any>(null)
  const [routeInstance, setRouteInstance] = useState<any>(null)

  const { data } = useProfile()

  const handleCheckTracking = async () => {
    const trackNumberNormal = trackNumber.trim()

    try {
      const data = await orderService.findOrder({ trackingCode: trackNumberNormal })

      if (!data) {
        setTrackingInfo("Заказ не найден.")
        toast.error("Заказ не найден")
        setPvzData(null)
        setUserCoords(null)
        if (routeInstance && mapInstance) {
          mapInstance.geoObjects.remove(routeInstance)
          setRouteInstance(null)
        }
      } else {
        toast.success("Заказ найден!")
        setTrackingInfo(`Заказ найден: статус — ${data.status}`)
        const response = await (await pvzService.getPvzById(data.pvzId)).data
        setPvzData(response)

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userPosition = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              }
              setUserCoords(userPosition)
            },
            (error) => {
              console.warn("Геолокация не разрешена или недоступна", error)
              setUserCoords(null)
              setTrackingInfo("Геолокация не разрешена или недоступна")
              if (mapInstance) mapInstance.geoObjects.removeAll()
              setRouteInstance(null)
            }
          )
        }
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error)
      setTrackingInfo("Ошибка при запросе. Проверьте трек-номер.")
      setPvzData(null)
      setUserCoords(null)
      if (mapInstance) mapInstance.geoObjects.removeAll()
      setRouteInstance(null)
    }
  }

  useEffect(() => {
    if (
      ymapsInstance &&
      mapInstance &&
      userCoords &&
      pvzData?.latitude &&
      pvzData?.longitude &&
      !routeInstance
    ) {
      ymapsInstance.modules.require(['multiRouter.MultiRoute'], (MultiRoute: any) => {
        const multiRoute = new MultiRoute(
          {
            referencePoints: [
              [userCoords.lat, userCoords.lon],
              [pvzData.latitude, pvzData.longitude],
            ],
            params: { routingMode: 'auto' },
          },
          {
            boundsAutoApply: true,
            wayPointVisible: false,
            viaPointVisible: false,
            balloonVisible: false,
          }
        )

        mapInstance.geoObjects.removeAll()
        mapInstance.geoObjects.add(multiRoute)
        setRouteInstance(multiRoute)

        const userPlacemark = new ymapsInstance.Placemark(
          [userCoords.lat, userCoords.lon],
          {},
          { preset: 'islands#blueDotIcon' }
        )
        const pvzPlacemark = new ymapsInstance.Placemark(
          [pvzData.latitude, pvzData.longitude],
          {},
          { preset: 'islands#redIcon' }
        )
        mapInstance.geoObjects.add(userPlacemark)
        mapInstance.geoObjects.add(pvzPlacemark)
      })
    }
  }, [ymapsInstance, mapInstance, userCoords, pvzData, routeInstance])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
        <Link href="/">
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
          <Button asChild variant="ghost"><Link href="/">Главная</Link></Button>
          <Button asChild variant="ghost"><Link href="/tracking">Отслеживание</Link></Button>
          {data ? (
            <Button asChild variant="default"><a href="/my">Профиль</a></Button>
          ) : (
            <Button asChild variant="default"><a href="/auth">Войти</a></Button>
          )}
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border">
          <div className="bg-indigo-50 p-6 flex items-center justify-center md:w-1/2">
            <img src="https://cdn-icons-png.flaticon.com/512/4462/4462810.png" alt="Tracking illustration" className="max-w-[180px] md:max-w-[220px]" />
          </div>

          <div className="p-8 md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Отследить заказ</h2>
            <p className="text-gray-600 mb-6 text-center">Введите номер отслеживания, чтобы узнать текущий статус доставки</p>

            <div className="flex gap-2 mb-4">
              <Input placeholder="RB-123456789" value={trackNumber} onChange={(e) => setTrackNumber(e.target.value)} />
              <Button onClick={handleCheckTracking}>Проверить</Button>
            </div>

            {trackingInfo && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                {trackingInfo}
              </div>
            )}

            {pvzData && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 text-sm">
                <h4 className="font-semibold text-base mb-1">Информация о ПВЗ:</h4>
                <p><strong>Адрес:</strong> {pvzData.address}</p>
                {pvzData.phone && <p><strong>Телефон:</strong> {pvzData.phone}</p>}
                {pvzData.workingHours && <p><strong>Время работы:</strong> {pvzData.workingHours}</p>}
              </div>
            )}

            {pvzData && (
              <div className="mt-4 h-64 w-full rounded border border-gray-300 overflow-hidden">
                <YMaps query={{ apikey: '5d855952-b664-4ce5-aa6e-593fc3cefe7c', lang: 'ru_RU' }}>
                  <Map
                    defaultState={{ center: [55.76, 37.64], zoom: 10 }}
                    width="100%"
                    height="100%"
                    onLoad={setYmapsInstance}
                    instanceRef={setMapInstance}
                  />
                </YMaps>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white py-6 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RB Delivery — Все права защищены.
      </footer>
    </div>
  )
}
  
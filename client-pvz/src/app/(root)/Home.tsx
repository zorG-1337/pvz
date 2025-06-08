'use client'

import { useRef } from "react"
import { Button } from "@/src/components/ui/button"
import { useProfile } from "@/src/hooks/useProfile"
import Link from "next/link"
import { YandexMapTest } from "./testMap"

export function Home() {
  const { data, isLoading } = useProfile()
  const mapRef = useRef<HTMLDivElement | null>(null)

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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
          <Button asChild variant="default">
            <Link href={data ? "/my" : "/auth"}>{data ? 'Профиль' : "Войти"}</Link>
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Быстрая выдача ваших заказов</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            RB Delivery — это не просто доставка. Это сеть пунктов выдачи, где вы можете получить свои заказы быстро и удобно.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="default" onClick={scrollToMap}>
              Найти пункт выдачи
            </Button>
          </div>
        </section>

        {/* Описание сервиса */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Что такое RB Delivery?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Мы — платформа, которая помогает вам получать товары без доставки. Просто оформите заказ онлайн,
              выберите ближайший пункт выдачи и заберите его в удобное время.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Удобные пункты выдачи</h3>
                <p className="text-gray-600">
                  Более 30 точек по городу. Рядом с домами и офисами.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Круглосуточный доступ</h3>
                <p className="text-gray-600">
                  Забирайте заказ в любое время — наши пункты работают 24/7.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Безопасность и надёжность</h3>
                <p className="text-gray-600">
                  Каждый пункт оснащён камерами и системой хранения. Ваш заказ в безопасности.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Интеграция с магазинами</h3>
                <p className="text-gray-600">
                  Подключайтесь как магазин и используйте нашу сеть для выдачи своих товаров.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Преимущества */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">Много пунктов выдачи</h3>
                <p className="text-gray-600">
                  Пункты расположены рядом с офисами, жилыми районами и торговыми центрами.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-2">Экономия времени</h3>
                <p className="text-gray-600">
                  Заберите заказ тогда, когда вам удобно — без ожидания курьера.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">Просто и безопасно</h3>
                <p className="text-gray-600">
                  Введите номер заказа — и ваша посылка у вас.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        {/* Отзывы пользователей */}
<section className="bg-white py-16 px-6">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Отзывы наших клиентов</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-700 italic">"Очень удобно! Забрал посылку за 2 минуты — никаких очередей."</p>
        <p className="text-sm text-gray-500 mt-4 text-right">— Алексей</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-700 italic">"Работает круглосуточно, что для меня — просто находка."</p>
        <p className="text-sm text-gray-500 mt-4 text-right">— Мария</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <p className="text-gray-700 italic">"Уже подключил свой магазин — теперь выдаём заказы через RB Delivery."</p>
        <p className="text-sm text-gray-500 mt-4 text-right">— Дмитрий, владелец магазина</p>
      </div>
    </div>
  </div>
</section>

        {/* Карта с ref */}
        <section ref={mapRef} className="bg-gray-50 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Найдите ближайший пункт выдачи</h2>
            <div className="w-full h-[400px]">
              <YandexMapTest />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RB Delivery. Все права защищены.
      </footer>
    </div>
  )
}

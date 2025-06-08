'use client'
import React from "react"
import { useRouter } from "next/navigation"     // или `next/router` для pages-router
import toast from "react-hot-toast"
import { Button } from "@/src/components/ui/button"
import { authService } from "@/src/services/auth/auth.service"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault() // чтобы ссылка не срабатывала сразу

    try {
      const success = await authService.logout()
      if (success) {
        toast.success("Успешный выход из профиля")
        router.replace("/auth")
      } else {
        toast.error("Не удалось выйти")
      }
    } catch (err) {
      toast.error("Ошибка при выходе")
      console.error(err)
    }
  }

  return (
    <Button variant="default" onClick={handleLogout}>
      Выйти
    </Button>
  )
}
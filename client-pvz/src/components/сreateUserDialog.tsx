'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { useState } from "react"
import { createUserByAdminService } from "@/src/app/my/createUserByAdmin.service"
import toast, { Toaster } from "react-hot-toast"

interface CreateUserDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CreateUserDialog = ({ open, setOpen }: CreateUserDialogProps) => {
  const [newUserData, setNewUserData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "USER",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newUserData.password !== newUserData.confirmPassword) {
      alert("Пароли не совпадают")
      return
    }
    try {
      await createUserByAdminService.main(newUserData)
      toast.success("Пользователь успешно создан")
      setOpen(false)
      setNewUserData({
        name: "",
        surname: "",
        email: "",
        password: "",
        confirmPassword: "",
        status: "USER",
      })
    } catch (error) {
      toast.error("Ошибка при создании пользователя")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" reverseOrder={false} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать нового пользователя</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Имя"
            name="name"
            value={newUserData.name}
            onChange={handleChange}
          />
          <Input
            placeholder="Фамилия"
            name="surname"
            value={newUserData.surname}
            onChange={handleChange}
          />
          <Input
            placeholder="Email"
            name="email"
            type="email"
            value={newUserData.email}
            onChange={handleChange}
          />
          <Input
            placeholder="Пароль"
            name="password"
            type="password"
            value={newUserData.password}
            onChange={handleChange}
          />
          <Input
            placeholder="Подтверждение пароля"
            name="confirmPassword"
            type="password"
            value={newUserData.confirmPassword}
            onChange={handleChange}
          />
          <select
            name="status"
            value={newUserData.status}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="USER">Пользователь</option>
            <option value="ADMIN_PVZ">Администратор ПВЗ</option>
            <option value="SUPER_ADMIN">Супер админ</option>
          </select>
          <Button type="submit">Создать</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// src/components/EditNameDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  surname: string
  onChangeName: (value: string) => void
  onChangeSurname: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const EditNameDialog = ({
  open,
  onOpenChange,
  name,
  surname,
  onChangeName,
  onChangeSurname,
  onSubmit,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изменить имя и фамилию</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Имя</Label>
            <Input id="name" value={name} onChange={(e) => onChangeName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="surname">Фамилия</Label>
            <Input id="surname" value={surname} onChange={(e) => onChangeSurname(e.target.value)} />
          </div>
          <Button type="submit">Сохранить</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

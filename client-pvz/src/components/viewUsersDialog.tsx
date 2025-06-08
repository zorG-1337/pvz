'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"
import { UserIcon, MailIcon, ShieldIcon } from "lucide-react"

interface ViewUsersDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  users: any[]
  loading: boolean
}

export const ViewUsersDialog = ({
  open,
  setOpen,
  users,
  loading,
}: ViewUsersDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Все пользователи</DialogTitle>
          <DialogDescription>Ниже представлен список зарегистрированных пользователей.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-80 pr-2">
          {loading ? (
            <p className="text-sm text-gray-500">Загрузка...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-gray-500">Пользователи не найдены</p>
          ) : (
            users.map((user: any) => (
              <div
                key={user.id}
                className="flex flex-col border-b py-3 text-sm text-gray-800"
              >
                <div className="flex items-center space-x-2">
                  <UserIcon size={16} className="text-muted-foreground" />
                  <span className="font-medium">
                    {user.name} {user.surname}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MailIcon size={16} className="text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldIcon size={16} className="text-muted-foreground" />
                  <Badge variant="outline">{user.status}</Badge>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

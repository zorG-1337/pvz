import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useState } from "react"
import { pvzService } from "../app/my/pvz.service"
import { orderService } from "../app/tracking/order.service"
import toast, { Toaster } from "react-hot-toast"

export const CreatePackageDialog = ({
  open,
  setOpen,
  allPvz,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  allPvz: { id: string; address: string, latitude: number, longitude: number }[]
}) => {
  const [description, setDescription] = useState("")
  const [selectedPvzId, setSelectedPvzId] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!description || !selectedPvzId) return
    console.log("Создание посылки:", { description, selectedPvzId })
    try {
        orderService.createOrder({description, selectedPvzId})
        toast.success("Посылка успешно создана")
    }
    catch (error) {
      console.error("Ошибка при создании посылки:", error)
      toast.error("Ошибка при создании посылки")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster position="top-right" reverseOrder={false} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создание посылки</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Название</Label>
            <Input value={description} onChange={(e: any) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>ПВЗ</Label>
            <Select onValueChange={(value: any) => setSelectedPvzId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите ПВЗ" />
              </SelectTrigger>
              <SelectContent>
                {allPvz.map((pvz) => (
                  <SelectItem key={pvz.id} value={pvz.id}>
                    {pvz.address}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={!description || !selectedPvzId}>
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

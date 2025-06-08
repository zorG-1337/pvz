import { axiosWithAuth } from "@/src/api/api.interceptors"
import { AxiosError } from "axios"

export enum OrderStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

class OrderService {
    async findOrder(payload: { trackingCode: string }) {
    try {
      const response = await axiosWithAuth({
        url: "http://localhost:5000/orders/find-order-by-code",
        method: "POST",
        data: payload,
      })
      // Сервер вернул 200 + тело заказа
      return response.data
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        // Если сервер прислал 404, считаем, что заказ не найден
        if (err.response.status === 404) {
          return null
        }
        // Если сервер вернул 400 с сообщением «неверный трек» — тоже можно вернуть null
        if (err.response.status === 400) {
          return null
        }
      }
      // Во всех остальных случаях (500, сеть, прочее) пробрасываем ошибку дальше
      throw err
    }
  }

    async createOrder(payload: {selectedPvzId: string, description: string}) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/create-order",
            method: "POST",
            data: payload

        })

        return response
    }

    async getAllOrders() {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders",
            method: "GET"

        })
        return response
    }

    async changeOrderStatus(status: OrderStatus, orderId: string) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/change-order-status",
            method: "POST",
            data: {
                status,
                orderId
            }

        })
        return response
    }

    async getUserOrders() {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/get-users-orders",
            method: "GET"
        })
        return response
    }

    async changeOrderStatusToCanceled(orderId :string) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/chagnge-order-status-to-cancelled",
            method: "PUT",
            data: {
                orderId
            }
        })
        return response
    }

    async changeOrderStatusToReadyForPickup(orderId :string) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/chagnge-order-status-to-ready-for-pickup",
            method: "PUT",
            data: {
                orderId
            }
        })
        return response
    }

    async changeOrderStatusToReadyForCompleted(orderId :string) {
        const response = await axiosWithAuth({
            url: "http://localhost:5000/orders/chagnge-order-status-to-completed",
            method: "PUT",
            data: {
                orderId
            }
        })
        return response
    }

}

export const orderService = new OrderService()
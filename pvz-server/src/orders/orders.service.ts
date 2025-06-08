import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';

export enum OrderStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {

    }

    async getOrderByTrackCode(dto: OrderDto) {
  const order = await this.prisma.order.findFirst({
    where: { trackingCode: dto.trackingCode }
  })

  if (!order) {
    throw new NotFoundException("Заказ с таким трек-номером не найден")
  }

  return order
}

    async getAllOrders() {
        const orders = await this.prisma.order.findMany()

        return orders
    }

    async createOrder(id: string, data: any) {
        const prefix = 'RB-11';
    
        // Генерируем 10 случайных цифр
        let digits = '';
        for (let i = 0; i < 10; i++) {
            digits += Math.floor(Math.random() * 10).toString();
        }

        const trackingCode = prefix + digits; 

        const order = await this.prisma.order.create({
            data: {
                trackingCode: trackingCode,
                userId: id,
                pvzId: data.selectedPvzId,
                description: data.description
                

            }
        })

        return order
    }

    async changeOrderStatus(status: OrderStatus.CREATED | OrderStatus.IN_PROGRESS, orderId) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status
            }
        })

        return order
    }

    async getUserOrders(id: string) {
        const orders = await this.prisma.order.findMany({
            where: {
                userId:  id
            }
        })

        return orders
    }

    async changeOrderStatusToCanceled(orderId: string) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'CANCELED'
            }
        })

        return order
    }

    async changeOrderStatusToReadyForPickup(orderId: string) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'READY_FOR_PICKUP'
            }
        })

        return order
    }

    async changeOrderStatusToCompleted(orderId: string) {
        const order = await this.prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'COMPLETED'
            }
        })

        return order
    }

    
}

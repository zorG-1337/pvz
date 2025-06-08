import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { OrdersService, OrderStatus } from './orders.service';
import { OrderDto } from './order.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('find-order-by-code')
  async findOrder(@Body() dto: OrderDto) {
    return this.ordersService.getOrderByTrackCode(dto)
  }

  @Get()
  @Auth()
  async getAllOrders() {
    return this.ordersService.getAllOrders()
  }

  @Post("create-order")
  @Auth()
  async createOrder(@CurrentUser('id') id: string, @Body() data: any) {
    return this.ordersService.createOrder(id, data)
  }

  @Auth()
  @Post("change-order-status")
  async changeOrderStatus(@Body() data: {status: OrderStatus.CREATED | OrderStatus.IN_PROGRESS, orderId: string}) {
    return this.ordersService.changeOrderStatus(data.status, data.orderId)
  }

  @Auth()
  @Get("get-users-orders")
  async getUserOrders(@CurrentUser("id") id: string) {
    return this.ordersService.getUserOrders(id)
  }

  @Auth()
  @Put("chagnge-order-status-to-cancelled")
  async changeOrderStatusToCanceled(@Body() data: {orderId: string}) {
    return this.ordersService.changeOrderStatusToCanceled(data.orderId)
  }

  @Auth()
  @Put("chagnge-order-status-to-ready-for-pickup")
  async changeOrderStatusToReadyForPickup(@Body() data: {orderId: string}) {
    return this.ordersService.changeOrderStatusToReadyForPickup(data.orderId)
  }

  @Auth()
  @Put("chagnge-order-status-to-completed")
  async changeOrderStatusToCompleted(@Body() data: {orderId: string}) {
    return this.ordersService.changeOrderStatusToCompleted(data.orderId)
  }
}

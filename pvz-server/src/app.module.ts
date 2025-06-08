import { Module } from '@nestjs/common';

import {ConfigModule} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PvzModule } from './pvz/pvz.module';
import { NotificationModule } from './notification/notification.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, NotificationsModule, OrdersModule, PvzModule, NotificationModule, ReviewsModule],
})
export class AppModule {}

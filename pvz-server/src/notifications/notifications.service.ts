import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationsService {

    constructor(private readonly prisma: PrismaService) {

    }

    
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PVZDto } from './pvz.dto';

@Injectable()
export class PvzService {
    constructor(private readonly prisma: PrismaService) {

    }

    async createPVZ(data: any) {

        console.log(data.longitude)
        console.log(data.description)
        const pvz = await this.prisma.pVZ.create({
            data: {
                name: data.name,
                description: data.description,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                admin: {
                    connect: {
                        id: data.userIds[0]
                    }
                }
            },
            
        })

        return pvz
            
    }

    async getAllPvz() {
        const pvz = await this.prisma.pVZ.findMany({
            select: {
                address: true,
                latitude: true,
                longitude: true,
                id: true
            }
        })

        return pvz
    }

    async getPvzById(data: {id: string}) {
        const response = await this.prisma.pVZ.findFirst({
            where: {
                id: data.id
            }
        })

        return response
    }

    async getMyPvz(id: string) {
  return this.prisma.pVZ.findMany({
    where: {
      adminId: id
    },
    include: {
      orders: {
        select: {
          id: true,
          trackingCode: true,
          description: true,
          status: true,
          userId: true,
          pvzId: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              surname: true
            }
          }
        }
      }
    }
  })
}

}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewsService {
    constructor(private readonly prisma: PrismaService) {}

    async leaveReview(userId: string, data: ReviewDto) {
        const review = await this.prisma.review.create({
            data: {
            rating: data.rating,
            comment: data.comment,
            user: {
                connect: { id: userId }
            },
            pvz: {
                connect: { id: data.pvzId }
            }
        }
    })

    return review
    }

    async getMyReviews(id: string) {
        const reviews = await this.prisma.review.findMany({
            where: {
                userId: id
            }
        })

        return reviews
    }

    async getUserReviewsAtPvz(pvzId: string, userId: string) {
        const review = await this.prisma.review.findFirst({
            where: {
                pvzId,
                userId
            }
        })

        return review.rating
    }

    async getAveragePvzRating(pvzId: string) {
  const result = await this.prisma.review.aggregate({
    where: { pvzId },
    _avg: { rating: true },
  })
  
  return {
    averageRating: result._avg.rating ?? 0,
    count: await this.prisma.review.count({ where: { pvzId } }),
  }
    }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { ReviewDto } from './review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}


  @Auth()
  @Post("leave-review")
  async leaveReview(@CurrentUser("id") id: string, @Body() data: ReviewDto) {
    return this.reviewsService.leaveReview(id, data)
  }

  @Auth()
  @Get("my-reviews")
  async getMyReviews(@CurrentUser("id") id: string) {
    return this.reviewsService.getMyReviews(id)
  }

  @Auth()
  @Get("get-user-review-at-pvz")
  async getUserReviewsAtPvz(@CurrentUser("id") id: string, @Body() data: {pvzId: string}) {
    return this.reviewsService.getUserReviewsAtPvz(data.pvzId, id)
  }

  @Auth()
  @Post("get-average-pvz-rating")
  async getAveragePvzRating(@Body() data: any) {
    return this.reviewsService.getAveragePvzRating(data.pvzId)
  }
}

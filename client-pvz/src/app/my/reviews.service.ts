import { axiosWithAuth } from "@/src/api/api.interceptors"

export class ReviewsService {
    async leaveReview(payload: {rating: number, comment: string, pvzId: string}) {
            const response = await axiosWithAuth({
                        url: 'http://localhost:5000/reviews/leave-review',
                        method: 'POST',
                        data: payload
            })
    
            return response
    }

    async getMyReviews() {
        const response = await axiosWithAuth({
                    url: 'http://localhost:5000/reviews/my-reviews',
                    method: 'GET',
        })
    
        return response
    }

    async getUserReviewsAtPvz(data: {pvzId: string}) {
        const response = await axiosWithAuth({
                    url: 'http://localhost:5000/reviews/get-user-review-at-pvz',
                    method: 'GET',
                    data
        })
    
        return response
    }
}

export const reviewService = new ReviewsService()
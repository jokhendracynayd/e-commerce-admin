import { reviewsApi } from '@/lib/api/reviews-api';
import { PaginatedReviewResponse, Review, ReviewListParams, ReviewStats } from '@/types/review';

export interface ReviewsServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

class ReviewsService {
  async getReviews(params: ReviewListParams = {}): Promise<ReviewsServiceResponse<PaginatedReviewResponse>> {
    try {
      const res = await reviewsApi.getReviews(params);
      return { success: true, data: res };
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      return {
        success: false,
        data: { reviews: [], total: 0, page: 1, limit: 10, totalPages: 0 },
        error: error.message || 'Failed to fetch reviews',
      };
    }
  }

  async getStats(): Promise<ReviewsServiceResponse<ReviewStats>> {
    try {
      const res = await reviewsApi.getReviewStats();
      return { success: true, data: res };
    } catch (error: any) {
      console.error('Error fetching review stats:', error);
      return {
        success: false,
        data: { total: 0, averageRating: 0, pending: 0, reported: 0 },
        error: error.message || 'Failed to fetch review stats',
      };
    }
  }
}

export const reviewsService = new ReviewsService();
export default reviewsService;



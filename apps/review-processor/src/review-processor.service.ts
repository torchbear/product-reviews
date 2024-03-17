import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../product-reviews/src/reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductRating } from './entities/product-rating.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ReviewsService } from '../../product-reviews/src/reviews/reviews.service';

/**
 * ReviewProcessorService class
 * Handles product rating updates
 */
@Injectable()
export class ReviewProcessorService {
  /**
   * ReviewProcessorService constructor
   *
   * @param {Repository<Review>} reviewsRepository reviews repository
   * @param {Repository<ProductRating>} productRatingRepository product rating repository
   * @param {Cache} cacheService cache service
   */
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ProductRating)
    private productRatingRepository: Repository<ProductRating>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}

  /**
   * Updates the rating for the given product IDs
   * Calculates the average product rating and stores it in the database
   *
   * @param {number[]} productIds product IDs
   * @returns {Promise<void>}
   */
  async ratingUpdate(productIds: number[]): Promise<void> {
    for (const productId of productIds) {
      const product: Product = new Product();
      product.id = productId;
      const reviews: Review[] = await this.reviewsRepository.find({
        where: { product: product },
      });
      if (reviews.length === 0) {
        console.debug(`No reviews found for product ${productId}`);
        continue;
      }
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0,
      );
      const averageRating = totalRating / reviews.length;
      console.debug(
        `Updating rating for product ${productId} to ${averageRating}`,
      );
      await this.productRatingRepository.upsert(
        [{ product: product, rating: averageRating }],
        ['product'],
      );
      await this.cacheService.del(`product_${productId}`);
      await this.cacheService.del('products');
      console.debug(
        `Rating updated for product ${productId} to ${averageRating}`,
      );
    }
  }
}

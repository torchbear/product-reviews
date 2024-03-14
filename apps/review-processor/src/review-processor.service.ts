import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../../product-reviews/src/reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductRating } from './entities/product-rating.entity';

@Injectable()
export class ReviewProcessorService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(ProductRating)
    private productRatingRepository: Repository<ProductRating>,
  ) {}

  async ratingUpdate(productIds: number[]) {
    for (const productId of productIds) {
      const product = new Product();
      product.id = productId;
      const reviews = await this.reviewsRepository.find({
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
      console.debug(
        `Rating updated for product ${productId} to ${averageRating}`,
      );
    }
  }
}

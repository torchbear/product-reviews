import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';
import { GetReviewDto } from './dto/get-review.dto';
import { ClientProxy } from '@nestjs/microservices';

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
    @Inject('PROCESS_REVIEW_SERVICE')
    private client: ClientProxy,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = new Review();
    review.firstName = createReviewDto.firstName;
    review.lastName = createReviewDto.lastName;
    review.text = createReviewDto.text;
    review.rating = createReviewDto.rating;
    const product = new Product();
    product.id = createReviewDto.productId;
    review.product = product;
    let create: InsertResult;
    try {
      create = await this.reviewsRepository.insert(review);
    } catch (error) {
      if (error.errno === 1452) {
        throw new ProductNotFoundError('Product does not exist');
      } else {
        throw error;
      }
    }
    this.client.emit('ratingUpdate', [product.id]);
    review.id = create.identifiers[0].id;
    await this.cacheService.del('reviews');
    return this._toDto(review);
  }

  async findAll() {
    const cachedReviews =
      await this.cacheService.get<GetReviewDto[]>('reviews');
    if (cachedReviews) {
      return plainToInstance(GetReviewDto, cachedReviews);
    }
    const reviews = await this.reviewsRepository.find({
      relations: ['product'],
    });
    const reviews_dto = reviews.map((result) => {
      return this._toDto(result);
    });
    await this.cacheService.set('reviews', instanceToPlain(reviews_dto));
    return reviews_dto;
  }

  async findOne(id: number) {
    const cachedReview = await this.cacheService.get<GetReviewDto>(
      `review_${id}`,
    );
    if (cachedReview) {
      return plainToInstance(GetReviewDto, cachedReview);
    }
    const review = await this.reviewsRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
    if (review == null) {
      return null;
    }
    const review_dto = this._toDto(review);
    await this.cacheService.set(`review_${id}`, instanceToPlain(review_dto));
    return review_dto;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const existingReview = await this.findOne(id);
    if (existingReview == null) {
      return null;
    }
    const newReview = new Review();
    newReview.id = id;
    if (updateReviewDto.firstName != null) {
      newReview.firstName = updateReviewDto.firstName;
    }
    if (updateReviewDto.lastName != null) {
      newReview.lastName = updateReviewDto.lastName;
    }
    if (updateReviewDto.text != null) {
      newReview.text = updateReviewDto.text;
    }
    if (updateReviewDto.rating != null) {
      newReview.rating = updateReviewDto.rating;
    }
    if (updateReviewDto.productId != null) {
      const product = new Product();
      product.id = updateReviewDto.productId;
      newReview.product = product;
    }
    let updatedProducts = [];
    if (
      updateReviewDto.productId != null &&
      updateReviewDto.productId != existingReview.productId
    ) {
      updatedProducts = [existingReview.productId, updateReviewDto.productId];
    } else {
      updatedProducts = [existingReview.productId];
    }
    const update = await this.reviewsRepository.save(newReview);
    this.client.emit('ratingUpdate', updatedProducts);
    await this._invalidateCache(id);
    return this._toDto(Object.assign(existingReview, update));
  }

  async remove(id: number) {
    const remove = await this.reviewsRepository.delete(id);
    if (remove.affected > 0) {
      this.client.emit('ratingUpdate', [id]);
      await this._invalidateCache(id);
      return true;
    }
    return false;
  }

  _toDto(review: Review) {
    const reviewDto = new GetReviewDto();
    reviewDto.id = review.id;
    reviewDto.firstName = review.firstName;
    reviewDto.lastName = review.lastName;
    reviewDto.text = review.text;
    reviewDto.rating = review.rating;
    reviewDto.productId = review.product.id;
    return reviewDto;
  }

  async _invalidateCache(id: number) {
    await this.cacheService.del('reviews');
    await this.cacheService.del(`review_${id}`);
  }
}

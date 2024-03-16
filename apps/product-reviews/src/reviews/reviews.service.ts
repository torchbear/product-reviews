import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';
import { GetReviewDto } from './dto/get-review.dto';
import { ClientProxy } from '@nestjs/microservices';

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
    const create = await this.reviewsRepository.insert(review);
    await this.cacheService.del('reviews');
    return { id: create.identifiers[0].id };
  }

  async findAll() {
    const cachedReviews = await this.cacheService.get('reviews');
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
    const cachedReview = await this.cacheService.get(`review_${id}`);
    if (cachedReview) {
      return plainToInstance(GetReviewDto, cachedReview);
    }
    const review = await this.reviewsRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
    const review_dto = this._toDto(review);
    await this.cacheService.set(`review_${id}`, instanceToPlain(review_dto));
    return review_dto;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = new Review();
    review.id = id;
    if (updateReviewDto.firstName != null) {
      review.firstName = updateReviewDto.firstName;
    }
    if (updateReviewDto.lastName != null) {
      review.lastName = updateReviewDto.lastName;
    }
    if (updateReviewDto.text != null) {
      review.text = updateReviewDto.text;
    }
    if (updateReviewDto.rating != null) {
      review.rating = updateReviewDto.rating;
    }
    if (updateReviewDto.productId != null) {
      const product = new Product();
      product.id = updateReviewDto.productId;
      review.product = product;
    }
    const oldReview = await this.findOne(id);
    let updatedProducts = [];
    if (
      updateReviewDto.productId != null &&
      updateReviewDto.productId != oldReview.productId
    ) {
      updatedProducts = [oldReview.productId, updateReviewDto.productId];
    } else {
      updatedProducts = [oldReview.productId];
    }
    const update = await this.reviewsRepository.save(review);
    this.client.emit('ratingUpdate', updatedProducts);
    await this._invalidateCache(id);
    return update;
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    const remove = await this.reviewsRepository.delete(id);
    this.client.emit('ratingUpdate', [review.productId]);
    await this._invalidateCache(id);
    return remove;
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

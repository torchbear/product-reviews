import { Inject, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Cache } from 'cache-manager';
import { GetReviewDto } from './dto/get-review.dto';
import { ClientProxy } from '@nestjs/microservices';

/**
 * Product not found error custom class
 */
export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductNotFoundError';
  }
}

/**
 * Reviews service class
 * Handles all the business logic for reviews
 */
@Injectable()
export class ReviewsService {
  /**
   * ReviewsService constructor
   *
   * @param {Repository<Review>} reviewsRepository reviews repository
   * @param {Cache} cacheService cache service
   * @param {ClientProxy} client message broker client
   */
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
    @Inject('PROCESS_REVIEW_SERVICE')
    private client: ClientProxy,
  ) {}

  /**
   * Creates a review and invalidates the cache and emits a message to update the rating
   *
   * @param {CreateReviewDto} createReviewDto review data
   * @throws {ProductNotFoundError} if the product does not exist
   * @returns {Promise<GetReviewDto>} created review
   */
  async create(createReviewDto: CreateReviewDto): Promise<GetReviewDto> {
    const review: Review = new Review();
    review.firstName = createReviewDto.firstName;
    review.lastName = createReviewDto.lastName;
    review.text = createReviewDto.text;
    review.rating = createReviewDto.rating;
    const product: Product = new Product();
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

  /**
   * Finds all reviews and caches the result
   *
   * @returns {Promise<GetReviewDto[]>} reviews
   */
  async findAll(): Promise<GetReviewDto[]> {
    const cachedReviews: GetReviewDto[] =
      await this.cacheService.get<GetReviewDto[]>('reviews');
    if (cachedReviews) {
      return plainToInstance(GetReviewDto, cachedReviews);
    }
    const reviews: Review[] = await this.reviewsRepository.find({
      relations: ['product'],
    });
    const reviews_dto: GetReviewDto[] = reviews.map((result: Review) => {
      return this._toDto(result);
    });
    await this.cacheService.set('reviews', instanceToPlain(reviews_dto));
    return reviews_dto;
  }

  /**
   * Finds a review by id and caches the result
   *
   * @param {number} id review id
   * @returns {Promise<GetReviewDto>} review or null if the review does not exist
   */
  async findOne(id: number): Promise<GetReviewDto> {
    const cachedReview: GetReviewDto =
      await this.cacheService.get<GetReviewDto>(`review_${id}`);
    if (cachedReview) {
      return plainToInstance(GetReviewDto, cachedReview);
    }
    const review: Review = await this.reviewsRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
    if (review == null) {
      return null;
    }
    const review_dto: GetReviewDto = this._toDto(review);
    await this.cacheService.set(`review_${id}`, instanceToPlain(review_dto));
    return review_dto;
  }

  /**
   * Updates a review by id and invalidates the cache and emits a message to update the rating
   *
   * @param {number} id review id
   * @param {UpdateReviewDto} updateReviewDto data to update or null if the review does not exist
   */
  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<GetReviewDto> {
    const existingReview: GetReviewDto = await this.findOne(id);
    if (existingReview == null) {
      return null;
    }
    const newReview: Review = new Review();
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
      const product: Product = new Product();
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
    const update: Review = await this.reviewsRepository.save(newReview);
    this.client.emit('ratingUpdate', updatedProducts);
    await this._invalidateCache(id);
    return this._toDto(Object.assign(existingReview, update));
  }

  /**
   * Removes a review by id and invalidates the cache and emits a message to update the rating
   *
   * @param {number} id review id
   * @returns {Promise<boolean>} true if the review was removed, false otherwise
   */
  async remove(id: number): Promise<boolean> {
    const remove: DeleteResult = await this.reviewsRepository.delete(id);
    if (remove.affected > 0) {
      this.client.emit('ratingUpdate', [id]);
      await this._invalidateCache(id);
      return true;
    }
    return false;
  }

  /**
   * Converts a Review to GetReviewDto
   *
   * @param {Review} review review
   * @returns {GetReviewDto} review dto
   */
  _toDto(review: Review): GetReviewDto {
    const reviewDto: GetReviewDto = new GetReviewDto();
    reviewDto.id = review.id;
    reviewDto.firstName = review.firstName;
    reviewDto.lastName = review.lastName;
    reviewDto.text = review.text;
    reviewDto.rating = review.rating;
    reviewDto.productId = review.product.id;
    return reviewDto;
  }

  /**
   * Invalidates the cache for a review by id and the list of reviews
   * @param {number} id review id
   * @returns {Promise<void>}
   */
  async _invalidateCache(id: number): Promise<void> {
    await this.cacheService.del('reviews');
    await this.cacheService.del(`review_${id}`);
  }
}

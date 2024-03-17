import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ProductNotFoundError, ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewDto } from './dto/get-review.dto';

/**
 * Reviews controller class
 * Handles all the requests related to reviews
 * Provides REST API for reviews
 */
@Controller('reviews')
export class ReviewsController {
  /**
   * ReviewsController constructor
   *
   * @param {ReviewsService} reviewsService reviews service
   */
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Creates a review
   *
   * @param {CreateReviewDto} createReviewDto review data
   * @throws {NotFoundException} if the product does not exist
   * @returns {Promise<GetReviewDto>} created review
   */
  @Post()
  async create(
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ): Promise<GetReviewDto> {
    return this.reviewsService.create(createReviewDto).catch((error) => {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException('Product not found');
      } else {
        throw error;
      }
    });
  }

  /**
   * Finds all reviews
   *
   * @returns {Promise<GetReviewDto[]>} all reviews
   */
  @Get()
  async findAll(): Promise<GetReviewDto[]> {
    return this.reviewsService.findAll();
  }

  /**
   * Finds a review by id
   *
   * @param {number} id review id
   * @throws {NotFoundException} if the review does not exist
   * @returns {Promise<GetReviewDto>} review
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetReviewDto> {
    const findOneResult: GetReviewDto = await this.reviewsService.findOne(id);
    if (findOneResult == null) {
      throw new NotFoundException();
    }
    return findOneResult;
  }

  /**
   * Updates a review
   *
   * @param {number} id review id
   * @param {UpdateReviewDto} updateReviewDto review data
   * @throws {NotFoundException} if the review does not exist
   * @returns {Promise<GetReviewDto>} updated review
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto,
  ): Promise<GetReviewDto> {
    const updateResult: GetReviewDto = await this.reviewsService.update(
      id,
      updateReviewDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  /**
   * Updates a review
   *
   * @param {number} id review id
   * @param {CreateReviewDto} createReviewDto review data
   * @throws {NotFoundException} if the review does not exist
   * @returns {Promise<GetReviewDto>} updated review
   */
  @Put(':id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ): Promise<GetReviewDto> {
    const updateResult: GetReviewDto = await this.reviewsService.update(
      id,
      createReviewDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  /**
   * Deletes a review
   *
   * @param {number} id review id
   * @throws {NotFoundException} if the review does not exist
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removeResult: boolean = await this.reviewsService.remove(id);
    if (!removeResult) {
      throw new NotFoundException();
    }
    return;
  }
}

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
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { GetReviewDto } from './dto/get-review.dto';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createReviewDto: CreateReviewDto) {
    return this.reviewsService
      .create(createReviewDto)
      .then((result) => {
        return { id: result.identifiers[0].id };
      })
      .catch(() => {
        throw new HttpException(
          'Create failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  @Get()
  async findAll() {
    return this.reviewsService
      .findAll()
      .then((result) => {
        return result.map((result) => {
          return this._toDto(result);
        });
      })
      .catch(() => {
        throw new HttpException('Reviews not found', HttpStatus.NOT_FOUND);
      });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService
      .findOne(id)
      .then((result) => {
        return this._toDto(result);
      })
      .catch(() => {
        throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
      });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Put(':id')
  put(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.update(id, createReviewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id).catch(() => {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    });
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
}

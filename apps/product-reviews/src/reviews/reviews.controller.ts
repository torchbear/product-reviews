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

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto).catch((error) => {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException('Product not found');
      } else {
        throw error;
      }
    });
  }

  @Get()
  async findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const findOneResult = await this.reviewsService.findOne(id);
    if (findOneResult == null) {
      throw new NotFoundException();
    }
    return findOneResult;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateReviewDto: UpdateReviewDto,
  ) {
    const updateResult = await this.reviewsService.update(id, updateReviewDto);
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  @Put(':id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
  ) {
    const updateResult = await this.reviewsService.update(id, createReviewDto);
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removeResult = await this.reviewsService.remove(id);
    if (!removeResult) {
      throw new NotFoundException();
    }
    return;
  }
}

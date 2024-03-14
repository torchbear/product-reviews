import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    const review = new Review();
    review.firstName = createReviewDto.firstName;
    review.lastName = createReviewDto.lastName;
    review.text = createReviewDto.text;
    review.rating = createReviewDto.rating;
    const product = new Product();
    product.id = createReviewDto.productId;
    review.product = product;
    return this.reviewsRepository.insert(review);
  }

  findAll() {
    return this.reviewsRepository.find({ relations: ['product'] });
  }

  findOne(id: number) {
    return this.reviewsRepository.findOne({
      where: { id: id },
      relations: ['product'],
    });
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
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
    return this.reviewsRepository.update(id, review);
  }

  async remove(id: number) {
    return this.reviewsRepository.delete(id);
  }
}

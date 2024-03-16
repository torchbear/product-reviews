import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/entities/product.entity';

describe('ReviewsController', () => {
  let reviewsController: ReviewsController;
  let reviewsService: ReviewsService;

  const review = new Review();
  review.id = 1;
  review.firstName = 'John';
  review.lastName = 'Doe';
  review.text = 'Review 1';
  review.rating = 5;
  const product = new Product();
  product.id = 1;
  review.product = product;

  const updatedReview = Object.assign({}, review);
  updatedReview.rating = 1;

  const createReviewDto = new CreateReviewDto();
  createReviewDto.firstName = review.firstName;
  createReviewDto.lastName = review.lastName;
  createReviewDto.text = review.text;
  createReviewDto.rating = review.rating;
  createReviewDto.productId = product.id;

  const updateReviewDto = new UpdateReviewDto();
  updateReviewDto.rating = updatedReview.rating;

  const mockReviewsService = {
    findAll: jest.fn().mockResolvedValueOnce(review),
    findOne: jest.fn().mockResolvedValueOnce(review),
    create: jest.fn().mockResolvedValueOnce(review),
    update: jest.fn().mockResolvedValueOnce(updatedReview),
    remove: jest.fn().mockResolvedValueOnce(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    reviewsController = module.get<ReviewsController>(ReviewsController);
    reviewsService = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(reviewsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of reviews', async () => {
      expect(await reviewsController.findAll()).toBe(review);
      expect(reviewsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a review', async () => {
      expect(await reviewsController.findOne(review.id)).toBe(review);
      expect(reviewsService.findOne).toHaveBeenCalledWith(review.id);
    });

    it('should throw an exception for invalid review', async () => {
      mockReviewsService['findOne'] = jest.fn().mockResolvedValueOnce(null);
      await expect(reviewsController.findOne(review.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(reviewsService.findOne).toHaveBeenCalledWith(review.id);
    });
  });

  describe('create', () => {
    it('should create a review', async () => {
      expect(await reviewsController.create(createReviewDto)).toEqual(review);
      expect(reviewsService.create).toHaveBeenCalledWith(createReviewDto);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      expect(
        await reviewsController.update(review.id, updateReviewDto),
      ).toEqual(updatedReview);
      expect(reviewsService.update).toHaveBeenCalledWith(
        review.id,
        updateReviewDto,
      );
    });

    it('should throw an exception for invalid review', async () => {
      mockReviewsService['update'] = jest.fn().mockResolvedValueOnce(null);
      await expect(
        reviewsController.update(review.id, updateReviewDto),
      ).rejects.toThrow(NotFoundException);
      expect(reviewsService.update).toHaveBeenCalledWith(
        review.id,
        updateReviewDto,
      );
    });
  });

  describe('put', () => {
    it('should update a review', async () => {
      mockReviewsService['update'] = jest.fn().mockResolvedValueOnce(review);
      expect(await reviewsController.put(review.id, createReviewDto)).toEqual(
        review,
      );
      expect(reviewsService.update).toHaveBeenCalledWith(
        review.id,
        createReviewDto,
      );
    });

    it('should throw an exception for invalid review', async () => {
      mockReviewsService['update'] = jest.fn().mockResolvedValueOnce(null);
      await expect(
        reviewsController.put(review.id, createReviewDto),
      ).rejects.toThrow(NotFoundException);
      expect(reviewsService.update).toHaveBeenCalledWith(
        review.id,
        createReviewDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const removeResult = await reviewsController.remove(review.id);
      expect(reviewsService.remove).toHaveBeenCalledWith(review.id);
      expect(removeResult).toBe(undefined);
    });

    it('should throw an exception for invalid review', async () => {
      mockReviewsService['remove'] = jest.fn().mockResolvedValueOnce(false);
      await expect(reviewsController.remove(review.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(reviewsService.remove).toHaveBeenCalledWith(review.id);
    });
  });
});

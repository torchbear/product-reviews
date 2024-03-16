import { Test, TestingModule } from '@nestjs/testing';
import { ProductNotFoundError, ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Product } from '../products/entities/product.entity';
import { GetReviewDto } from './dto/get-review.dto';

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;
  let reviewRepository: Repository<Review>;
  let cacheService: Cache;

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

  const getReviewDto = new GetReviewDto();
  getReviewDto.id = review.id;
  getReviewDto.firstName = review.firstName;
  getReviewDto.lastName = review.lastName;
  getReviewDto.text = review.text;
  getReviewDto.rating = review.rating;
  getReviewDto.productId = product.id;

  const getReviewDtoAfterUpdate = new GetReviewDto();
  getReviewDtoAfterUpdate.id = review.id;
  getReviewDtoAfterUpdate.firstName = review.firstName;
  getReviewDtoAfterUpdate.lastName = review.lastName;
  getReviewDtoAfterUpdate.text = review.text;
  getReviewDtoAfterUpdate.rating = updatedReview.rating;
  getReviewDtoAfterUpdate.productId = product.id;

  const createReviewDto = new CreateReviewDto();
  createReviewDto.firstName = review.firstName;
  createReviewDto.lastName = review.lastName;
  createReviewDto.text = review.text;
  createReviewDto.rating = review.rating;
  createReviewDto.productId = product.id;

  const updateReviewDto = new UpdateReviewDto();
  updateReviewDto.rating = updatedReview.rating;

  const insertResult = new InsertResult();
  insertResult.identifiers = [{ id: product.id }];

  const mockReviewRepository = {
    insert: jest.fn().mockResolvedValueOnce(insertResult),
    find: jest.fn().mockResolvedValueOnce([review]),
    findOne: jest.fn().mockResolvedValueOnce(review),
    save: jest.fn().mockResolvedValueOnce(updatedReview),
    delete: jest.fn().mockResolvedValueOnce({ affected: 1 }),
  };

  const mockCacheService = {
    get: jest.fn().mockResolvedValueOnce(null),
    set: jest.fn().mockResolvedValueOnce(null),
    del: jest.fn(),
  };

  const mockClientProxy = {
    emit: jest.fn().mockResolvedValueOnce(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
        {
          provide: 'PROCESS_REVIEW_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<Repository<Review>>(
      getRepositoryToken(Review),
    );
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      expect(await reviewsService.create(createReviewDto)).toEqual(
        getReviewDto,
      );
      expect(reviewRepository.insert).toHaveBeenCalledWith(review);
      expect(cacheService.del).toHaveBeenCalledWith('reviews');
    });

    it('should throw an exception for invalid product', async () => {
      mockReviewRepository['insert'] = jest.fn().mockRejectedValueOnce({
        errno: 1452,
      });
      await expect(reviewsService.create(createReviewDto)).rejects.toThrow(
        ProductNotFoundError,
      );
      // do a clone because of issues with side effects based on https://github.com/jestjs/jest/issues/434 :/
      const reviewCopy: Review = { ...review };
      reviewCopy.id = undefined;
      expect(reviewRepository.insert).toHaveBeenCalledWith(reviewCopy);
      expect(cacheService.del).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of reviews from DB', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(null);
      expect(await reviewsService.findAll()).toEqual([getReviewDto]);
      expect(await reviewRepository.find).toHaveBeenCalledWith({
        relations: ['product'],
      });
    });

    it('should return an array of products from cache', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce([getReviewDto]);
      expect(await reviewsService.findAll()).toEqual([getReviewDto]);
      expect(reviewRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product from DB', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(null);
      expect(await reviewsService.findOne(product.id)).toEqual(getReviewDto);
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
        relations: ['product'],
      });
    });

    it('should return a product from cache', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(getReviewDto);
      expect(await reviewsService.findOne(product.id)).toEqual(getReviewDto);
      expect(reviewRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null for invalid product', async () => {
      mockReviewRepository['findOne'] = jest.fn().mockResolvedValueOnce(null);
      expect(await reviewsService.findOne(2)).toBeNull();
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: ['product'],
      });
    });
  });

  describe('update', () => {
    it('should update a review and invalidate cache', async () => {
      jest.spyOn(reviewsService, 'findOne').mockResolvedValueOnce(getReviewDto);
      expect(await reviewsService.update(review.id, updateReviewDto)).toEqual(
        getReviewDtoAfterUpdate,
      );
      const updatedReviewWithId = new Review();
      updatedReviewWithId.id = review.id;
      updatedReviewWithId.rating = updatedReview.rating;
      expect(reviewRepository.save).toHaveBeenCalledWith(updatedReviewWithId);
      expect(cacheService.del).toHaveBeenCalledWith('reviews');
      expect(cacheService.del).toHaveBeenCalledWith(`review_${product.id}`);
    });

    it('should return null for invalid product', async () => {
      mockReviewRepository['findOne'] = jest.fn().mockResolvedValueOnce(null);
      expect(await reviewsService.update(2, createReviewDto)).toBeNull();
      expect(reviewRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: ['product'],
      });
    });
  });

  describe('delete', () => {
    it('should delete a product and invalidate cache', async () => {
      expect(await reviewsService.remove(product.id)).toBe(true);
      expect(reviewRepository.delete).toHaveBeenCalledWith(product.id);
      expect(cacheService.del).toHaveBeenCalledWith('reviews');
      expect(cacheService.del).toHaveBeenCalledWith(`review_${product.id}`);
    });

    it('should return false for invalid product', async () => {
      mockReviewRepository['delete'] = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });
      expect(await reviewsService.remove(2)).toBe(false);
      expect(reviewRepository.delete).toHaveBeenCalledWith(2);
      expect(cacheService.del).not.toHaveBeenCalled();
    });
  });
});

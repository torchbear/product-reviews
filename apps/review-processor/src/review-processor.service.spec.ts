import { Test, TestingModule } from '@nestjs/testing';
import { ReviewProcessorService } from './review-processor.service';
import { Repository } from 'typeorm';
import { Review } from '../../product-reviews/src/reviews/entities/review.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRating } from './entities/product-rating.entity';

describe('ReviewProcessorService', () => {
  let reviewProcessorService: ReviewProcessorService;
  let reviewRepository: Repository<Review>;
  let productRatingRepository: Repository<ProductRating>;
  let cacheService: Cache;

  const mockReviewRepository = {
    find: jest.fn(),
  };

  const mockProductRatingRepository = {
    upsert: jest.fn(),
  };
  const mockCacheService = {
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewProcessorService,
        {
          provide: getRepositoryToken(Review),
          useValue: mockReviewRepository,
        },
        {
          provide: getRepositoryToken(ProductRating),
          useValue: mockProductRatingRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    reviewProcessorService = module.get<ReviewProcessorService>(
      ReviewProcessorService,
    );
    reviewRepository = module.get<Repository<Review>>(
      getRepositoryToken(Review),
    );
    productRatingRepository = module.get<Repository<ProductRating>>(
      getRepositoryToken(ProductRating),
    );
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reviewProcessorService).toBeDefined();
  });

  describe('ratingUpdate', () => {
    it('should update the rating for a product', async () => {
      const productId = 1;
      const reviews = [{ rating: 3 }, { rating: 4 }, { rating: 5 }];
      mockReviewRepository['find'].mockResolvedValueOnce(reviews);
      await reviewProcessorService.ratingUpdate([productId]);
      expect(reviewRepository.find).toHaveBeenCalledWith({
        where: { product: { id: productId } },
      });
      expect(productRatingRepository.upsert).toHaveBeenCalledWith(
        [{ product: { id: productId }, rating: 4 }],
        ['product'],
      );
      expect(cacheService.del).toHaveBeenCalledWith(`product_${productId}`);
      expect(cacheService.del).toHaveBeenCalledWith('products');
    });
  });
});

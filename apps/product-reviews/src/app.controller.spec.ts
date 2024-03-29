import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsService } from './reviews/reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from './products/products.service';
import { Product } from './products/entities/product.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: ReviewsService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Review),
          useClass: Repository,
        },
        {
          provide: ProductsService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});

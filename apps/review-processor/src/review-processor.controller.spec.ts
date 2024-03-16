import { Test, TestingModule } from '@nestjs/testing';
import { ReviewProcessorController } from './review-processor.controller';
import { ReviewProcessorService } from './review-processor.service';

describe('ReviewProcessorController', () => {
  let reviewProcessorController: ReviewProcessorController;
  let reviewProcessorService: ReviewProcessorService;

  const mockReviewProcessorService = {
    ratingUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReviewProcessorController],
      providers: [
        {
          provide: ReviewProcessorService,
          useValue: mockReviewProcessorService,
        },
      ],
    }).compile();

    reviewProcessorController = app.get<ReviewProcessorController>(
      ReviewProcessorController,
    );
    reviewProcessorService = app.get<ReviewProcessorService>(
      ReviewProcessorService,
    );
  });

  it('should be defined', () => {
    expect(reviewProcessorController).toBeDefined();
  });

  describe('ratingUpdate', () => {
    it('should call ratingUpdate on reviewProcessorService', async () => {
      const productIds = [1, 2, 3];
      expect(
        await reviewProcessorController.ratingUpdate(productIds, null),
      ).toBe(undefined);
      expect(reviewProcessorService.ratingUpdate).toHaveBeenCalledWith(
        productIds,
      );
    });
  });
});

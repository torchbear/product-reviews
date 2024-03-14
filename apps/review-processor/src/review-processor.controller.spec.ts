import { Test, TestingModule } from '@nestjs/testing';
import { ReviewProcessorController } from './review-processor.controller';
import { ReviewProcessorService } from './review-processor.service';

describe('ReviewProcessorController', () => {
  let reviewProcessorController: ReviewProcessorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReviewProcessorController],
      providers: [ReviewProcessorService],
    }).compile();

    reviewProcessorController = app.get<ReviewProcessorController>(
      ReviewProcessorController,
    );
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(reviewProcessorController).toBeDefined();
    });
  });
});

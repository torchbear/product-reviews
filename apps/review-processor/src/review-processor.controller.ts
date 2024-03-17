import { Controller } from '@nestjs/common';
import { ReviewProcessorService } from './review-processor.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * ReviewProcessorController class
 * Handles message broker events
 */
@Controller()
export class ReviewProcessorController {
  /**
   * ReviewProcessorController constructor
   *
   * @param {ReviewProcessorService} reviewProcessorService review processor service
   */
  constructor(
    private readonly reviewProcessorService: ReviewProcessorService,
  ) {}

  /**
   * Rating update message handler
   *
   * @param {number[]} productIds product ids
   * @returns {Promise<void>}
   */
  @MessagePattern('ratingUpdate')
  async ratingUpdate(@Payload() productIds: number[]): Promise<void> {
    await this.reviewProcessorService.ratingUpdate(productIds);
  }
}

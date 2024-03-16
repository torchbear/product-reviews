import { Controller } from '@nestjs/common';
import { ReviewProcessorService } from './review-processor.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ReviewProcessorController {
  constructor(
    private readonly reviewProcessorService: ReviewProcessorService,
  ) {}

  @MessagePattern('ratingUpdate')
  async ratingUpdate(@Payload() productIds: number[]) {
    await this.reviewProcessorService.ratingUpdate(productIds);
  }
}

import { Controller } from '@nestjs/common';
import { ReviewProcessorService } from './review-processor.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class ReviewProcessorController {
  constructor(
    private readonly reviewProcessorService: ReviewProcessorService,
  ) {}

  @MessagePattern('ratingUpdate')
  async ratingUpdate(
    @Payload() productIds: number[],
    @Ctx() context: RmqContext,
  ) {
    await this.reviewProcessorService.ratingUpdate(productIds);
  }
}

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
  async getNotifications(
    @Payload() data: number[],
    @Ctx() context: RmqContext,
  ) {
    console.log('Received:', data);
  }
}

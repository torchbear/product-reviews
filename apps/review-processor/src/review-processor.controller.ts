import { Controller, Get } from '@nestjs/common';
import { ReviewProcessorService } from './review-processor.service';

@Controller()
export class ReviewProcessorController {
  constructor(private readonly reviewProcessorService: ReviewProcessorService) {}

  @Get()
  getHello(): string {
    return this.reviewProcessorService.getHello();
  }
}

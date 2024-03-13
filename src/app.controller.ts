import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ReviewsService } from './reviews/reviews.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private reviewsService: ReviewsService,
  ) {}

  @Get('/')
  async showReviews() {
    return this.reviewsService.findAll();
  }
}

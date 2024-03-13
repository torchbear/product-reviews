import { Controller, Get, Render } from "@nestjs/common";
import { AppService } from './app.service';
import { ReviewsService } from './reviews/reviews.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private reviewsService: ReviewsService,
  ) {}

  @Get('/')
  @Render('index')
  async showReviews() {
    return { reviews: await this.reviewsService.findAll() };
  }
}

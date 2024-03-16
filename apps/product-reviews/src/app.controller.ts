import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ReviewsService } from './reviews/reviews.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private reviewsService: ReviewsService,
    private productsService: ProductsService,
  ) {}

  @Get('/')
  @Render('index')
  async showReviews() {
    const products = await this.productsService.findAll();
    const reviews = await this.reviewsService.findAll();
    const productsObj = JSON.parse(JSON.stringify(products));
    productsObj.map((product) => {
      product.reviews = reviews.filter(
        (review) => review.productId === product.id,
      );
    });
    return {
      products: productsObj,
    };
  }
}

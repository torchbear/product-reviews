import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ReviewsService } from './reviews/reviews.service';
import { ProductsService } from './products/products.service';
import { GetProductDto } from './products/dto/get-product.dto';
import { GetReviewDto } from './reviews/dto/get-review.dto';

/**
 * App controller class
 * Handles all the requests related to HTML rendering
 */
@Controller()
export class AppController {
  /**
   * AppController constructor
   *
   * @param {AppService} appService app service
   * @param {ReviewsService} reviewsService reviews service
   * @param {ProductsService} productsService products service
   */
  constructor(
    private readonly appService: AppService,
    private reviewsService: ReviewsService,
    private productsService: ProductsService,
  ) {}

  /**
   * Renders the index page with all the products and reviews
   *
   * @returns {Promise<{ products: any }>} products with reviews for the index page
   */
  @Get('/')
  @Render('index')
  async showReviews(): Promise<{ products: any }> {
    const products: GetProductDto[] = await this.productsService.findAll();
    const reviews: GetReviewDto[] = await this.reviewsService.findAll();
    const productsObj = JSON.parse(JSON.stringify(products));
    productsObj.map((product) => {
      product.reviews = reviews.filter(
        (review: GetReviewDto) => review.productId === product.id,
      );
    });
    return {
      products: productsObj,
    };
  }
}

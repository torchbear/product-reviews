import { Module } from '@nestjs/common';
import { ReviewProcessorController } from './review-processor.controller';
import { ReviewProcessorService } from './review-processor.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductRating } from "./entities/product-rating.entity";
import { Review } from "./entities/review.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.development.docker'],
    }),
    TypeOrmModule.forFeature([ProductRating, Review]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: `${process.env.DATABASE_HOST}`,
      port: parseInt(`${process.env.DATABASE_PORT}`),
      username: `${process.env.DATABASE_USER}`,
      password: `${process.env.DATABASE_PASSWORD}`,
      database: 'product_reviews',
      entities: [Product, ProductRating, Review],
      synchronize: true,
    }),
  ],
  controllers: [ReviewProcessorController],
  providers: [ReviewProcessorService],
})
export class ReviewProcessorModule {}

import { IsString, IsInt } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  text: string;

  @IsInt()
  rating: number;

  @IsInt()
  productId: number;
}

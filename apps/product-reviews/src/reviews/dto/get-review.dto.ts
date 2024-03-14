import { IsString, IsInt } from 'class-validator';

export class GetReviewDto {
  @IsInt()
  id: number;

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

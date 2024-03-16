import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  productId: number;
}

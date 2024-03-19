import { IsString, IsInt, Min, Max, MinLength } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  text: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  @Min(1)
  productId: number;
}

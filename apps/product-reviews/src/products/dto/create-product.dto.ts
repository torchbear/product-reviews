import { IsString, IsInt, Min, MinLength } from "class-validator";

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsInt()
  @Min(0)
  price: number;
}

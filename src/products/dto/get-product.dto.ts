import { IsString, IsInt } from 'class-validator';

export class GetProductDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  price: number;
}

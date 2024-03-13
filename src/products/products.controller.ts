import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productsService
      .create(createProductDto)
      .then((result) => {
        return { id: result.identifiers[0].id };
      })
      .catch(() => {
        throw new HttpException(
          'Create failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }

  @Get()
  async findAll() {
    return this.productsService
      .findAll()
      .then((result) => {
        return result.map((product) => {
          return this._toDto(product);
        });
      })
      .catch(() => {
        throw new HttpException('Products not found', HttpStatus.NO_CONTENT);
      });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService
      .findOne(id)
      .then((result) => {
        return this._toDto(result);
      })
      .catch(() => {
        throw new HttpException('Product not found', HttpStatus.NO_CONTENT);
      });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Put(':id')
  put(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.update(id, createProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id).catch(() => {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    });
  }

  _toDto(product: Product) {
    const productDto = new GetProductDto();
    productDto.id = product.id;
    productDto.name = product.name;
    productDto.description = product.description;
    productDto.price = product.price;
    return productDto;
  }
}

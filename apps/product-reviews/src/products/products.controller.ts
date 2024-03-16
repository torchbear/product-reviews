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
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const findOneResult = await this.productsService.findOne(id);
    if (findOneResult == null) {
      throw new NotFoundException();
    }
    return findOneResult;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ) {
    const updateResult = await this.productsService.update(
      id,
      updateProductDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  @Put(':id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ) {
    const updateResult = await this.productsService.update(
      id,
      createProductDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removeResult = await this.productsService.remove(id);
    if (!removeResult) {
      throw new NotFoundException();
    }
    return;
  }
}

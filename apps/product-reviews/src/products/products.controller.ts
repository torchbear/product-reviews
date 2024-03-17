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
import { GetProductDto } from './dto/get-product.dto';

/**
 * Products controller class
 * Handles all the requests related to products
 * Provides REST API for products
 */
@Controller('products')
export class ProductsController {
  /**
   * ProductsController constructor
   *
   * @param {ProductsService} productsService products service
   */
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Creates a product
   *
   * @param {CreateProductDto} createProductDto product data
   * @returns {Promise<GetProductDto>} created product
   */
  @Post()
  async create(
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ): Promise<GetProductDto> {
    return this.productsService.create(createProductDto);
  }

  /**
   * Finds all products
   *
   * @returns {Promise<GetProductDto[]>} all products
   */
  @Get()
  async findAll(): Promise<GetProductDto[]> {
    return this.productsService.findAll();
  }

  /**
   * Finds a product by id
   *
   * @param {number} id product id
   * @throws {NotFoundException} if the product does not exist
   * @returns {Promise<GetProductDto>} product
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetProductDto> {
    const findOneResult: GetProductDto = await this.productsService.findOne(id);
    if (findOneResult == null) {
      throw new NotFoundException();
    }
    return findOneResult;
  }

  /**
   * Updates a product
   *
   * @param {number} id product id
   * @param {UpdateProductDto} updateProductDto data to update
   * @throws {NotFoundException} if the product does not exist
   * @returns {Promise<GetProductDto>} updated product
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const updateResult: GetProductDto = await this.productsService.update(
      id,
      updateProductDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  /**
   * Updates a product
   *
   * @param {number} id product id
   * @param {CreateProductDto} createProductDto data to update
   * @throws {NotFoundException} if the product does not exist
   * @returns {Promise<GetProductDto>} updated product
   */
  @Put(':id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) createProductDto: CreateProductDto,
  ): Promise<GetProductDto> {
    const updateResult: GetProductDto = await this.productsService.update(
      id,
      createProductDto,
    );
    if (updateResult == null) {
      throw new NotFoundException();
    }
    return updateResult;
  }

  /**
   * Deletes a product
   *
   * @param {number} id product id
   * @throws {NotFoundException} if the product does not exist
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removeResult: boolean = await this.productsService.remove(id);
    if (!removeResult) {
      throw new NotFoundException();
    }
    return;
  }
}

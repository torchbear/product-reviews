import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GetProductDto } from './dto/get-product.dto';

/**
 * Products service class
 * Handles all the business logic for products
 */
@Injectable()
export class ProductsService {
  /**
   * ProductService constructor
   *
   * @param {Repository<Product>} productsRepository products repository
   * @param {Cache} cacheService cache service
   */
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}

  /**
   * Creates a product and invalidates the cache
   *
   * @param {CreateProductDto} createProductDto product data
   * @returns {Promise<GetProductDto>} created product
   */
  async create(createProductDto: CreateProductDto): Promise<GetProductDto> {
    const product: Product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    const create: InsertResult = await this.productsRepository.insert(product);
    await this.cacheService.del('products');
    product.id = create.identifiers[0].id;
    return this._toDto(product);
  }

  /**
   * Finds all products and caches the result
   *
   * @returns {Promise<GetProductDto[]>} products
   */
  async findAll(): Promise<GetProductDto[]> {
    const cachedProducts: GetProductDto[] =
      await this.cacheService.get<GetProductDto[]>('products');
    if (cachedProducts) {
      return plainToInstance(GetProductDto, cachedProducts);
    }
    const products: Product[] = await this.productsRepository.find({
      relations: ['rating'],
    });
    const products_dto: GetProductDto[] = products.map((result: Product) => {
      return this._toDto(result);
    });
    await this.cacheService.set('products', instanceToPlain(products_dto));
    return products_dto;
  }

  /**
   * Finds a product by id and caches the result
   *
   * @param id product id
   * @returns {Promise<GetProductDto>} product or null if the product does not exist
   */
  async findOne(id: number): Promise<GetProductDto> {
    const cachedProduct: GetProductDto =
      await this.cacheService.get<GetProductDto>(`product_${id}`);
    if (cachedProduct) {
      return plainToInstance(GetProductDto, cachedProduct);
    }
    const product: Product = await this.productsRepository.findOne({
      where: { id: id },
      relations: ['rating'],
    });
    if (product == null) {
      return null;
    }
    const product_dto: GetProductDto = this._toDto(product);
    await this.cacheService.set(`product_${id}`, instanceToPlain(product_dto));
    return product_dto;
  }

  /**
   * Updates a product by id and invalidates the cache
   *
   * @param {number} id product id
   * @param {UpdateProductDto} updateProductDto data to update
   * @returns {Promise<GetProductDto>} updated product or null if the product does not exist
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const existingProduct: GetProductDto = await this.findOne(id);
    if (existingProduct == null) {
      return null;
    }
    const newProduct: Product = new Product();
    newProduct.id = id;
    if (updateProductDto.name != null) {
      newProduct.name = updateProductDto.name;
    }
    if (updateProductDto.description != null) {
      newProduct.description = updateProductDto.description;
    }
    if (updateProductDto.price != null) {
      newProduct.price = updateProductDto.price;
    }
    const update: Product = await this.productsRepository.save(newProduct);
    await this._invalidateCache(id);
    return this._toDto(Object.assign(existingProduct, update));
  }

  /**
   * Removes a product by id and invalidates the cache
   *
   * @param {number} id product id
   * @returns {Promise<boolean>} true if the product was removed, false otherwise
   */
  async remove(id: number): Promise<boolean> {
    const remove: DeleteResult = await this.productsRepository.delete(id);
    if (remove.affected > 0) {
      await this._invalidateCache(id);
      return true;
    }
    return false;
  }

  /**
   * Converts Product to GetProductDto
   *
   * @param {Product} product product
   * @returns {GetProductDto} product dto
   */
  _toDto(product: Product): GetProductDto {
    const productDto: GetProductDto = new GetProductDto();
    productDto.id = product.id;
    productDto.name = product.name;
    productDto.description = product.description;
    productDto.price = product.price;
    productDto.rating = product.rating?.rating;
    return productDto;
  }

  /**
   * Invalidates the cache for a product by id and the list of products
   *
   * @param {number} id product id
   * @returns {Promise<void>}
   */
  async _invalidateCache(id: number): Promise<void> {
    await this.cacheService.del('products');
    await this.cacheService.del(`product_${id}`);
  }
}

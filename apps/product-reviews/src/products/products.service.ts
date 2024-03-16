import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private cacheService: Cache,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    const create = await this.productsRepository.insert(product);
    await this.cacheService.del('products');
    product.id = create.identifiers[0].id;
    return this._toDto(product);
  }

  async findAll() {
    const cachedProducts =
      await this.cacheService.get<GetProductDto[]>('products');
    if (cachedProducts) {
      return plainToInstance(GetProductDto, cachedProducts);
    }
    const products = await this.productsRepository.find({
      relations: ['rating'],
    });
    const products_dto = products.map((result) => {
      return this._toDto(result);
    });
    await this.cacheService.set('products', instanceToPlain(products_dto));
    return products_dto;
  }

  async findOne(id: number) {
    const cachedProduct = await this.cacheService.get<GetProductDto>(
      `product_${id}`,
    );
    if (cachedProduct) {
      return plainToInstance(GetProductDto, cachedProduct);
    }
    const product = await this.productsRepository.findOne({
      where: { id: id },
      relations: ['rating'],
    });
    if (product == null) {
      return null;
    }
    const product_dto = this._toDto(product);
    await this.cacheService.set(`product_${id}`, instanceToPlain(product_dto));
    return product_dto;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.findOne(id);
    if (existingProduct == null) {
      return null;
    }
    const product = new Product();
    product.id = id;
    if (updateProductDto.name != null) {
      product.name = updateProductDto.name;
    }
    if (updateProductDto.description != null) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.price != null) {
      product.price = updateProductDto.price;
    }
    const update = await this.productsRepository.save(product);
    await this._invalidateCache(id);
    return this._toDto(Object.assign(existingProduct, update));
  }

  async remove(id: number) {
    const remove = await this.productsRepository.delete(id);
    await this._invalidateCache(id);
    return remove.affected > 0;
  }

  _toDto(product: Product) {
    const productDto = new GetProductDto();
    productDto.id = product.id;
    productDto.name = product.name;
    productDto.description = product.description;
    productDto.price = product.price;
    productDto.rating = product.rating?.rating;
    return productDto;
  }

  async _invalidateCache(id: number) {
    await this.cacheService.del('products');
    await this.cacheService.del(`product_${id}`);
  }
}

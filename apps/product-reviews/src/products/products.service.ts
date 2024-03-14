import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = new Product();
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.price = createProductDto.price;
    return this.productsRepository.insert(product);
  }

  findAll() {
    return this.productsRepository.find();
  }

  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
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
    return this.productsRepository.update(id, product);
  }

  async remove(id: number) {
    return this.productsRepository.delete(id);
  }
}

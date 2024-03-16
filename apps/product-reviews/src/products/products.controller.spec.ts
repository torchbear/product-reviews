import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const product = new Product();
  product.id = 1;
  product.name = 'Product 1';
  product.description = 'Description of product 1';
  product.price = 100;

  const updatedProduct = Object.assign({}, product);
  updatedProduct.price = product.price + 100;

  const createProductDto = new CreateProductDto();
  createProductDto.name = product.name;
  createProductDto.description = product.description;
  createProductDto.price = product.price;

  const updateProductDto = new UpdateProductDto();
  updateProductDto.price = product.price + 100;

  const mockProductsService = {
    findAll: jest.fn().mockResolvedValueOnce(product),
    findOne: jest.fn().mockResolvedValueOnce(product),
    create: jest.fn().mockResolvedValueOnce(product),
    update: jest.fn().mockResolvedValueOnce(updatedProduct),
    remove: jest.fn().mockResolvedValueOnce(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      expect(await productsController.findAll()).toBe(product);
      expect(productsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      expect(await productsController.findOne(product.id)).toBe(product);
      expect(productsService.findOne).toHaveBeenCalledWith(product.id);
    });

    it('should throw an exception for invalid product', async () => {
      mockProductsService['findOne'] = jest.fn().mockResolvedValueOnce(null);
      await expect(productsController.findOne(product.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsService.findOne).toHaveBeenCalledWith(product.id);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      expect(await productsController.create(createProductDto)).toEqual(
        product,
      );
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      expect(
        await productsController.update(product.id, updateProductDto),
      ).toEqual(updatedProduct);
      expect(productsService.update).toHaveBeenCalledWith(
        product.id,
        updateProductDto,
      );
    });

    it('should throw an exception for invalid product', async () => {
      mockProductsService['update'] = jest.fn().mockResolvedValueOnce(null);
      await expect(
        productsController.update(product.id, updateProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(productsService.update).toHaveBeenCalledWith(
        product.id,
        updateProductDto,
      );
    });
  });

  describe('put', () => {
    it('should update a product', async () => {
      mockProductsService['update'] = jest.fn().mockResolvedValueOnce(product);
      expect(
        await productsController.put(product.id, createProductDto),
      ).toEqual(product);
      expect(productsService.update).toHaveBeenCalledWith(
        product.id,
        createProductDto,
      );
    });

    it('should throw an exception for invalid product', async () => {
      mockProductsService['update'] = jest.fn().mockResolvedValueOnce(null);
      await expect(
        productsController.put(product.id, createProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(productsService.update).toHaveBeenCalledWith(
        product.id,
        createProductDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const removeResult = await productsController.remove(product.id);
      expect(productsService.remove).toHaveBeenCalledWith(product.id);
      expect(removeResult).toBe(undefined);
    });

    it('should throw an exception for invalid product', async () => {
      mockProductsService['remove'] = jest.fn().mockResolvedValueOnce(false);
      await expect(productsController.remove(product.id)).rejects.toThrow(
        NotFoundException,
      );
      expect(productsService.remove).toHaveBeenCalledWith(product.id);
    });
  });
});

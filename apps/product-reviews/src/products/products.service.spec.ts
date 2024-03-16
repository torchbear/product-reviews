import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { InsertResult, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: Repository<Product>;
  let cacheService: Cache;

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

  const getProductDto = new GetProductDto();
  getProductDto.id = product.id;
  getProductDto.name = product.name;
  getProductDto.description = product.description;
  getProductDto.price = product.price;

  const getProductDtoAfterUpdate = new GetProductDto();
  getProductDtoAfterUpdate.id = product.id;
  getProductDtoAfterUpdate.name = product.name;
  getProductDtoAfterUpdate.description = product.description;
  getProductDtoAfterUpdate.price = updatedProduct.price;

  const updateProductDto = new UpdateProductDto();
  updateProductDto.price = product.price + 100;

  const insertResult = new InsertResult();
  insertResult.identifiers = [{ id: product.id }];

  const mockProductRepository = {
    insert: jest.fn().mockResolvedValueOnce(insertResult),
    find: jest.fn().mockResolvedValueOnce([product]),
    findOne: jest.fn().mockResolvedValueOnce(product),
    save: jest.fn().mockResolvedValueOnce(updatedProduct),
    delete: jest.fn().mockResolvedValueOnce({ affected: 1 }),
  };

  const mockCacheService = {
    get: jest.fn().mockResolvedValueOnce(null),
    set: jest.fn().mockResolvedValueOnce(null),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    cacheService = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      expect(await productService.create(createProductDto)).toEqual(
        getProductDto,
      );
      expect(productRepository.insert).toHaveBeenCalledWith(product);
      expect(cacheService.del).toHaveBeenCalledWith('products');
    });
  });

  describe('findAll', () => {
    it('should return an array of products from DB', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(null);
      expect(await productService.findAll()).toEqual([getProductDto]);
      expect(await productRepository.find).toHaveBeenCalledWith({
        relations: ['rating'],
      });
    });

    it('should return an array of products from cache', async () => {
      mockCacheService['get'] = jest
        .fn()
        .mockResolvedValueOnce([getProductDto]);
      expect(await productService.findAll()).toEqual([getProductDto]);
      expect(productRepository.find).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product from DB', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(null);
      expect(await productService.findOne(product.id)).toEqual(getProductDto);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: product.id },
        relations: ['rating'],
      });
    });

    it('should return a product from cache', async () => {
      mockCacheService['get'] = jest.fn().mockResolvedValueOnce(getProductDto);
      expect(await productService.findOne(product.id)).toEqual(getProductDto);
      expect(productRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return null for invalid product', async () => {
      mockProductRepository['findOne'] = jest.fn().mockResolvedValueOnce(null);
      expect(await productService.findOne(2)).toBeNull();
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: ['rating'],
      });
    });
  });

  describe('update', () => {
    it('should update a product and invalidate cache', async () => {
      jest
        .spyOn(productService, 'findOne')
        .mockResolvedValueOnce(getProductDto);
      expect(await productService.update(product.id, updateProductDto)).toEqual(
        getProductDtoAfterUpdate,
      );
      const updatedProductWithId = new Product();
      updatedProductWithId.id = product.id;
      updatedProductWithId.price = updatedProduct.price;
      expect(productRepository.save).toHaveBeenCalledWith(updatedProductWithId);
      expect(cacheService.del).toHaveBeenCalledWith('products');
      expect(cacheService.del).toHaveBeenCalledWith(`product_${product.id}`);
    });

    it('should return null for invalid product', async () => {
      mockProductRepository['findOne'] = jest.fn().mockResolvedValueOnce(null);
      expect(await productService.update(2, createProductDto)).toBeNull();
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
        relations: ['rating'],
      });
    });
  });

  describe('delete', () => {
    it('should delete a product and invalidate cache', async () => {
      expect(await productService.remove(product.id)).toBe(true);
      expect(productRepository.delete).toHaveBeenCalledWith(product.id);
      expect(cacheService.del).toHaveBeenCalledWith('products');
      expect(cacheService.del).toHaveBeenCalledWith(`product_${product.id}`);
    });

    it('should return false for invalid product', async () => {
      mockProductRepository['delete'] = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });
      expect(await productService.remove(2)).toBe(false);
      expect(productRepository.delete).toHaveBeenCalledWith(2);
      expect(cacheService.del).not.toHaveBeenCalled();
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) { }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Product category not found');
    const product = await this.productsRepository.create({ ...rest, category });
    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = updateProductDto;
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({ where: { id: categoryId } });
      if (!category) throw new NotFoundException('Product category not found');
      (await product).category = category;
    }
    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async removeProduct(id: number) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.productsRepository.remove(product);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['products'] });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id }, relations: ['products'] });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.productsRepository.createQueryBuilder('product')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<Product[]> {
    let queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (categoryId) {
      queryBuilder = queryBuilder.andWhere('product.category.id = :categoryId', { categoryId });
    }

    if (minPrice) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating) {
      queryBuilder = queryBuilder.andWhere('product.rating >= :minRating', { minRating });
    }

    return queryBuilder.getMany();
  }
}

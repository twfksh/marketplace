import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.productsService.removeProduct(+id);
  }
}
@Controller('prod-categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findCategoryById(@Param('id') id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeCategory(@Param('id') id: number) {
    return this.productsService.removeCategory(id);
  }
}

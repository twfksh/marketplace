import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RoleGuard } from 'src/auth/role.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, new RoleGuard('customer'))
  createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      this.cloudinaryService.uploadImage(file).then((result) => {
        createProductDto.img = result.secure_url;
      }).catch((error) => {
        console.error(error);
        createProductDto.img = null;
      });
    }
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(+id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      this.cloudinaryService.uploadImage(file).then((result) => {
        updateProductDto.img = result.secure_url;
      }
      ).catch((error) => {
        console.error(error);
        updateProductDto.img = null;
      });
    }
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new RoleGuard('admin'))
  remove(@Param('id') id: string) {
    return this.productsService.removeProduct(+id);
  }

  @Get('search')
  searchProducts(@Query('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('filter')
  filterProducts(
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
  ) {
    return this.productsService.filterProducts(categoryId, minPrice, maxPrice, minRating);
  }
}
@Controller('prod-categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get()
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get(':id')
  findCategoryById(@Param('id') id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Patch(':id')
  updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  removeCategory(@Param('id') id: number) {
    return this.productsService.removeCategory(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard, LocalAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post('login')
  async login(@Body() body: { username: string, password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Post('register')
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      this.cloudinaryService.uploadImage(file).then((result) => {
        createUserDto.img = result.secure_url;
      }).catch((error) => {
        console.error(error);
        createUserDto.img = null;
      });
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, new RoleGuard('admin'))
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, new RoleGuard('admin'))
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      this.cloudinaryService.uploadImage(file).then((result) => {
        updateUserDto.img = result.secure_url;
      }).catch((error) => {
        console.error(error);
        updateUserDto.img = null;
      });
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, new RoleGuard('admin'))
  async remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

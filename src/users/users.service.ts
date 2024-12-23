import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashBcrypt } from 'src/common/common.helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { username, img, email, password, role } = createUserDto;
    const hashedPassword = await hashBcrypt(password);
    const user = this.userRepository.create({ username, img, email, password: hashedPassword, role });
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await hashBcrypt(password);
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) { }

  create(dto: CreateUserDto) {
    return this.usersRepo.save(dto);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    const saved = await this.usersRepo.save(user);
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { message: 'User deleted successfully' };
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityType, CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async create(dto: CreateActivityDto) {
    const user = await this.userRepo.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    const activity = this.activityRepo.create({
      type: dto.type as ActivityType,
      date: dto.date,
      data: dto.data,
      user,
    });

    return this.activityRepo.save(activity);
  }

  findAll(filters: {
    userId?: number;
    type?: string;
  }) {
    return this.activityRepo.find({
      where: {
        type: filters.type as ActivityType | undefined,
        user: filters.userId ? { id: filters.userId } : undefined,
      },
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const activity = await this.activityRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: number, dto: UpdateActivityDto) {
    const activity = await this.findOne(id);

    if (dto.userId && dto.userId !== activity.user.id) {
      const user = await this.userRepo.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException('User not found');
      activity.user = user;
    }

    if (dto.type) activity.type = dto.type as ActivityType;
    if (dto.date) activity.date = dto.date;
    if (dto.data !== undefined) activity.data = dto.data;

    return this.activityRepo.save(activity);
  }

  async remove(id: number) {
    const activity = await this.findOne(id);
    await this.activityRepo.remove(activity);
    return { message: 'Activity deleted successfully' };
  }
}


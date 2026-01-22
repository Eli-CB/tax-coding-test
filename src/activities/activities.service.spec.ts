import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { Activity } from './activity.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { ActivityType } from './dto/create-activity.dto';

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let activityRepo: Repository<Activity>;
  let userRepo: Repository<User>;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockActivity = {
    id: 1,
    type: ActivityType.LOGIN,
    date: new Date('2026-01-21'),
    data: 'Test data',
    user: mockUser,
  };

  const mockActivityRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockActivityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
    activityRepo = module.get<Repository<Activity>>(getRepositoryToken(Activity));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const dto = {
        userId: 1,
        type: 'login',
        date: new Date('2026-01-21'),
        data: 'Test data',
      };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockActivityRepository.create.mockReturnValue(mockActivity);
      mockActivityRepository.save.mockResolvedValue(mockActivity);

      const result = await service.create(dto);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(activityRepo.create).toHaveBeenCalledWith({
        type: dto.type,
        date: dto.date,
        data: dto.data,
        user: mockUser,
      });
      expect(activityRepo.save).toHaveBeenCalledWith(mockActivity);
      expect(result).toEqual(mockActivity);
    });

    it('should throw NotFoundException if user not found', async () => {
      const dto = {
        userId: 999,
        type: 'login',
        date: new Date(),
        data: 'Test',
      };
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow('User not found');
    });
  });

  describe('findAll', () => {
    it('should return all activities', async () => {
      const activities = [mockActivity];
      mockActivityRepository.find.mockResolvedValue(activities);

      const result = await service.findAll({});

      expect(activityRepo.find).toHaveBeenCalledWith({
        where: {
          type: undefined,
          user: undefined,
        },
        relations: ['user'],
      });
      expect(result).toEqual(activities);
    });

    it('should filter activities by userId', async () => {
      const activities = [mockActivity];
      mockActivityRepository.find.mockResolvedValue(activities);

      const result = await service.findAll({ userId: 1 });

      expect(activityRepo.find).toHaveBeenCalledWith({
        where: {
          type: undefined,
          user: { id: 1 },
        },
        relations: ['user'],
      });
      expect(result).toEqual(activities);
    });

    it('should filter activities by type', async () => {
      const activities = [mockActivity];
      mockActivityRepository.find.mockResolvedValue(activities);

      const result = await service.findAll({ type: 'login' });

      expect(activityRepo.find).toHaveBeenCalledWith({
        where: {
          type: 'login',
          user: undefined,
        },
        relations: ['user'],
      });
      expect(result).toEqual(activities);
    });
  });

  describe('findOne', () => {
    it('should return an activity by id', async () => {
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);

      const result = await service.findOne(1);

      expect(activityRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result).toEqual(mockActivity);
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Activity not found');
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const dto = { data: 'Updated data' };
      const updatedActivity = { ...mockActivity, ...dto };
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockActivityRepository.save.mockResolvedValue(updatedActivity);

      const result = await service.update(1, dto);

      expect(activityRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(activityRepo.save).toHaveBeenCalled();
      expect(result).toEqual(updatedActivity);
    });

    it('should update activity user if userId is provided', async () => {
      const newUser = { id: 2, name: 'Jane', email: 'jane@example.com' };
      const dto = { userId: 2 };
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockUserRepository.findOneBy.mockResolvedValue(newUser);
      mockActivityRepository.save.mockResolvedValue({ ...mockActivity, user: newUser });

      await service.update(1, dto);

      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(activityRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if new user not found', async () => {
      const dto = { userId: 999 };
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
      await expect(service.update(1, dto)).rejects.toThrow('User not found');
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { data: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete an activity', async () => {
      mockActivityRepository.findOne.mockResolvedValue(mockActivity);
      mockActivityRepository.remove.mockResolvedValue(mockActivity);

      const result = await service.remove(1);

      expect(activityRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(activityRepo.remove).toHaveBeenCalledWith(mockActivity);
      expect(result).toEqual({ message: 'Activity deleted successfully' });
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockActivityRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

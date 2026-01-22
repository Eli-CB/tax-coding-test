import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, ...dto };
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, dto);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.save).toHaveBeenCalledWith({ ...mockUser, ...dto });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repo.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});

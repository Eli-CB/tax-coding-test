import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com' };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { name: 'Jane Doe' };
      const updatedUser = { ...mockUser, ...dto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const response = { message: 'User deleted successfully' };
      mockUsersService.remove.mockResolvedValue(response);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    });
  });
});

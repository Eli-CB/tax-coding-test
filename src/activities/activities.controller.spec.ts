import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityType } from './dto/create-activity.dto';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let service: ActivitiesService;

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

  const mockActivitiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    service = module.get<ActivitiesService>(ActivitiesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const dto = {
        userId: 1,
        type: 'login',
        date: new Date('2026-01-21'),
        data: 'Test data',
      };
      mockActivitiesService.create.mockResolvedValue(mockActivity);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('find', () => {
    it('should return all activities without filters', async () => {
      const activities = [mockActivity];
      mockActivitiesService.findAll.mockResolvedValue(activities);

      const result = await controller.find({});

      expect(service.findAll).toHaveBeenCalledWith({
        userId: undefined,
        type: undefined,
      });
      expect(result).toEqual(activities);
    });

    it('should filter activities by userId', async () => {
      const activities = [mockActivity];
      mockActivitiesService.findAll.mockResolvedValue(activities);

      const result = await controller.find({ userId: '1' });

      expect(service.findAll).toHaveBeenCalledWith({
        userId: 1,
        type: undefined,
      });
      expect(result).toEqual(activities);
    });

    it('should filter activities by type', async () => {
      const activities = [mockActivity];
      mockActivitiesService.findAll.mockResolvedValue(activities);

      const result = await controller.find({ type: 'login' });

      expect(service.findAll).toHaveBeenCalledWith({
        userId: undefined,
        type: 'login',
      });
      expect(result).toEqual(activities);
    });

    it('should filter activities by both userId and type', async () => {
      const activities = [mockActivity];
      mockActivitiesService.findAll.mockResolvedValue(activities);

      const result = await controller.find({ userId: '1', type: 'login' });

      expect(service.findAll).toHaveBeenCalledWith({
        userId: 1,
        type: 'login',
      });
      expect(result).toEqual(activities);
    });
  });

  describe('findOne', () => {
    it('should return an activity by id', async () => {
      mockActivitiesService.findOne.mockResolvedValue(mockActivity);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('update', () => {
    it('should update an activity', async () => {
      const dto = { data: 'Updated data' };
      const updatedActivity = { ...mockActivity, ...dto };
      mockActivitiesService.update.mockResolvedValue(updatedActivity);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(updatedActivity);
    });
  });

  describe('remove', () => {
    it('should delete an activity', async () => {
      const response = { message: 'Activity deleted successfully' };
      mockActivitiesService.remove.mockResolvedValue(response);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    });
  });
});

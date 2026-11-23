import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from '../orders/schemas/order.schema';
import { User } from '../users/schemas/user.schema';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken(Order.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

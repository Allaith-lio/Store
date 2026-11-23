import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { RolesGuard } from '../auth/current-user.decorator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },
       { name: User.name, schema: UserSchema },
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard]
})
export class AdminModule {}

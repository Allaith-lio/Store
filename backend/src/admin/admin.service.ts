import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order , OrderDocument, OrderStatus} from '../orders/schemas/order.schema';
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Order.name)
        private readonly  orderModel:Model<OrderDocument>,
        @InjectModel(User.name)
  private readonly userModel: Model<UserDocument>,
    ) {}
    async getAllOrders(){
        return await this.orderModel.find().sort({ createdAt: -1 }).exec();
    }
    async updateOrderStatus(orderId: string, status: OrderStatus) {
        if (!Types.ObjectId.isValid(orderId)) {
            throw new BadRequestException('Invalid order ID');
        }
        const order = await this.orderModel.findByIdAndUpdate(orderId,
             { status }, { new: true, runValidators: true });
             if(!order){
                throw new NotFoundException(`Order with ID ${orderId} not found`);
             }
             return order;
    }
  async getDashboardSummary() {
  const totalSalesResult = await this.orderModel.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$totals.total' },
      },
    },
  ]);

  const totalSales = totalSalesResult[0]?.total ?? 0;

  const newOrders = await this.orderModel.countDocuments();

  const totalUsers = await this.userModel.countDocuments();

  return {
    totalSales: {
      value: totalSales,
      change: 0,
    },
    netProfit: {
      value: 0,
      change: 0,
    },
    newOrders: {
      value: newOrders,
      change: 0,
    },
    totalUsers: {
      value: totalUsers,
      change: 0,
    },
  };
}
  async getSalesChart(range: 'week' | 'month' = 'week') {
  if (range !== 'week' && range !== 'month') {
    throw new BadRequestException('Range must be "week" or "month"');
  }
  const dayCount = range === 'month' ? 30 : 7;

  const today = new Date();

  const days = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(today);

    date.setDate(today.getDate() - (dayCount - index - 1));

    return date;
  });

  return Promise.all(
    days.map(async (date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await this.orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totals.total' },
          },
        },
      ]);

      return {
        label:
          range === 'month'
            ? String(date.getDate())
            : date.toLocaleDateString('en-US', {
                weekday: 'short',
              }),
        value: result[0]?.total ?? 0,
      };
    }),
  );
}
}

import { OrderStatus } from "../../orders/schemas/order.schema";
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto { 
   @IsEnum(OrderStatus)
   status:OrderStatus;
}
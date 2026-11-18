import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

@Schema({ _id: false })
class DeliveryDetails {
  @Prop({ required: true, trim: true })
  recipientName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  street: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ trim: true })
  region?: string;

  @Prop({ trim: true })
  postalCode?: string;

  @Prop({ required: true, trim: true })
  country: string;
}

const DeliveryDetailsSchema = SchemaFactory.createForClass(DeliveryDetails);

@Schema({ _id: false })
class OrderItem {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Types.ObjectId;

  @Prop({ required: true, trim: true })
  productName: string;

  @Prop({ required: true, min: 0 })
  priceAtPurchase: number;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
class OrderTotals {
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @Prop({ required: true, min: 0, default: 0 })
  deliveryFee: number;

  @Prop({ required: true, min: 0 })
  total: number;
}

const OrderTotalsSchema = SchemaFactory.createForClass(OrderTotals);

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  customer: Types.ObjectId;

  @Prop({ type: DeliveryDetailsSchema, required: true })
  deliveryDetails: DeliveryDetails;

  @Prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Prop({ type: OrderTotalsSchema, required: true })
  totals: OrderTotals;

  @Prop({ type: [OrderItemSchema], required: true, default: [] })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);

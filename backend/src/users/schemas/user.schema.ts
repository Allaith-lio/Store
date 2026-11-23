import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

@Schema({ _id: false })
class UserProfile {
  @Prop({ trim: true })
  firstName?: string;

  @Prop({ trim: true })
  lastName?: string;

  @Prop({ trim: true })
  phone?: string;
}

const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

@Schema({ timestamps: false })
export class SavedAddress {
  _id?: Types.ObjectId;

  @Prop({ trim: true })
  label?: string;

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

  @Prop({ default: false })
  isDefault: boolean;
}

const SavedAddressSchema = SchemaFactory.createForClass(SavedAddress);

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: 0, select: false })
  tokenVersion: number;

  @Prop({ required: true, enum: UserRole, default: UserRole.Customer })
  role: UserRole;

  @Prop({ type: UserProfileSchema, default: {} })
  profile: UserProfile;

  @Prop({ type: [SavedAddressSchema], default: [] })
  savedAddresses: SavedAddress[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  wishlist: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

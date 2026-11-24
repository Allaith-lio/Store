import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async getWishlist(userId: string) {
    this.assertId(userId, 'user');

    const user = await this.userModel
      .findById(userId)
      .populate('wishlist')
      .lean();
    if (!user) throw new NotFoundException('User not found');

    return user.wishlist;
  }

  async addItem(userId: string, productId: string) {
    this.assertId(userId, 'user');
    this.assertId(productId, 'product');

    const productExists = await this.productModel.exists({
      _id: new Types.ObjectId(productId),
    });
    if (!productExists) throw new NotFoundException('Product not found');

    // $addToSet: adding the same product twice does nothing
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: new Types.ObjectId(productId) } },
        { returnDocument: 'after' },
      )
      .populate('wishlist')
      .lean();
    if (!user) throw new NotFoundException('User not found');

    return user.wishlist;
  }

  async removeItem(userId: string, productId: string) {
    this.assertId(userId, 'user');
    this.assertId(productId, 'product');

    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { wishlist: new Types.ObjectId(productId) } },
        { returnDocument: 'after' },
      )
      .populate('wishlist')
      .lean();
    if (!user) throw new NotFoundException('User not found');

    return user.wishlist;
  }

  private assertId(id: string, label: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ${label} id`);
    }
  }
}
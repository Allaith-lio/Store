import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // ---------- دوال مساعدة ----------

  private async getProductOrFail(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private assertStock(product: ProductDocument, quantity: number): void {
    if (quantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} left in stock`);
    }
  }

  private async findOrCreateCart(userId: string): Promise<CartDocument> {
    const existing = await this.cartModel.findOne({ user: userId });
    if (existing) {
      return existing;
    }
    return this.cartModel.create({ user: userId, items: [] });
  }

  // بنحوّل الـ cart (IDs بس) لرد مفهوم للفرونت: تفاصيل المنتج + مجموع كل سطر + المجموع الكلي
  private async buildResponse(cart: CartDocument | null) {
    if (!cart || cart.items.length === 0) {
      return { items: [], total: 0 };
    }

    const products = await this.productModel.find({
      _id: { $in: cart.items.map((item) => item.product) },
    });
    const productsById = new Map(products.map((p) => [p.id, p]));

    const items = cart.items.flatMap((item) => {
      const product = productsById.get(item.product.toString());
      if (!product) {
        return []; // المنتج انحذف من المتجر -> منتجاهله
      }
      return [
        {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            stock: product.stock,
          },
          quantity: item.quantity,
          lineTotal: Math.round(product.price * item.quantity * 100) / 100,
        },
      ];
    });

    const total =
      Math.round(items.reduce((sum, i) => sum + i.lineTotal, 0) * 100) / 100;

    return { items, total };
  }

  // ---------- العمليات (واحدة لكل endpoint) ----------

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    return this.buildResponse(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const product = await this.getProductOrFail(dto.productId);
    const cart = await this.findOrCreateCart(userId);

    const existing = cart.items.find(
      (item) => item.product.toString() === dto.productId,
    );
    const newQuantity = (existing?.quantity ?? 0) + dto.quantity;
    this.assertStock(product, newQuantity);

    if (existing) {
      existing.quantity = newQuantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(dto.productId),
        quantity: dto.quantity,
      });
    }

    await cart.save();
    return this.buildResponse(cart);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.cartModel.findOne({ user: userId });
    const item = cart?.items.find((i) => i.product.toString() === productId);
    if (!cart || !item) {
      throw new NotFoundException('Item is not in your cart');
    }

    const product = await this.getProductOrFail(productId);
    this.assertStock(product, quantity);

    item.quantity = quantity;
    await cart.save();
    return this.buildResponse(cart);
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      return this.buildResponse(null);
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    return this.buildResponse(cart);
  }

  async clearCart(userId: string) {
    await this.cartModel.updateOne({ user: userId }, { $set: { items: [] } });
    return { items: [], total: 0 };
  }
}

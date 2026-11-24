import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

export interface FindProductsQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) { }

  private ensureValidObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }
  }

  private buildSortOption(sort?: string): Record<string, 1 | -1> {
    switch (sort) {
      case 'price_asc':
        return { price: 1 };
      case 'price_desc':
        return { price: -1 };
      case 'name_asc':
        return { name: 1 };
      case 'name_desc':
        return { name: -1 };
      case 'newest':
      default:
        return { createdAt: -1 }
    }
  }

  async findAll(query: FindProductsQuery) {
    const filter: Record<string, unknown> = {};

    if (query.search && query.search.trim() !== '') {
      const escapedSearch = query.search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (query.category && query.category.trim() !== '') {
      filter.category = query.category.trim();
    }

    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const sortOption = this.buildSortOption(query.sort);

    const [data, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string): Promise<ProductDocument> {
    this.ensureValidObjectId(id);

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    this.ensureValidObjectId(id);

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, {
        returnDocument: 'after',
        runValidators: true,
      })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<{ message: string }> {
    this.ensureValidObjectId(id);

    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return { message: 'Product deleted successfully' };
  }
}
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { AuthenticatedUser } from '../auth/current-user.decorator';
import { SavedAddressDto } from './dto/saved-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findAll() {
    const users = await this.userModel
      .find({}, 'email role profile')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      profile: user.profile,
    }));
  }

  async findById(authUser: AuthenticatedUser) {
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');
    return this.toPublicUser(user);
  }

  async updateProfile(authUser: AuthenticatedUser, dto: UpdateProfileDto) {
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');

    if (dto.email) {
      const email = dto.email.trim().toLowerCase();
      const existing = await this.userModel.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existing) throw new ConflictException('An account with this email already exists');
      user.email = email;
    }

    if (dto.firstName !== undefined) user.profile.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.profile.lastName = dto.lastName;
    if (dto.phone !== undefined) user.profile.phone = dto.phone;
    await user.save();
    return this.toPublicUser(user);
  }

  async getAddresses(authUser: AuthenticatedUser) {
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');
    return user.savedAddresses;
  }

  async addAddress(authUser: AuthenticatedUser, dto: SavedAddressDto) {
    if (
      !dto.recipientName?.trim() ||
      !dto.phone?.trim() ||
      !dto.street?.trim() ||
      !dto.city?.trim() ||
      !dto.country?.trim()
    ) {
      throw new BadRequestException(
        'recipientName, phone, street, city and country are required',
      );
    }
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');

    if (dto.isDefault) {
      user.savedAddresses.forEach((address) => (address.isDefault = false));
    }
    user.savedAddresses.push({
      ...(dto.label !== undefined && { label: dto.label }),
      recipientName: dto.recipientName,
      phone: dto.phone,
      street: dto.street,
      city: dto.city,
      ...(dto.region !== undefined && { region: dto.region }),
      ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
      country: dto.country,
      isDefault: dto.isDefault ?? false,
    });
    await user.save();
    return user.savedAddresses.at(-1);
  }

  async updateAddress(
    authUser: AuthenticatedUser,
    addressId: string,
    dto: SavedAddressDto,
  ) {
    if (!Types.ObjectId.isValid(addressId)) throw new NotFoundException('Address not found');
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');

    const address = user.savedAddresses.find(
      (item) => item._id?.toString() === addressId,
    );
    if (!address) throw new NotFoundException('Address not found');

    if (dto.isDefault) {
      user.savedAddresses.forEach((item) => (item.isDefault = false));
    }
    Object.assign(address, dto);
    await user.save();
    return address;
  }

  async deleteAddress(authUser: AuthenticatedUser, addressId: string) {
    if (!Types.ObjectId.isValid(addressId)) throw new NotFoundException('Address not found');
    const user = await this.userModel.findById(authUser.sub).exec();
    if (!user) throw new NotFoundException('User not found');

    const address = user.savedAddresses.find(
      (item) => item._id?.toString() === addressId,
    );
    if (!address) throw new NotFoundException('Address not found');

    user.savedAddresses = user.savedAddresses.filter(
      (item) => item._id?.toString() !== addressId,
    );
    await user.save();
    return { message: 'Address deleted successfully' };
  }

  private toPublicUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      profile: user.profile,
      savedAddresses: user.savedAddresses,
      wishlist: user.wishlist,
    };
  }
}

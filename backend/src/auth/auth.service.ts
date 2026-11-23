import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

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

  private signToken(user: UserDocument) {
    return this.jwtService.signAsync({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.userModel.exists({ email });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userModel.create({
      email,
      passwordHash,
      profile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    return {
      accessToken: await this.signToken(user),
      user: this.toPublicUser(user),
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userModel
      .findOne({ email })
      .select('+passwordHash')
      .exec();

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      accessToken: await this.signToken(user),
      user: this.toPublicUser(user),
    };
  }
}

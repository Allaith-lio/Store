import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model, Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/schemas/user.schema';
import { AuthenticatedUser } from './current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: AuthenticatedUser): Promise<AuthenticatedUser> {
    if (!Types.ObjectId.isValid(payload.sub)) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel
      .findById(payload.sub)
      .select('+tokenVersion')
      .exec();
    if (!user || (user.tokenVersion ?? 0) !== (payload.tokenVersion ?? 0)) {
      throw new UnauthorizedException();
    }

    return {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion ?? 0,
    };
  }
}

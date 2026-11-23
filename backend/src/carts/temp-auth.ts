import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Types } from 'mongoose';

// ⚠️ مؤقت! بس لنقدر نجرب الـ cart قبل ما يخلص قسم الـ auth.
// لما زميلك يخلص JwtAuthGuard: احذف هالملف كله، واستعمل الـ guard والـ decorator تبعه.
// الاستخدام للتجربة: ابعت header اسمه x-user-id وقيمته ObjectId لأي user.

interface TempAuthRequest extends Request {
  user?: { userId: string };
}

// Guard = حارس بيقرر "بيفوت الطلب ولا لا" قبل ما يوصل للـ controller
@Injectable()
export class TempAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<TempAuthRequest>();
    const userId = req.headers['x-user-id'];

    if (typeof userId !== 'string' || !Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedException('Missing or invalid x-user-id header');
    }

    req.user = { userId };
    return true;
  }
}

// Decorator مخصص: بيطلّع الـ userId من الطلب عشان نكتب @CurrentUser() بالـ controller
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest<TempAuthRequest>();
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return req.user.userId;
  },
);

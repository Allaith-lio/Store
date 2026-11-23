import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@Controller('users/me/wishlist')
@UseGuards(AuthGuard('jwt'))
@UsePipes(new ValidationPipe({ whitelist: true }))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.getWishlist(user.sub);
  }

  @Post('items')
  addItem(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddWishlistItemDto,
  ) {
    return this.wishlistService.addItem(user.sub, dto.productId);
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(user.sub, productId);
  }
}
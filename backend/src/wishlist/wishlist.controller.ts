import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { WishlistService } from './wishlist.service';

@Controller('users/me/wishlist')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // TEMPORARY: the user id comes from a header for local testing only.
  // Replace with the team's JWT guard / current-user decorator once it exists.
  @Get()
  getWishlist(@Headers('x-user-id') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }

  @Post('items')
  addItem(
    @Headers('x-user-id') userId: string,
    @Body() dto: AddWishlistItemDto,
  ) {
    return this.wishlistService.addItem(userId, dto.productId);
  }

  @Delete('items/:productId')
  removeItem(
    @Headers('x-user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeItem(userId, productId);
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/current-user.decorator';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductIdParamDto } from './dto/product-id-param.dto';
import { CartsService } from './carts.services';


@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get() // GET /cart
  getCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartsService.getCart(user.sub);
  }

  @Post('items') // POST /cart/items
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(user.sub, dto);
  }

  @Patch('items/:productId') // PATCH /cart/items/:productId
  updateItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: ProductIdParamDto,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(user.sub, params.productId, dto.quantity);
  }

  @Delete('items/:productId') // DELETE /cart/items/:productId
  removeItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param() params: ProductIdParamDto,
  ) {
    return this.cartsService.removeItem(user.sub, params.productId);
  }

  @Delete() // DELETE /cart  (تفريغ السلة)
  clearCart(@CurrentUser() user: AuthenticatedUser) {
    return this.cartsService.clearCart(user.sub);
  }
}

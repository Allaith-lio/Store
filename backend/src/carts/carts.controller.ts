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

import { CurrentUser, TempAuthGuard } from './temp-auth';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductIdParamDto } from './dto/product-id-param.dto';
import { CartsService } from './carts.services';


@Controller('cart')
@UseGuards(TempAuthGuard) 
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get() // GET /cart
  getCart(@CurrentUser() userId: string) {
    return this.cartsService.getCart(userId);
  }

  @Post('items') // POST /cart/items
  addItem(@CurrentUser() userId: string, @Body() dto: AddCartItemDto) {
    return this.cartsService.addItem(userId, dto);
  }

  @Patch('items/:productId') // PATCH /cart/items/:productId
  updateItem(
    @CurrentUser() userId: string,
    @Param() params: ProductIdParamDto,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItem(userId, params.productId, dto.quantity);
  }

  @Delete('items/:productId') // DELETE /cart/items/:productId
  removeItem(
    @CurrentUser() userId: string,
    @Param() params: ProductIdParamDto,
  ) {
    return this.cartsService.removeItem(userId, params.productId);
  }

  @Delete() // DELETE /cart  (تفريغ السلة)
  clearCart(@CurrentUser() userId: string) {
    return this.cartsService.clearCart(userId);
  }
}

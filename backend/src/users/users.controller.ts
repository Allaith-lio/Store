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
import { SavedAddressDto } from './dto/saved-address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user);
  }

  @Patch('me')
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user, dto);
  }

  @Get('me/addresses')
  getAddresses(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getAddresses(user);
  }

  @Post('me/addresses')
  addAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SavedAddressDto,
  ) {
    return this.usersService.addAddress(user, dto);
  }

  @Patch('me/addresses/:addressId')
  updateAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('addressId') addressId: string,
    @Body() dto: SavedAddressDto,
  ) {
    return this.usersService.updateAddress(user, addressId, dto);
  }

  @Delete('me/addresses/:addressId')
  deleteAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param('addressId') addressId: string,
  ) {
    return this.usersService.deleteAddress(user, addressId);
  }
}

import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/current-user.decorator';
import { AdminService } from './admin.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UserRole } from '../users/schemas/user.schema';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
    @Get('orders')
    async getAllOrders() {
        return await this.adminService.getAllOrders();
    }
    @Patch('orders/:id/status')
    updateOrderStatus(@Param('id') orderId: string, 
    @Body() updateOrderStatusDto: UpdateOrderStatusDto) {
        return this.adminService.updateOrderStatus(orderId, updateOrderStatusDto.status);
    }
    @Get('dashboard/summary')
getDashboardSummary() {
  return this.adminService.getDashboardSummary();
}
@Get('dashboard/sales')
getSalesChart(@Query('range') range: 'week' | 'month' = 'week') {
  return this.adminService.getSalesChart(range);
}
}

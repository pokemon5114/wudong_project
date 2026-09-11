import { Controller, Get, Post, Inject, Query, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AppRestaurantService } from '../../service/restaurant';
import { AppAdminService } from '../../../admin/service/admin';

@Controller('/app/restaurant')
export class AppRestaurantController {
  @Inject()
  restaurantService: AppRestaurantService;

  @Inject()
  adminService: AppAdminService;

  @Inject()
  ctx: Context;

  private requireAdmin() {
    const auth = this.ctx.get('authorization') || '';
    const token = auth.replace(/^Bearer\s+/i, '').trim();
    const payload = token ? this.adminService.verifyToken(token) : null;
    if (!payload?.adminId || payload.type !== 'admin') {
      this.ctx.status = 401;
      return { code: 40101, message: '未登录或token已过期' };
    }
    return null;
  }

  // ===== 餐厅 =====
  @Get('/list')
  async getRestaurantList(@Query() query: any) {
    return this.restaurantService.getRestaurantList({
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isRecommend: query.isRecommend !== undefined ? Number(query.isRecommend) : undefined,
    });
  }

  @Get('/detail')
  async getRestaurantDetail(@Query('id') id: string) {
    return this.restaurantService.getRestaurantDetail(Number(id));
  }

  @Get('/recommend')
  async getRecommendRestaurants(@Query('limit') limit?: string) {
    return this.restaurantService.getRecommendRestaurants(limit ? Number(limit) : 6);
  }

  @Post('')
  async createRestaurant(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.restaurantService.createRestaurant(body);
  }

  // ===== 菜品 =====
  @Get('/dish/list')
  async getDishList(@Query() query: any) {
    return this.restaurantService.getDishList({
      restaurantId: Number(query.restaurantId),
      category: query.category,
    });
  }

  @Get('/dish/detail')
  async getDishDetail(@Query('id') id: string) {
    return this.restaurantService.getDishDetail(Number(id));
  }

  @Post('/dish')
  async createDish(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.restaurantService.createDish(body);
  }

  // ===== 餐桌 =====
  @Get('/table/list')
  async getTableList(@Query('restaurantId') restaurantId: string) {
    return this.restaurantService.getTableList(Number(restaurantId));
  }

  @Post('/table')
  async createTable(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.restaurantService.createTable(body);
  }

  // ===== 评价 =====
  @Get('/review/list')
  async getReviewList(@Query() query: any) {
    return this.restaurantService.getReviewList({
      restaurantId: Number(query.restaurantId),
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    });
  }

  @Post('/review')
  async createReview(@Body() body: any) {
    return this.restaurantService.createReview(body);
  }
}

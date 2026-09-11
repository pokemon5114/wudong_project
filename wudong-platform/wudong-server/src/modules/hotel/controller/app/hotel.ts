import { Controller, Get, Post, Inject, Query, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AppHotelService } from '../../service/hotel';
import { AppAdminService } from '../../../admin/service/admin';

@Controller('/app/hotel')
export class AppHotelController {
  @Inject()
  hotelService: AppHotelService;

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

  // ===== 民宿 =====
  @Get('/list')
  async getHotelList(@Query() query: any) {
    return this.hotelService.getHotelList({
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isRecommend: query.isRecommend !== undefined ? Number(query.isRecommend) : undefined,
      hotelType: query.hotelType,
    });
  }

  @Get('/detail')
  async getHotelDetail(@Query('id') id: string) {
    return this.hotelService.getHotelDetail(Number(id));
  }

  @Get('/recommend')
  async getRecommendHotels(@Query('limit') limit?: string) {
    return this.hotelService.getRecommendHotels(limit ? Number(limit) : 6);
  }

  @Post('')
  async createHotel(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.hotelService.createHotel(body);
  }

  // ===== 房间 =====
  @Get('/room/list')
  async getRoomList(@Query('hotelId') hotelId: string) {
    return this.hotelService.getRoomList({ hotelId: Number(hotelId) });
  }

  @Get('/room/detail')
  async getRoomDetail(@Query('id') id: string) {
    return this.hotelService.getRoomDetail(Number(id));
  }

  @Get('/room/check')
  async checkRoomAvailability(@Query() query: any) {
    return this.hotelService.checkRoomAvailability({
      roomId: Number(query.roomId),
      checkIn: query.checkIn,
      checkOut: query.checkOut,
    });
  }

  @Post('/room')
  async createRoom(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.hotelService.createRoom(body);
  }

  // ===== 评价 =====
  @Get('/review/list')
  async getReviewList(@Query() query: any) {
    return this.hotelService.getReviewList({
      hotelId: Number(query.hotelId),
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    });
  }

  @Post('/review')
  async createReview(@Body() body: any) {
    return this.hotelService.createReview(body);
  }
}

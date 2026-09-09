import { Controller, Get, Post, Inject, Query, Body } from '@midwayjs/core';
import { AppTicketService } from '../../service/ticket';

@Controller('/app/ticket')
export class AppTicketController {
  @Inject()
  ticketService: AppTicketService;

  // ===== 景区 =====
  @Get('/scenic/list')
  async getScenicList(@Query() query: any) {
    return this.ticketService.getScenicList({
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isRecommend: query.isRecommend !== undefined ? Number(query.isRecommend) : undefined,
      scenicType: query.scenicType,
    });
  }

  @Get('/scenic/detail')
  async getScenicDetail(@Query('id') id: string) {
    return this.ticketService.getScenicDetail(Number(id));
  }

  @Post('/scenic')
  async createScenic(@Body() body: any) {
    return this.ticketService.createScenic(body);
  }

  // ===== 路线 =====
  @Get('/route/list')
  async getRouteList(@Query() query: any) {
    return this.ticketService.getRouteList({
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isRecommend: query.isRecommend !== undefined ? Number(query.isRecommend) : undefined,
      scenicId: query.scenicId ? Number(query.scenicId) : undefined,
      routeType: query.routeType,
    });
  }

  @Get('/route/detail')
  async getRouteDetail(@Query('id') id: string) {
    return this.ticketService.getRouteDetail(Number(id));
  }

  @Get('/route/recommend')
  async getRecommendRoutes(@Query('limit') limit?: string) {
    return this.ticketService.getRecommendRoutes(limit ? Number(limit) : 6);
  }

  @Post('/route')
  async createRoute(@Body() body: any) {
    return this.ticketService.createRoute(body);
  }

  // ===== 订单 =====
  @Post('/order')
  async createOrder(@Body() body: any) {
    return this.ticketService.createOrder(body);
  }

  @Get('/order/list')
  async getOrderList(@Query() query: any) {
    return this.ticketService.getOrderList({
      userId: Number(query.userId),
      orderType: query.orderType,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
    });
  }

  @Get('/order/detail')
  async getOrderDetail(@Query('id') id: string, @Query('userId') userId: string) {
    return this.ticketService.getOrderDetail(Number(id), Number(userId));
  }

  @Post('/order/cancel')
  async cancelOrder(@Body() body: any) {
    return this.ticketService.cancelOrder(body.id, body.userId, body.reason);
  }

  @Post('/order/pay')
  async payOrder(@Body() body: any) {
    return this.ticketService.payOrder(body.id, body.userId, body.payMethod);
  }
}

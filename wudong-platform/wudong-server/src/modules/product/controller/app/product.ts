import { Controller, Get, Post, Put, Del, Inject, Query, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AppProductService } from '../../service/product';
import { AppAdminService } from '../../../admin/service/admin';

@Controller('/app/product')
export class AppProductController {
  @Inject()
  productService: AppProductService;

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

  // ===== 分类 =====

  @Get('/category/list')
  async getCategoryList() {
    return this.productService.getCategoryList();
  }

  @Post('/category')
  async createCategory(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.productService.createCategory(body);
  }

  // ===== 商品 =====

  @Get('/list')
  async getProductList(@Query() query: any) {
    return this.productService.getProductList({
      categoryId: query.categoryId ? Number(query.categoryId) : undefined,
      keyword: query.keyword,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      isRecommend: query.isRecommend !== undefined ? Number(query.isRecommend) : undefined,
    });
  }

  @Get('/detail')
  async getProductDetail(@Query('id') id: string) {
    return this.productService.getProductDetail(Number(id));
  }

  @Get('/recommend')
  async getRecommendProducts(@Query('limit') limit?: string) {
    return this.productService.getRecommendProducts(limit ? Number(limit) : 6);
  }

  @Post('')
  async createProduct(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.productService.createProduct(body);
  }

  @Put('/:id')
  async updateProduct(@Body() body: any) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.productService.updateProduct(body.id, body);
  }

  @Del('/:id')
  async deleteProduct(@Body('id') id: number) {
    const denied = this.requireAdmin();
    if (denied) return denied;
    return this.productService.deleteProduct(id);
  }
}

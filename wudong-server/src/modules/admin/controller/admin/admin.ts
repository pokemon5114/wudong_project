import { Controller, Get, Post, Put, Del, Inject, Query, Body, Headers } from '@midwayjs/core';
import { AppAdminService } from '../../service/admin';

@Controller('/admin')
export class AppAdminController {
  @Inject()
  adminService: AppAdminService;

  // ===== 登录 =====
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.adminService.login(body.username, body.password);
  }

  @Get('/info')
  async getAdminInfo(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    const payload = this.adminService.verifyToken(token);
    if (!payload) {
      return { code: 40101, message: '未登录或token已过期' };
    }
    return this.adminService.getAdminInfo(payload.adminId);
  }

  // ===== 管理员管理 =====
  @Post('/admin')
  async createAdmin(@Body() body: any) {
    return this.adminService.createAdmin(body);
  }

  @Get('/admin/list')
  async getAdminList(@Query() query: any) {
    return this.adminService.getAdminList({
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      keyword: query.keyword,
    });
  }

  @Put('/admin/:id')
  async updateAdmin(@Body() body: any) {
    return this.adminService.updateAdmin(body.id, body);
  }

  @Del('/admin/:id')
  async deleteAdmin(@Body('id') id: number) {
    return this.adminService.deleteAdmin(id);
  }

  // ===== 系统配置 =====
  @Get('/config')
  async getConfig(@Query('key') key: string) {
    return this.adminService.getConfig(key);
  }

  @Post('/config')
  async setConfig(@Body() body: { key: string; value: any; name?: string; group?: string }) {
    return this.adminService.setConfig(body.key, body.value, body.name, body.group);
  }

  @Get('/config/list')
  async getConfigList(@Query('group') group?: string) {
    return this.adminService.getConfigList({ group });
  }

  // ===== 操作日志 =====
  @Get('/log/list')
  async getLogList(@Query() query: any) {
    return this.adminService.getLogList({
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 20,
      adminId: query.adminId ? Number(query.adminId) : undefined,
      action: query.action,
      startDate: query.startDate,
      endDate: query.endDate,
    });
  }

  // ===== 数据统计 =====
  @Get('/dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}

import { Body, Inject, Post, Get, Put, Controller } from '@midwayjs/core';
import { AppUserService } from '../../service/user';
import { LoginDTO, RegisterDTO } from '../../dto/user';
import { Context } from '@midwayjs/koa';
import { Validate } from '@midwayjs/validate';

/**
 * APP用户接口
 */
@Controller('/app/user')
export class AppUserController {
  @Inject()
  appUserService: AppUserService;

  @Inject()
  ctx: Context;

  /**
   * 注册
   */
  @Post('/register')
  @Validate()
  async register(@Body() body: RegisterDTO) {
    const result = await this.appUserService.register(body.phone, body.password, body.nickname);
    return { code: 0, data: result };
  }

  /**
   * 登录
   */
  @Post('/login')
  @Validate()
  async login(@Body() body: LoginDTO) {
    const result = await this.appUserService.login(body.phone, body.password);
    return result;
  }

  /**
   * 获取当前用户信息
   */
  @Get('/info')
  async getInfo() {
    const userId = this.getLoginUserId();
    if (!userId) {
      return { code: 10101, message: '未登录' };
    }
    const result = await this.appUserService.getUserInfo(userId);
    return { code: 0, data: result };
  }

  /**
   * 更新个人资料
   */
  @Put('/profile')
  async updateProfile() {
    const userId = this.getLoginUserId();
    if (!userId) {
      return { code: 10101, message: '未登录' };
    }
    const body = this.ctx.request.body as any;
    const result = await this.appUserService.updateProfile(userId, body);
    return { code: 0, data: result };
  }

  /**
   * 获取用户ID（从Token）
   */
  private getLoginUserId(): number | null {
    const authHeader = this.ctx.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return null;
    try {
      const payload = this.appUserService.verifyToken(token);
      return payload?.userId || null;
    } catch {
      return null;
    }
  }
}

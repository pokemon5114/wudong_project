import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { AppUserEntity } from '../entity/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Provide()
export class AppUserService {
  @InjectEntityModel(AppUserEntity)
  userRepo: Repository<AppUserEntity>;

  private jwtSecret = process.env.JWT_SECRET || 'wudong-platform-secret-2026';
  private jwtExpiresIn = '7d';

  async register(phone: string, password: string, nickname?: string) {
    const exist = await this.userRepo.findOne({ where: { phone } as any });
    if (exist) {
      return { code: 10101, message: '手机号已注册' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      phone,
      password: hashedPassword,
      nickname: nickname || `用户${phone.slice(-4)}`,
      role: 'visitor',
      status: 1,
    });
    const result = await this.userRepo.save(user);

    const token = this.generateToken(result.id);

    return {
      code: 0,
      data: {
        token,
        user: {
          id: result.id,
          phone: result.phone,
          nickname: result.nickname,
          avatar: result.avatar,
          role: result.role,
        },
      },
    };
  }

  async login(phone: string, password: string) {
    const user = await this.userRepo.findOne({ where: { phone } as any });
    if (!user) {
      return { code: 10102, message: '手机号或密码错误' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { code: 10102, message: '手机号或密码错误' };
    }

    if (user.status === 0) {
      return { code: 10103, message: '账号已被禁用' };
    }

    const token = this.generateToken(user.id);

    return {
      code: 0,
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role,
        },
      },
    };
  }

  async getUserInfo(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } as any });
    if (!user) {
      return { code: 10104, message: '用户不存在' };
    }

    return {
      code: 0,
      data: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        region: user.region,
        bio: user.bio,
        role: user.role,
      },
    };
  }

  async updateProfile(userId: number, data: any) {
    const allowedFields = ['nickname', 'avatar', 'gender', 'region', 'bio'];
    const updateData: any = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    await this.userRepo.update(userId, updateData);
    return { code: 0, message: '更新成功' };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } as any });
    if (!user) {
      return { code: 10104, message: '用户不存在' };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return { code: 10105, message: '原密码错误' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.update(userId, { password: hashedPassword } as any);
    return { code: 0, message: '密码修改成功' };
  }

  generateToken(userId: number) {
    return jwt.sign(
      { userId, type: 'app' },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn } as any
    );
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, this.jwtSecret) as any;
    } catch {
      return null;
    }
  }
}

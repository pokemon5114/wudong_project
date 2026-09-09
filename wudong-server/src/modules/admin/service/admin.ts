import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppAdminEntity, AppConfigEntity, AppLogEntity } from '../entity/admin';

@Provide()
export class AppAdminService {
  @InjectEntityModel(AppAdminEntity)
  adminRepo: Repository<AppAdminEntity>;

  @InjectEntityModel(AppConfigEntity)
  configRepo: Repository<AppConfigEntity>;

  @InjectEntityModel(AppLogEntity)
  logRepo: Repository<AppLogEntity>;

  private jwtSecret = process.env.JWT_SECRET || 'wudong-platform-admin-secret-2026';
  private jwtExpiresIn = '24h';

  // ===== 管理员登录 =====

  async login(username: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { username } as any });

    if (!admin) {
      return { code: 60101, message: '账号不存在' };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { code: 60102, message: '密码错误' };
    }

    if (admin.status === 0) {
      return { code: 60103, message: '账号已被禁用' };
    }

    const token = this.generateToken(admin.id, admin.role);

    return {
      code: 0,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nickname: admin.nickname,
          avatar: admin.avatar,
          role: admin.role,
        },
      },
    };
  }

  async getAdminInfo(adminId: number) {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } as any });

    if (!admin) {
      return { code: 60104, message: '管理员不存在' };
    }

    return {
      code: 0,
      data: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        avatar: admin.avatar,
        role: admin.role,
        phone: admin.phone,
      },
    };
  }

  generateToken(adminId: number, role: string) {
    return jwt.sign(
      { adminId, role, type: 'admin' },
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

  // ===== 管理员CRUD =====

  async createAdmin(data: { username: string; password: string; nickname?: string; role?: string; phone?: string }) {
    const exist = await this.adminRepo.findOne({ where: { username: data.username } as any });
    if (exist) {
      return { code: 60105, message: '账号已存在' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = this.adminRepo.create({
      username: data.username,
      password: hashedPassword,
      nickname: data.nickname || data.username,
      role: data.role || 'manager',
      phone: data.phone,
    });

    const result = await this.adminRepo.save(admin);
    return { code: 0, data: { id: result.id, username: result.username } };
  }

  async getAdminList(params: { page?: number; pageSize?: number; keyword?: string }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const query = this.adminRepo.createQueryBuilder('admin');

    if (params.keyword) {
      query.where('admin.username LIKE :keyword', { keyword: `%${params.keyword}%` });
    }

    query.orderBy('admin.id', 'ASC');
    query.skip((page - 1) * pageSize);
    query.take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      code: 0,
      data: {
        list: list.map((item: any) => ({
          id: item.id,
          username: item.username,
          nickname: item.nickname,
          avatar: item.avatar,
          role: item.role,
          phone: item.phone,
          status: item.status,
          createTime: item.createTime,
        })),
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  async updateAdmin(id: number, data: Partial<{ nickname: string; avatar: string; role: string; phone: string; status: number; password: string }>) {
    const admin = await this.adminRepo.findOne({ where: { id } as any });
    if (!admin) {
      return { code: 60104, message: '管理员不存在' };
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await this.adminRepo.update(id, updateData);
    return { code: 0, message: '更新成功' };
  }

  async deleteAdmin(id: number) {
    const admin = await this.adminRepo.findOne({ where: { id } as any });
    if (!admin) {
      return { code: 60104, message: '管理员不存在' };
    }

    await this.adminRepo.delete(id);
    return { code: 0, message: '删除成功' };
  }

  // ===== 系统配置 =====

  async getConfig(key: string) {
    const config = await this.configRepo.findOne({ where: { configKey: key } as any });
    if (!config) {
      return { code: 0, data: null };
    }

    let value = config.configValue;
    if (config.configType === 'json' && value) {
      value = JSON.parse(value);
    }

    return { code: 0, data: value };
  }

  async setConfig(key: string, value: any, name?: string, group?: string) {
    const configType = typeof value === 'object' ? 'json' : 'string';
    const configValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const exist = await this.configRepo.findOne({ where: { configKey: key } as any });

    if (exist) {
      await this.configRepo.update(exist.id, { configValue, configType } as any);
    } else {
      const config = this.configRepo.create({
        configKey: key,
        configValue,
        configName: name || key,
        group: group || 'default',
        configType,
      });
      await this.configRepo.save(config);
    }

    return { code: 0, message: '配置更新成功' };
  }

  async getConfigList(params: { group?: string }) {
    const where: any = {};
    if (params.group) {
      where.group = params.group;
    }

    const list = await this.configRepo.find({ where, order: { id: 'ASC' } });

    return {
      code: 0,
      data: list.map((item: any) => ({
        ...item,
        configValue: item.configType === 'json' && item.configValue ? JSON.parse(item.configValue) : item.configValue,
      })),
    };
  }

  // ===== 操作日志 =====

  async createLog(data: { adminId?: number; adminName?: string; action: string; content?: string; ip?: string; params?: any; result?: number }) {
    const log = this.logRepo.create({
      ...data,
      params: data.params ? JSON.stringify(data.params) : null,
    });
    await this.logRepo.save(log);
  }

  async getLogList(params: { page?: number; pageSize?: number; adminId?: number; action?: string; startDate?: string; endDate?: string }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    const query = this.logRepo.createQueryBuilder('log');

    if (params.adminId) {
      query.where('log.adminId = :adminId', { adminId: params.adminId });
    }
    if (params.action) {
      query.andWhere('log.action = :action', { action: params.action });
    }
    if (params.startDate) {
      query.andWhere('log.createTime >= :startDate', { startDate: params.startDate });
    }
    if (params.endDate) {
      query.andWhere('log.createTime <= :endDate', { endDate: params.endDate });
    }

    query.orderBy('log.id', 'DESC');
    query.skip((page - 1) * pageSize);
    query.take(pageSize);

    const [list, total] = await query.getManyAndCount();

    return {
      code: 0,
      data: {
        list: list.map((item: any) => ({
          ...item,
          params: item.params ? JSON.parse(item.params) : null,
        })),
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  // ===== 数据统计 =====

  async getDashboardStats() {
    // 这里可以添加各模块的数据统计
    // 目前返回基础统计信息
    return {
      code: 0,
      data: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalPosts: 0,
      },
    };
  }
}

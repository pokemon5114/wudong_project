import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppScenicEntity, AppRouteEntity, AppOrderEntity } from '../entity/ticket';

@Provide()
export class AppTicketService {
  @InjectEntityModel(AppScenicEntity)
  scenicRepo: Repository<AppScenicEntity>;

  @InjectEntityModel(AppRouteEntity)
  routeRepo: Repository<AppRouteEntity>;

  @InjectEntityModel(AppOrderEntity)
  orderRepo: Repository<AppOrderEntity>;

  // ===== 景区管理 =====

  async getScenicList(params: {
    keyword?: string;
    page?: number;
    pageSize?: number;
    isRecommend?: number;
    scenicType?: string;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const where: any = { status: 1 };
    if (params.keyword) {
      where.name = Like(`%${params.keyword}%`);
    }
    if (params.isRecommend !== undefined) {
      where.isRecommend = params.isRecommend;
    }
    if (params.scenicType) {
      where.scenicType = params.scenicType;
    }

    const [list, total] = await this.scenicRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      code: 0,
      data: {
        list: list.map((item: any) => ({
          ...item,
          images: item.images ? JSON.parse(item.images) : [],
          tags: item.tags ? JSON.parse(item.tags) : [],
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

  async getScenicDetail(id: number) {
    const scenic = await this.scenicRepo.findOne({ where: { id } });

    if (!scenic) {
      return { code: 40401, message: '景区不存在' };
    }

    return {
      code: 0,
      data: {
        ...scenic,
        images: scenic.images ? JSON.parse(scenic.images) : [],
        tags: scenic.tags ? JSON.parse(scenic.tags) : [],
      },
    };
  }

  async createScenic(data: {
    name: string;
    description?: string;
    coverImage?: string;
    images?: string[];
    address?: string;
    longitude?: number;
    latitude?: number;
    phone?: string;
    openTime?: string;
    suggestedDuration?: string;
    scenicType?: string;
    tags?: string[];
    ticketPrice?: number;
    isRecommend?: number;
  }) {
    const scenic = this.scenicRepo.create({
      ...data,
      images: data.images ? JSON.stringify(data.images) : null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    });
    const result = await this.scenicRepo.save(scenic);
    return { code: 0, data: result };
  }

  // ===== 路线管理 =====

  async getRouteList(params: {
    keyword?: string;
    page?: number;
    pageSize?: number;
    isRecommend?: number;
    scenicId?: number;
    routeType?: string;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const where: any = { status: 1 };
    if (params.keyword) {
      where.name = Like(`%${params.keyword}%`);
    }
    if (params.isRecommend !== undefined) {
      where.isRecommend = params.isRecommend;
    }
    if (params.scenicId) {
      where.scenicId = params.scenicId;
    }
    if (params.routeType) {
      where.routeType = params.routeType;
    }

    const [list, total] = await this.routeRepo.findAndCount({
      where,
      relations: ['scenic'],
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      code: 0,
      data: {
        list: list.map((item: any) => ({
          ...item,
          spots: item.spots ? JSON.parse(item.spots) : [],
          itinerary: item.itinerary ? JSON.parse(item.itinerary) : [],
          includes: item.includes ? JSON.parse(item.includes) : [],
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

  async getRouteDetail(id: number) {
    const route = await this.routeRepo.findOne({
      where: { id },
      relations: ['scenic'],
    });

    if (!route) {
      return { code: 40401, message: '路线不存在' };
    }

    return {
      code: 0,
      data: {
        ...route,
        spots: route.spots ? JSON.parse(route.spots) : [],
        itinerary: route.itinerary ? JSON.parse(route.itinerary) : [],
        includes: route.includes ? JSON.parse(route.includes) : [],
      },
    };
  }

  async createRoute(data: {
    name: string;
    description?: string;
    coverImage?: string;
    routeType?: string;
    price: number;
    originalPrice?: number;
    scenicId?: number;
    spots?: string[];
    itinerary?: any[];
    includes?: string[];
    tips?: string;
    meetingPoint?: string;
    meetingTime?: string;
    minPeople?: number;
    maxPeople?: number;
    isRecommend?: number;
  }) {
    const route = this.routeRepo.create({
      ...data,
      spots: data.spots ? JSON.stringify(data.spots) : null,
      itinerary: data.itinerary ? JSON.stringify(data.itinerary) : null,
      includes: data.includes ? JSON.stringify(data.includes) : null,
    });
    const result = await this.routeRepo.save(route);
    return { code: 0, data: result };
  }

  async getRecommendRoutes(limit: number = 6) {
    const list = await this.routeRepo.find({
      where: { status: 1, isRecommend: 1 },
      relations: ['scenic'],
      order: { id: 'DESC' },
      take: limit,
    });

    return {
      code: 0,
      data: list.map((item: any) => ({
        ...item,
        spots: item.spots ? JSON.parse(item.spots) : [],
        itinerary: item.itinerary ? JSON.parse(item.itinerary) : [],
        includes: item.includes ? JSON.parse(item.includes) : [],
      })),
    };
  }

  // ===== 订单管理 =====

  async createOrder(data: {
    userId: number;
    orderType: string;
    relatedId: number;
    relatedName: string;
    quantity?: number;
    unitPrice: number;
    bookDate?: Date;
    endDate?: Date;
    contactName?: string;
    contactPhone?: string;
    remark?: string;
  }) {
    const totalPrice = (data.quantity || 1) * data.unitPrice;

    const order = this.orderRepo.create({
      orderNo: `WD${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      ...data,
      quantity: data.quantity || 1,
      totalPrice,
      orderStatus: 1, // 待支付
    });

    const result = await this.orderRepo.save(order);
    return { code: 0, data: result };
  }

  async getOrderList(params: {
    userId: number;
    orderType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const where: any = { userId: params.userId };
    if (params.orderType) {
      where.orderType = params.orderType;
    }

    const [list, total] = await this.orderRepo.findAndCount({
      where,
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      code: 0,
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  async getOrderDetail(id: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id, userId },
    });

    if (!order) {
      return { code: 40401, message: '订单不存在' };
    }

    return { code: 0, data: order };
  }

  async cancelOrder(id: number, userId: number, reason?: string) {
    const order = await this.orderRepo.findOne({
      where: { id, userId } as any,
    });

    if (!order) {
      return { code: 40401, message: '订单不存在' };
    }

    if (order.orderStatus !== 1) {
      return { code: 40001, message: '只能取消待支付的订单' };
    }

    await this.orderRepo.update(id, {
      orderStatus: 0,
      cancelReason: reason,
    } as any);

    return { code: 0, message: '订单已取消' };
  }

  async payOrder(id: number, userId: number, payMethod: string) {
    const order = await this.orderRepo.findOne({
      where: { id, userId } as any,
    });

    if (!order) {
      return { code: 40401, message: '订单不存在' };
    }

    if (order.orderStatus !== 1) {
      return { code: 40001, message: '订单状态不允许支付' };
    }

    await this.orderRepo.update(id, {
      orderStatus: 2,
      payMethod,
      payTime: new Date(),
    } as any);

    return { code: 0, message: '支付成功' };
  }
}

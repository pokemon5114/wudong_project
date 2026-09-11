import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Like } from 'typeorm';
import { AppProductEntity, AppCategoryEntity } from '../entity/product';
import { RedisCacheService } from '../../cache/service/redis';

@Provide()
export class AppProductService {
  @InjectEntityModel(AppProductEntity)
  productRepo: Repository<AppProductEntity>;

  @InjectEntityModel(AppCategoryEntity)
  categoryRepo: Repository<AppCategoryEntity>;

  @Inject()
  redisCache: RedisCacheService;

  // ===== 分类管理 =====

  async getCategoryList() {
    const cached = await this.redisCache.get<any[]>('product:categories');
    if (cached) return { code: 0, data: cached };

    const list = await this.categoryRepo.find({
      where: { status: 1 },
      order: { sort: 'ASC', id: 'ASC' },
    });
    await this.redisCache.set('product:categories', list, 300);
    return { code: 0, data: list };
  }

  async createCategory(data: {
    name: string;
    icon?: string;
    description?: string;
    sort?: number;
  }) {
    const category = this.categoryRepo.create(data);
    const result = await this.categoryRepo.save(category);
    await this.redisCache.deleteByPrefix('product:');
    return { code: 0, data: result };
  }

  // ===== 商品管理 =====

  async getProductList(params: {
    categoryId?: number;
    keyword?: string;
    page?: number;
    pageSize?: number;
    isRecommend?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const cacheKey = `product:list:${page}:${pageSize}:${params.categoryId || ''}:${params.keyword || ''}:${params.isRecommend ?? ''}`;
    const cached = await this.redisCache.get<any>(cacheKey);
    if (cached) return cached;

    const where: any = { status: 1 };
    if (params.categoryId) {
      where.categoryId = params.categoryId;
    }
    if (params.keyword) {
      where.name = Like(`%${params.keyword}%`);
    }
    if (params.isRecommend !== undefined) {
      where.isRecommend = params.isRecommend;
    }

    const [list, total] = await this.productRepo.findAndCount({
      where,
      relations: ['category', 'merchant'],
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 处理图片字段
    const data = list.map((item: any) => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
    }));

    const result = {
      code: 0,
      data: {
        list: data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
    };
    await this.redisCache.set(cacheKey, result, 60);
    return result;
  }

  async getProductDetail(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'merchant'],
    });

    if (!product) {
      return { code: 40401, message: '商品不存在' };
    }

    // 增加浏览量
    await this.productRepo.update(id, { viewCount: product.viewCount + 1 });

    return {
      code: 0,
      data: {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      },
    };
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    images?: string[];
    coverImage?: string;
    stock?: number;
    unit?: string;
    categoryId?: number;
    merchantId: number;
    heritageLevel?: number;
    heritageDesc?: string;
    detail?: string;
    status?: number;
    isRecommend?: number;
  }) {
    const product = this.productRepo.create({
      ...data,
      images: data.images ? JSON.stringify(data.images) : null,
    });
    const result = await this.productRepo.save(product);
    await this.redisCache.deleteByPrefix('product:');
    return { code: 0, data: result };
  }

  async updateProduct(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      originalPrice: number;
      images: string[];
      coverImage: string;
      stock: number;
      unit: string;
      categoryId: number;
      heritageLevel: number;
      heritageDesc: string;
      detail: string;
      status: number;
      isRecommend: number;
    }>
  ) {
    const product = await this.productRepo.findOne({ where: { id } as any });
    if (!product) {
      return { code: 40401, message: '商品不存在' };
    }

    const updateData: any = { ...data };
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }

    await this.productRepo.update(id, updateData);
    await this.redisCache.deleteByPrefix('product:');
    return { code: 0, message: '更新成功' };
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findOne({ where: { id } as any });
    if (!product) {
      return { code: 40401, message: '商品不存在' };
    }

    await this.productRepo.update(id, { status: 0 });
    await this.redisCache.deleteByPrefix('product:');
    return { code: 0, message: '删除成功' };
  }

  async getRecommendProducts(limit: number = 6) {
    const cacheKey = `product:recommend:${limit}`;
    const cached = await this.redisCache.get<any>(cacheKey);
    if (cached) return cached;

    const list = await this.productRepo.find({
      where: { status: 1, isRecommend: 1 },
      relations: ['category', 'merchant'],
      order: { id: 'DESC' },
      take: limit,
    });

    const result = {
      code: 0,
      data: list.map((item: any) => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : [],
      })),
    };
    await this.redisCache.set(cacheKey, result, 60);
    return result;
  }
}

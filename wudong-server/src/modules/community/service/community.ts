import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import {
  AppPostEntity,
  AppCommentEntity,
  AppLikeEntity,
  AppFavoriteEntity,
} from '../entity/community';

@Provide()
export class AppCommunityService {
  @InjectEntityModel(AppPostEntity)
  postRepo: Repository<AppPostEntity>;

  @InjectEntityModel(AppCommentEntity)
  commentRepo: Repository<AppCommentEntity>;

  @InjectEntityModel(AppLikeEntity)
  likeRepo: Repository<AppLikeEntity>;

  @InjectEntityModel(AppFavoriteEntity)
  favoriteRepo: Repository<AppFavoriteEntity>;

  // ===== 帖子管理 =====

  async getPostList(params: {
    page?: number;
    pageSize?: number;
    userId?: number;
    tag?: string;
    isFeatured?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;

    const where: any = { status: 1 };
    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    const [list, total] = await this.postRepo.findAndCount({
      where,
      relations: ['user'],
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

  async getPostDetail(id: number, userId?: number) {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      return { code: 40401, message: '帖子不存在' };
    }

    // 增加浏览量
    await this.postRepo.update(id, { viewCount: post.viewCount + 1 });

    // 检查是否点赞/收藏
    let isLiked = false;
    let isFavorited = false;

    if (userId) {
      const like = await this.likeRepo.findOne({
        where: { userId, likeType: 'post', relatedId: id, status: 1 } as any,
      });
      isLiked = !!like;

      const favorite = await this.favoriteRepo.findOne({
        where: { userId, favoriteType: 'post', relatedId: id, status: 1 } as any,
      });
      isFavorited = !!favorite;
    }

    return {
      code: 0,
      data: {
        ...post,
        images: post.images ? JSON.parse(post.images) : [],
        tags: post.tags ? JSON.parse(post.tags) : [],
        isLiked,
        isFavorited,
      },
    };
  }

  async createPost(data: {
    userId: number;
    content: string;
    images?: string[];
    video?: string;
    postType?: string;
    tags?: string[];
    location?: string;
  }) {
    const post = this.postRepo.create({
      ...data,
      images: data.images ? JSON.stringify(data.images) : null,
      tags: data.tags ? JSON.stringify(data.tags) : null,
    });
    const result = await this.postRepo.save(post);
    return { code: 0, data: result };
  }

  async deletePost(id: number, userId: number) {
    const post = await this.postRepo.findOne({ where: { id, userId } as any });
    if (!post) {
      return { code: 40401, message: '帖子不存在或无权限' };
    }

    await this.postRepo.update(id, { status: 0 });
    return { code: 0, message: '删除成功' };
  }

  async getFeaturedPosts(limit: number = 10) {
    const list = await this.postRepo.find({
      where: { status: 1, isFeatured: 1 },
      relations: ['user'],
      order: { id: 'DESC' },
      take: limit,
    });

    return {
      code: 0,
      data: list.map((item: any) => ({
        ...item,
        images: item.images ? JSON.parse(item.images) : [],
        tags: item.tags ? JSON.parse(item.tags) : [],
      })),
    };
  }

  // ===== 评论管理 =====

  async getCommentList(params: {
    postId: number;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    const [list, total] = await this.commentRepo.findAndCount({
      where: { postId: params.postId, status: 1 },
      relations: ['user', 'replyUser'],
      order: { id: 'ASC' },
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

  async createComment(data: {
    postId: number;
    userId: number;
    content: string;
    replyUserId?: number;
  }) {
    const comment = this.commentRepo.create(data);
    const result = await this.commentRepo.save(comment);

    // 更新帖子评论数
    const count = await this.commentRepo.count({
      where: { postId: data.postId, status: 1 },
    });
    await this.postRepo.update(data.postId, { commentCount: count });

    return { code: 0, data: result };
  }

  async deleteComment(id: number, userId: number) {
    const comment = await this.commentRepo.findOne({
      where: { id, userId } as any,
    });
    if (!comment) {
      return { code: 40401, message: '评论不存在或无权限' };
    }

    await this.commentRepo.update(id, { status: 0 });

    // 更新帖子评论数
    const count = await this.commentRepo.count({
      where: { postId: comment.postId, status: 1 },
    });
    await this.postRepo.update(comment.postId, { commentCount: count });

    return { code: 0, message: '删除成功' };
  }

  // ===== 点赞管理 =====

  async toggleLike(params: { userId: number; likeType: string; relatedId: number }) {
    const existing = await this.likeRepo.findOne({
      where: {
        userId: params.userId,
        likeType: params.likeType,
        relatedId: params.relatedId,
      } as any,
    });

    let liked = false;

    if (existing) {
      if (existing.status === 1) {
        await this.likeRepo.update(existing.id, { status: 0 });
        liked = false;
      } else {
        await this.likeRepo.update(existing.id, { status: 1 });
        liked = true;
      }
    } else {
      const like = this.likeRepo.create({
        userId: params.userId,
        likeType: params.likeType,
        relatedId: params.relatedId,
        status: 1,
      });
      await this.likeRepo.save(like);
      liked = true;
    }

    // 更新关联数量
    if (params.likeType === 'post') {
      const count = await this.likeRepo.count({
        where: { likeType: 'post', relatedId: params.relatedId, status: 1 } as any,
      });
      await this.postRepo.update(params.relatedId, { likeCount: count });
    } else if (params.likeType === 'comment') {
      const count = await this.likeRepo.count({
        where: { likeType: 'comment', relatedId: params.relatedId, status: 1 } as any,
      });
      await this.commentRepo.update(params.relatedId, { likeCount: count });
    }

    return { code: 0, data: { liked } };
  }

  // ===== 收藏管理 =====

  async toggleFavorite(params: {
    userId: number;
    favoriteType: string;
    relatedId: number;
  }) {
    const existing = await this.favoriteRepo.findOne({
      where: {
        userId: params.userId,
        favoriteType: params.favoriteType,
        relatedId: params.relatedId,
      } as any,
    });

    let favorited = false;

    if (existing) {
      if (existing.status === 1) {
        await this.favoriteRepo.update(existing.id, { status: 0 });
        favorited = false;
      } else {
        await this.favoriteRepo.update(existing.id, { status: 1 });
        favorited = true;
      }
    } else {
      const favorite = this.favoriteRepo.create({
        userId: params.userId,
        favoriteType: params.favoriteType,
        relatedId: params.relatedId,
        status: 1,
      });
      await this.favoriteRepo.save(favorite);
      favorited = true;
    }

    return { code: 0, data: { favorited } };
  }

  async getFavoriteList(params: {
    userId: number;
    favoriteType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;

    const where: any = { userId: params.userId, status: 1 };
    if (params.favoriteType) {
      where.favoriteType = params.favoriteType;
    }

    const [list, total] = await this.favoriteRepo.findAndCount({
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
}

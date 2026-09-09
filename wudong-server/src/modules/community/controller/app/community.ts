import { Controller, Get, Post, Del, Inject, Query, Body } from '@midwayjs/core';
import { AppCommunityService } from '../../service/community';

@Controller('/app/community')
export class AppCommunityController {
  @Inject()
  communityService: AppCommunityService;

  // ===== 帖子 =====
  @Get('/post/list')
  async getPostList(@Query() query: any) {
    return this.communityService.getPostList({
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 10,
      userId: query.userId ? Number(query.userId) : undefined,
      tag: query.tag,
      isFeatured: query.isFeatured !== undefined ? Number(query.isFeatured) : undefined,
    });
  }

  @Get('/post/detail')
  async getPostDetail(@Query('id') id: string, @Query('userId') userId?: string) {
    return this.communityService.getPostDetail(
      Number(id),
      userId ? Number(userId) : undefined
    );
  }

  @Get('/post/featured')
  async getFeaturedPosts(@Query('limit') limit?: string) {
    return this.communityService.getFeaturedPosts(limit ? Number(limit) : 10);
  }

  @Post('/post')
  async createPost(@Body() body: any) {
    return this.communityService.createPost(body);
  }

  @Del('/post')
  async deletePost(@Body() body: any) {
    return this.communityService.deletePost(body.id, body.userId);
  }

  // ===== 评论 =====
  @Get('/comment/list')
  async getCommentList(@Query() query: any) {
    return this.communityService.getCommentList({
      postId: Number(query.postId),
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 20,
    });
  }

  @Post('/comment')
  async createComment(@Body() body: any) {
    return this.communityService.createComment(body);
  }

  @Del('/comment')
  async deleteComment(@Body() body: any) {
    return this.communityService.deleteComment(body.id, body.userId);
  }

  // ===== 点赞 =====
  @Post('/like')
  async toggleLike(@Body() body: any) {
    return this.communityService.toggleLike({
      userId: body.userId,
      likeType: body.likeType,
      relatedId: body.relatedId,
    });
  }

  // ===== 收藏 =====
  @Post('/favorite')
  async toggleFavorite(@Body() body: any) {
    return this.communityService.toggleFavorite({
      userId: body.userId,
      favoriteType: body.favoriteType,
      relatedId: body.relatedId,
    });
  }

  @Get('/favorite/list')
  async getFavoriteList(@Query() query: any) {
    return this.communityService.getFavoriteList({
      userId: Number(query.userId),
      favoriteType: query.favoriteType,
      page: query.page ? Number(query.page) : 1,
      pageSize: query.pageSize ? Number(query.pageSize) : 20,
    });
  }
}

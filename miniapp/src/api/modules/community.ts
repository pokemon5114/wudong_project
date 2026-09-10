import { get, post } from '../request';
import type { PageQuery, PageResult, Post } from '../types';

/** 7.8 信息流（登录可选） */
export const feed = (query?: PageQuery & { sort?: 'latest' | 'hot' }) =>
  get<PageResult<Post>>('/api/community/feed', query, { auth: false });

/** 7.8 游记详情 */
export const postDetail = (id: number) => get<Post>(`/api/community/post/${id}`, undefined, { auth: false });

/** 7.8 发布游记（文字≤5000 / 图片≤9 / 视频≤60s / 日发≤10） */
export const publish = (data: {
  title?: string;
  content?: string;
  images?: string[];
  videoUrl?: string;
  relatedLocation?: string;
  topicTags?: string[];
}) => post<{ id: number; status: string }>('/api/community/post', data);

/** 7.8 评论（二级回复） */
export const comment = (data: { postId: number; content: string; replyCommentId?: number }) =>
  post<null>('/api/community/comment', data);

/** 7.8 点赞（幂等切换） */
export const like = (targetType: 'post' | 'comment', id: number) =>
  post<{ liked: boolean; likeCount: number }>(`/api/community/like/${targetType}/${id}`);

/** 7.8 关注 / 取关 */
export const follow = (userId: number) => post<null>(`/api/community/follow/${userId}`);

/** 7.8 收藏 */
export const collect = (postId: number) => post<null>(`/api/community/collect/${postId}`);

/** 7.8 举报 */
export const report = (data: { targetType: 'post' | 'comment'; targetId: number; reason?: string }) =>
  post<null>('/api/community/report', data);

/** 7.8 话题列表 */
export const topicList = () => get<any[]>('/api/community/topic/list', undefined, { auth: false });

/** 7.8 个人主页 */
export const userHome = (id: number) => get<any>(`/api/community/user/${id}`, undefined, { auth: false });

import { get } from '../request';
import type { Banner } from '../types';

/** 首页轮播图（管理员配置，缓存 60s，见 5.8.2） */
export const banners = () => get<Banner[]>('/api/admin/banner', undefined, { auth: false });

import { get, post } from '../request';
import type { Goods, GoodsCategory, PageQuery, PageResult } from '../types';

const publicOpt = { auth: false };

/** 7.4 分类树 */
export const categoryTree = () => get<GoodsCategory[]>('/api/goods/category/tree', undefined, publicOpt);

/** 7.4 商品列表 */
export const list = (query: PageQuery & { categoryId?: number; minPrice?: number; maxPrice?: number; sort?: string }) =>
  get<PageResult<Goods>>('/api/goods/list', query, publicOpt);

/** 7.4 商品搜索 */
export const search = (query: { keyword: string } & PageQuery) =>
  get<PageResult<Goods>>('/api/goods/search', query, publicOpt);

/** 7.4 商品详情 */
export const detail = (id: number) => get<Goods>(`/api/goods/detail/${id}`, undefined, publicOpt);

/** 7.4 评价列表 */
export const evaluations = (goodsId: number, query?: PageQuery & { hasImage?: boolean }) =>
  get<PageResult<any>>(`/api/goods/evaluation/${goodsId}`, query, publicOpt);

/** 7.4 收藏（幂等切换） */
export const collect = (goodsId: number) => post<null>(`/api/goods/collect/${goodsId}`);

/** 7.4 评价 */
export const evaluate = (data: {
  orderId: number;
  goodsId: number;
  score: number;
  content?: string;
  images?: string[];
}) => post<{ id: number }>('/api/goods/evaluate', data);

/** 7.4 追评 */
export const appendEvaluate = (data: { evaluationId: number; content?: string; images?: string[] }) =>
  post<null>('/api/goods/evaluate/append', data);

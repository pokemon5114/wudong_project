import { get, post } from '../request';
import type { PageQuery, PageResult, Restaurant } from '../types';

const publicOpt = { auth: false };

/** 7.5 餐厅列表 */
export const restaurantList = (query?: PageQuery & { sort?: string; longitude?: number; latitude?: number }) =>
  get<PageResult<Restaurant>>('/api/food/restaurant/list', query, publicOpt);

/** 7.5 餐厅详情 */
export const restaurantDetail = (id: number) =>
  get<Restaurant>(`/api/food/restaurant/detail/${id}`, undefined, publicOpt);

/** 7.5 餐位预订（提前 ≥2h，生成 food_seat 订单） */
export const reserve = (data: {
  restaurantId: number;
  timeSlotId: number;
  date: string;
  peopleCount: number;
  name: string;
  phone: string;
  remark?: string;
}) => post<{ id: number; orderNo: string; status: string }>('/api/food/reserve', data);

/** 7.5 农产品列表 */
export const productList = (query?: PageQuery & { categoryId?: number; sort?: string }) =>
  get<PageResult<any>>('/api/food/product/list', query, publicOpt);

/** 7.5 农产品详情 */
export const productDetail = (id: number) => get<any>(`/api/food/product/detail/${id}`, undefined, publicOpt);

/** 7.5 收藏（餐厅 / 商品） */
export const collect = (targetType: 'restaurant' | 'product', id: number) =>
  post<null>(`/api/food/collect/${targetType}/${id}`);

/** 7.5 我的预订 */
export const myReserve = (query?: PageQuery) => get<PageResult<any>>('/api/food/reserve/my', query);

/** 7.5 取消预订 */
export const cancelReserve = (orderId: number) => post<null>(`/api/food/reserve/cancel/${orderId}`);

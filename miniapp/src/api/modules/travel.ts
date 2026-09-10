import { get, post } from '../request';
import type { Eticket, PageQuery, PageResult, Route, Scenic } from '../types';

const publicOpt = { auth: false };

/** 7.7 景区列表 */
export const scenicList = (query?: PageQuery) =>
  get<PageResult<Scenic>>('/api/travel/scenic/list', query, publicOpt);

/** 7.7 景区详情 */
export const scenicDetail = (id: number) =>
  get<Scenic>(`/api/travel/scenic/detail/${id}`, undefined, publicOpt);

/** 7.7 门票购买（按使用日期分库存，生成电子票） */
export const ticketBuy = (data: {
  ticketTypeId: number;
  useDate: string;
  quantity: number;
  visitors: { name: string; idCard: string }[];
}) => post<{ id: number; orderNo: string; status: string }>('/api/travel/ticket/buy', data);

/** 7.7 路线列表 */
export const routeList = (query?: PageQuery & { days?: number; theme?: string }) =>
  get<PageResult<Route>>('/api/travel/route/list', query, publicOpt);

/** 7.7 路线详情 */
export const routeDetail = (id: number) =>
  get<Route>(`/api/travel/route/detail/${id}`, undefined, publicOpt);

/** 7.7 路线购买（提前 ≥1 天） */
export const routeBuy = (data: {
  routeId: number;
  departureDate: string;
  peopleCount: number;
  visitors: { name: string; idCard: string }[];
}) => post<{ id: number; orderNo: string; status: string }>('/api/travel/route/buy', data);

/** 7.7 电子票 */
export const eticket = (orderId: number) => get<Eticket>(`/api/travel/eticket/${orderId}`);

/** 7.7 退票（使用前 24h 扣 10%） */
export const refund = (orderId: number) => post<null>(`/api/travel/refund/${orderId}`);

/** 7.7 交通攻略 */
export const guideList = (query?: PageQuery & { departure?: string }) =>
  get<PageResult<any>>('/api/travel/guide/list', query, publicOpt);

/** 7.7 收藏（景区 / 路线 / 攻略） */
export const collect = (targetType: 'scenic' | 'route' | 'guide', id: number) =>
  post<null>(`/api/travel/collect/${targetType}/${id}`);

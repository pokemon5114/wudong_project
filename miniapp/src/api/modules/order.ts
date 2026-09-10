import { get, post } from '../request';
import type { CreateOrderInput, Order, OrderStatus, OrderType, PageQuery, PageResult } from '../types';

/** 7.3.3 下单（金额以服务端权威取价为准，见 ADR-5） */
export const create = (input: CreateOrderInput) =>
  post<{ id: number; orderNo: string; status: OrderStatus; payAmount: number }>(
    '/api/order/create',
    input,
  );

/** 7.3.3 我的订单列表 */
export const list = (query?: PageQuery & { orderType?: OrderType; status?: OrderStatus }) =>
  get<PageResult<Order>>('/api/order/list', query);

/** 7.3.3 订单详情 */
export const detail = (id: number) => get<Order>(`/api/order/detail/${id}`);

/** 7.3.3 取消订单（仅 PENDING） */
export const cancel = (id: number) => post<{ id: number; status: OrderStatus }>(`/api/order/cancel/${id}`);

/** 7.3.3 支付（mock） */
export const pay = (orderNo: string) =>
  post<{ status: string; orderStatus: OrderStatus }>(`/api/order/pay/${orderNo}`);

/** 7.3.3 确认收货 / 完成 */
export const confirm = (id: number) =>
  post<{ id: number; status: OrderStatus }>(`/api/order/confirm/${id}`);

/** 7.3.3 申请退款 */
export const refund = (id: number) =>
  post<{ id: number; status: OrderStatus }>(`/api/order/refund/${id}`);

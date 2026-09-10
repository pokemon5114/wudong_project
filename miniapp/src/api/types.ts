/**
 * 接口契约类型 —— 严格对应《技术文档》第 7 章与 4.7 枚举
 */

/** 统一返回结构（7.1） */
export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}

/** 分页返回（7.3.3 等） */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
}

export interface PageQuery {
  page?: number;
  size?: number;
}

/** 4.7.1 订单状态（8 态） */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'FINISHED'
  | 'CANCELED'
  | 'REFUND_PENDING'
  | 'REFUNDED';

/** 4.7.2 订单类型 */
export type OrderType = 'goods' | 'food_seat' | 'hotel' | 'ticket' | 'route';

/** 4.7.3 用户类型 */
export type UserType = 0 | 1 | 2;

/** 7.3.1 用户 */
export interface User {
  id: number;
  username: string;
  nickname?: string;
  avatar?: string;
  gender?: 0 | 1 | 2;
  region?: string;
  bio?: string;
  userType?: UserType;
}

export interface LoginResult {
  token: string;
  user: User;
}

/** 7.3.3 订单明细 */
export interface OrderItem {
  id?: number;
  module: 'goods' | 'food' | 'hotel' | 'travel';
  entityType: 'goods_sku' | 'product_sku' | 'seat' | 'room_type' | 'ticket_type' | 'route';
  entityId: number;
  title: string;
  specName?: string;
  image?: string;
  price: number;
  quantity: number;
  startDate?: string;
  endDate?: string;
}

/** 7.10 下单入参 */
export interface CreateOrderInput {
  orderType: OrderType;
  merchantId?: number;
  items: OrderItem[];
  title?: string;
  totalAmount: number;
  freightAmount?: number;
  payAmount: number;
  snapshot?: Record<string, any>;
}

export interface Order {
  id: number;
  orderNo: string;
  orderType: OrderType;
  title?: string;
  totalAmount: number;
  freightAmount?: number;
  payAmount: number;
  status: OrderStatus;
  refundAmount?: number;
  createTime?: string;
  payTime?: string;
  items?: OrderItem[];
}

/** 7.4 商品 */
export interface Goods {
  id: number;
  title: string;
  subtitle?: string;
  mainImage?: string;
  price: number;
  marketPrice?: number;
  stock?: number;
  sales?: number;
  score?: number;
  detail?: string;
  craftIntro?: string;
  inheritorName?: string;
  inheritorStory?: string;
  images?: string[];
  evaluationCount?: number;
  skus?: GoodsSku[];
}

export interface GoodsSku {
  id: number;
  skuName: string;
  price: number;
  stock: number;
  image?: string;
}

export interface GoodsCategory {
  id: number;
  name: string;
  children?: GoodsCategory[];
}

/** 7.3.4 购物车 */
export interface CartItem {
  id: number;
  module: 'goods' | 'food';
  entityType: 'goods_sku' | 'product_sku';
  entityId: number;
  title?: string;
  specName?: string;
  image?: string;
  price?: number;
  quantity: number;
  checked: 0 | 1;
}

/** 7.5 餐厅 */
export interface Restaurant {
  id: number;
  name: string;
  mainImage?: string;
  address?: string;
  distance?: number;
  score?: number;
  avgPrice?: number;
  intro?: string;
  businessHours?: string;
  capacity?: number;
  dishes?: Dish[];
  timeSlots?: TimeSlot[];
}

export interface Dish {
  id: number;
  name: string;
  price: number;
  isSignature?: boolean;
}

export interface TimeSlot {
  id: number;
  name: string;
  maxReserve: number;
}

/** 7.6 民宿 */
export interface Homestay {
  id: number;
  name: string;
  mainImage?: string;
  styleTag?: string;
  facilityTag?: string;
  score?: number;
  minPrice?: number;
  intro?: string;
  notice?: Record<string, any>;
  roomTypes?: RoomType[];
}

export interface RoomType {
  id: number;
  name: string;
  bedType?: string;
  area?: number;
  capacity?: number;
  price: number;
  stock: number;
}

export interface RoomCalendarDay {
  date: string;
  stock: number;
  price: number;
}

/** 7.7 景区 / 票种 / 路线 / 电子票 */
export interface Scenic {
  id: number;
  name: string;
  openTime?: string;
  mainImage?: string;
  ticketTypes?: TicketType[];
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface Route {
  id: number;
  title: string;
  days: number;
  price: number;
  includedItems?: string;
  mainImage?: string;
  plans?: RoutePlan[];
}

export interface RoutePlan {
  day: number;
  description?: string;
  scenic?: string;
  meal?: string;
  hotel?: string;
  traffic?: string;
}

export interface Eticket {
  orderId: number;
  qrCode: string;
  validDate?: string;
  status: 'UNUSED' | 'USED' | 'REFUNDED';
}

/** 7.8 社区 */
export interface Post {
  id: number;
  title?: string;
  content?: string;
  images?: string[];
  videoUrl?: string;
  likeCount: number;
  commentCount: number;
  topicTags?: string[];
  author?: Pick<User, 'id' | 'nickname' | 'avatar'>;
}

/** 7.3.5 消息 */
export interface Message {
  id: number;
  type: 'system' | 'order' | 'interact';
  title: string;
  content: string;
  isRead: 0 | 1;
}

/** 7.3.6 收货地址 */
export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: 0 | 1;
}

/** 7.9 首页运营 */
export interface Banner {
  id: number;
  title?: string;
  imageUrl: string;
  linkUrl?: string;
}

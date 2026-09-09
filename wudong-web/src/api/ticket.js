import request from '@/utils/request'

// 获取景区列表
export function getScenicList(params) {
  return request.get('/app/ticket/scenic/list', { params })
}

// 获取景区详情
export function getScenicDetail(id) {
  return request.get('/app/ticket/scenic/detail', { params: { id } })
}

// 获取路线列表
export function getRouteList(params) {
  return request.get('/app/ticket/route/list', { params })
}

// 获取路线详情
export function getRouteDetail(id) {
  return request.get('/app/ticket/route/detail', { params: { id } })
}

// 获取推荐路线
export function getRecommendRoutes(limit = 6) {
  return request.get('/app/ticket/route/recommend', { params: { limit } })
}

// 创建订单
export function createOrder(data) {
  return request.post('/app/ticket/order', data)
}

// 获取订单列表
export function getOrderList(userId, orderType, page = 1, pageSize = 10) {
  return request.get('/app/ticket/order/list', { params: { userId, orderType, page, pageSize } })
}

// 获取订单详情
export function getOrderDetail(id, userId) {
  return request.get('/app/ticket/order/detail', { params: { id, userId } })
}

// 取消订单
export function cancelOrder(id, userId, reason) {
  return request.post('/app/ticket/order/cancel', { id, userId, reason })
}

// 支付订单
export function payOrder(id, userId, payMethod) {
  return request.post('/app/ticket/order/pay', { id, userId, payMethod })
}

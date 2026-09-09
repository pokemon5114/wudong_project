import request from '@/utils/request'

// 管理员登录
export function adminLogin(username, password) {
  return request.post('/admin/login', { username, password })
}

// 获取管理员信息
export function getAdminInfo() {
  return request.get('/admin/info')
}

// 获取统计数据
export function getStatistics() {
  return request.get('/admin/statistics')
}

// 获取用户列表
export function getUserList(params) {
  return request.get('/admin/user/list', { params })
}

// 获取订单列表
export function getAdminOrderList(params) {
  return request.get('/admin/order/list', { params })
}

// 获取商品列表
export function getAdminProductList(params) {
  return request.get('/admin/product/list', { params })
}

// 创建/更新商品
export function saveProduct(data) {
  return request.post('/admin/product/save', data)
}

// 删除商品
export function deleteProduct(id) {
  return request.post('/admin/product/delete', { id })
}

// 获取餐厅列表
export function getAdminRestaurantList(params) {
  return request.get('/admin/restaurant/list', { params })
}

// 获取民宿列表
export function getAdminHotelList(params) {
  return request.get('/admin/hotel/list', { params })
}

// 获取路线列表
export function getAdminRouteList(params) {
  return request.get('/admin/route/list', { params })
}

// 获取帖子列表
export function getAdminPostList(params) {
  return request.get('/admin/post/list', { params })
}

// 获取配置
export function getConfigs() {
  return request.get('/admin/config/list')
}

// 更新配置
export function updateConfig(key, value) {
  return request.post('/admin/config/update', { key, value })
}

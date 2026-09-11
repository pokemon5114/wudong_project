<template>
  <view class="mine">
    <!-- 顶部品牌区 -->
    <view class="header-bar">
      <text class="header-bar__title">我的</text>
      <view class="header-bar__actions">
        <view class="header-bar__icon">⚙️</view>
        <view class="header-bar__icon">•••</view>
      </view>
    </view>

    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-card__bg">
        <view class="user-card__content" @click="onHeaderTap">
          <image class="user-card__avatar" :src="user.profile?.avatar || defaultAvatar" mode="aspectFill" />
          <view class="user-card__info">
            <text class="user-card__name">{{ user.isLogin ? user.nickname : '点击登录' }}</text>
            <text class="user-card__tip">{{ user.isLogin ? user.profile?.bio || '欢迎回来' : '登录后可下单、收藏、发布游记' }}</text>
          </view>
          <text class="user-card__arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 订单区域 -->
    <view class="section">
      <view class="section__header">
        <text class="section__title">我的订单</text>
        <text class="section__more" @click="goOrders('')">全部 ›</text>
      </view>
      <view class="order-tabs">
        <view v-for="o in orderTabs" :key="o.status" class="order-tab" @click="goOrders(o.status)">
          <view class="order-tab__icon">{{ o.icon }}</view>
          <text class="order-tab__label">{{ o.label }}</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="section">
      <view
        v-for="m in menus"
        :key="m.url"
        class="menu-item"
        @click="go(m.url)"
      >
        <view class="menu-item__left">
          <view class="menu-item__icon">{{ m.icon }}</view>
          <text class="menu-item__name">{{ m.name }}</text>
        </view>
        <text class="menu-item__arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="user.isLogin" class="logout-btn" @click="logout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/store/user';

const user = useUserStore();
const defaultAvatar = 'https://images.pexels.com/photos/7400017/pexels-photo-7400017.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop';

const orderTabs = [
  { label: '待支付', status: 'PENDING', icon: '💳' },
  { label: '已支付', status: 'PAID', icon: '✅' },
  { label: '已完成', status: 'FINISHED', icon: '📦' },
  { label: '退款/售后', status: 'REFUNDED', icon: '🔄' },
];

const menus = [
  { icon: '❤️', name: '我的收藏', url: '/pages/mine/collect' },
  { icon: '📍', name: '收货地址', url: '/pages/mine/address' },
  { icon: '💬', name: '消息', url: '/pages/mine/message' },
  { icon: '🎫', name: '我的电子票', url: '/pages/travel/eticket?orderId=1' },
];

function onHeaderTap() {
  if (!user.isLogin) uni.navigateTo({ url: '/pages/login/login' });
}

function goOrders(status: string) {
  uni.navigateTo({ url: `/pages/order/list${status ? `?status=${status}` : ''}` });
}

function go(url: string) {
  uni.navigateTo({ url });
}

function logout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        user.logout();
        uni.showToast({ title: '已退出', icon: 'success' });
      }
    },
  });
}

onShow(async () => {
  if (user.isLogin && !user.profile) {
    try {
      await user.loadProfile();
    } catch {
      user.logout();
    }
  }
});
</script>

<style scoped>
.mine {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff8e7 0%, #fffbf0 30%, #fef9e7 100%);
  padding-bottom: 60rpx;
}

/* 顶部品牌区 */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 50%, #1a365d 100%);
}
.header-bar__title {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}
.header-bar__actions {
  display: flex;
  gap: 20rpx;
}
.header-bar__icon {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
}

/* 用户信息卡片 */
.user-card {
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
  border: 3rpx solid #D4AF37;
}
.user-card__bg {
  background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 100%);
  padding: 30rpx;
}
.user-card__content {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 2rpx solid #E8C872;
}
.user-card__avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #D4AF37;
  background: #f5f5f5;
}
.user-card__info {
  flex: 1;
  padding-left: 24rpx;
}
.user-card__name {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}
.user-card__tip {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
.user-card__arrow {
  font-size: 40rpx;
  color: #D4AF37;
  font-weight: bold;
}

/* 区块通用 */
.section {
  background: #fff;
  border-radius: 16rpx;
  border: 3rpx solid #D4AF37;
  margin: 20rpx;
  padding: 24rpx;
}
.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.section__title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1a365d;
}
.section__more {
  font-size: 26rpx;
  color: #999;
}

/* 订单Tab */
.order-tabs {
  display: flex;
  justify-content: space-around;
}
.order-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
}
.order-tab__icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}
.order-tab__label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

/* 功能菜单 */
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 2rpx solid #f5f0e6;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item__left {
  display: flex;
  align-items: center;
}
.menu-item__icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}
.menu-item__name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
.menu-item__arrow {
  font-size: 36rpx;
  color: #D4AF37;
  font-weight: bold;
}

/* 退出登录 */
.logout-btn {
  margin: 30rpx 20rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 100%);
  border-radius: 44rpx;
  border: 3rpx solid #D4AF37;
}
.logout-btn text {
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}
</style>

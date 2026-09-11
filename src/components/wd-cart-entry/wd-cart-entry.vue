<template>
  <view class="wd-cart-entry" @click="goCart">
    <view class="wd-cart-entry__icon-wrap">
      <view class="wd-cart-entry__basket" />
      <text v-if="cart.count > 0" class="wd-cart-entry__badge">
        {{ cart.count > 99 ? '99+' : cart.count }}
      </text>
    </view>
    <text class="wd-cart-entry__text">购物车</text>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';

const cart = useCartStore();
const user = useUserStore();

/**
 * 购物车自 2026-09-11 起是 tabBar 页面，只能用 switchTab 跳；
 * 用 navigateTo 会被小程序静默忽略（不报错，但页面不动）。
 */
function goCart() {
  uni.switchTab({ url: '/pages/cart/cart' });
}

/** 角标要显示真实数量。store 是内存态，直接进详情页时 items 还是空的，所以进页面同步一次 */
onMounted(() => {
  if (!user.isLogin) return;
  cart.load().catch(() => undefined);
});
</script>

<style scoped>
.wd-cart-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  margin-right: 16rpx;
}
.wd-cart-entry__icon-wrap {
  position: relative;
  /* 篮下的两只轮子要伸出去约 9rpx，这里把位置让出来 */
  margin-bottom: 12rpx;
}
/**
 * 纯 CSS 靛蓝线稿购物车 —— 原来是一个 🛒 emoji。
 * 这个图标出现在所有商品页底栏，是「一眼看出有没有设计过」的位置，
 * emoji 的多色和旁边的靛蓝/红按钮完全不在一个体系里。
 */
.wd-cart-entry__basket {
  position: relative;
  width: 36rpx;
  height: 26rpx;
  border: 3rpx solid var(--wd-accent);
  border-top: none;
  border-radius: 0 0 8rpx 8rpx;
  box-sizing: border-box;
}
/* 提手 */
.wd-cart-entry__basket::before {
  content: '';
  position: absolute;
  left: 8rpx;
  top: -13rpx;
  width: 14rpx;
  height: 13rpx;
  border: 3rpx solid var(--wd-accent);
  border-bottom: none;
  border-radius: 8rpx 8rpx 0 0;
  box-sizing: border-box;
}
/* 两只轮子：一个点 + 一个 box-shadow 偏移，省掉一个伪元素 */
.wd-cart-entry__basket::after {
  content: '';
  position: absolute;
  left: -1rpx;
  bottom: -12rpx;
  width: 7rpx;
  height: 7rpx;
  border-radius: 50%;
  background: var(--wd-accent);
  box-shadow: 25rpx 0 0 var(--wd-accent);
}
.wd-cart-entry__badge {
  position: absolute;
  top: -14rpx;
  right: -18rpx;
  min-width: 28rpx;
  height: 28rpx;
  line-height: 28rpx;
  padding: 0 6rpx;
  border-radius: 14rpx;
  background: var(--wd-brand);
  color: #fff;
  font-size: 24rpx;
  text-align: center;
}
.wd-cart-entry__text {
  font-size: 24rpx;
  color: var(--wd-text-3);
  margin-top: 4rpx;
}
</style>

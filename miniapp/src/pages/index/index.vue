<template>
  <view class="home">
    <swiper
      class="banner"
      circular
      autoplay
      :interval="4000"
      indicator-dots
      indicator-active-color="#e54d42"
    >
      <swiper-item v-for="b in banners" :key="b.id">
        <image class="banner__img" :src="b.imageUrl" mode="aspectFill" lazy-load />
      </swiper-item>
    </swiper>

    <view class="entries">
      <view v-for="e in entries" :key="e.name" class="entry" @click="goEntry(e)">
        <text class="entry__icon">{{ e.icon }}</text>
        <text class="entry__name">{{ e.name }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section__title">非遗好物</text>
      <wd-loading v-if="loading" />
      <wd-empty v-else-if="!goods.length" text="暂无商品" />
      <view v-else class="goods">
        <wd-goods-card v-for="g in goods" :key="g.id" :goods="g" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as homeApi from '@/api/modules/home';
import * as goodsApi from '@/api/modules/goods';
import type { Banner, Goods } from '@/api/types';

const banners = ref<Banner[]>([]);
const goods = ref<Goods[]>([]);
const loading = ref(true);

const entries = [
  { name: '衣', icon: '🧣', url: '/pages/goods/list', tab: false },
  { name: '食', icon: '🍲', url: '/pages/food/restaurant?id=1', tab: false },
  { name: '住', icon: '🏡', url: '/pages/hotel/list', tab: false },
  { name: '行', icon: '🎫', url: '/pages/travel/ticket', tab: false },
  { name: '社区', icon: '📷', url: '/pages/community/feed', tab: true },
];

function goEntry(e: (typeof entries)[number]) {
  if (e.tab) uni.switchTab({ url: e.url });
  else uni.navigateTo({ url: e.url });
}

onLoad(async () => {
  try {
    const [b, g] = await Promise.all([homeApi.banners(), goodsApi.list({ page: 1, size: 10 })]);
    banners.value = b;
    goods.value = g.list;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  padding-bottom: 40rpx;
}
.banner {
  height: 340rpx;
  background: #eee;
}
.banner__img {
  width: 100%;
  height: 340rpx;
}
.entries {
  display: flex;
  background: #fff;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}
.entry {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.entry__icon {
  font-size: 52rpx;
}
.entry__name {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #333;
}
.section {
  padding: 0 20rpx;
}
.section__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin: 20rpx 0;
}
</style>

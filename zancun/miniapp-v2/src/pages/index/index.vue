<template>
  <view class="home">
    <!-- 顶部品牌区 -->
    <view class="header">
      <view class="header__brand">
        <text class="header__logo">乌东文旅</text>
        <text class="header__subtitle">WUDONG CULTURAL TOURISM</text>
      </view>
      <view class="header__actions">
        <view class="header__icon-btn">📷</view>
        <view class="header__icon-btn">•••</view>
      </view>
    </view>

    <!-- Banner 轮播 -->
    <view class="banner-wrap">
      <swiper
        class="banner"
        circular
        autoplay
        :interval="4000"
        indicator-dots
        indicator-active-color="#e54d42"
      >
        <swiper-item v-for="b in effectiveBanners" :key="b.id">
          <image
            class="banner__img"
            :src="b.imageUrl"
            mode="aspectFill"
            @error="onBannerError($event, b)"
          />
          <view class="banner__overlay">
            <text class="banner__title">乌东·云上苗寨</text>
            <text class="banner__subtitle">雷公山下，苗疆与长桌宴的故乡</text>
          </view>
        </swiper-item>
      </swiper>
      <!-- 撕裂波浪分隔线 -->
      <view class="banner-wave"></view>
    </view>

    <!-- 搜索区域 -->
    <view class="search-section">
      <!-- 位置标识 -->
      <view class="location" @click="selectLocation">
        <text class="location__icon">📍</text>
        <text class="location__text">乌东苗寨</text>
        <text class="location__arrow">▼</text>
      </view>
      <!-- 搜索框 -->
      <view class="search" @click="goSearch">
        <view class="search__icon-wrap"><wd-icon name="search" :size="32" /></view>
        <text class="search__text">您想去哪里</text>
      </view>
      <!-- 专属顾问按钮 -->
      <view class="consultant-btn">专属顾问</view>
    </view>

    <!-- 功能入口网格 2×4 -->
    <view class="feature-grid">
      <view
        v-for="f in features"
        :key="f.name"
        class="feature-item"
        @click="goFeature(f)"
      >
        <image class="feature-item__img" :src="f.image" mode="aspectFill" />
        <text class="feature-item__name">{{ f.name }}</text>
      </view>
    </view>

    <!-- 分类卡片区 -->
    <view class="category-section">
      <text class="category-section__title">发现精彩</text>
      <view class="category-cards">
        <view
          v-for="c in categories"
          :key="c.name"
          class="category-card"
          @click="goCategory(c)"
        >
          <image class="category-card__img" :src="c.image" mode="aspectFill" />
          <view class="category-card__info">
            <text class="category-card__name">{{ c.name }}</text>
            <text class="category-card__desc">{{ c.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 限时活动卡片 -->
    <view class="activity" @click="goActivity">
      <view class="activity__body">
        <text class="activity__title">苗年节·长桌宴预订</text>
        <text class="activity__desc">含拦门酒，苗绣体验，长桌宴，限30席</text>
        <view class="activity__countdown">
          <text class="activity__countdown-label">距离结束：</text>
          <text class="activity__countdown-time">{{ countdown }}</text>
        </view>
      </view>
      <view class="activity__btn">立即预订</view>
    </view>

    <!-- 本周热卖 -->
    <view class="section">
      <view class="section__header">
        <text class="section__title">本周热卖</text>
        <text class="section__more" @click="goMore('hot')">更多 ></text>
      </view>
      <view class="hots">
        <view
          v-for="(h, i) in hotGoods"
          :key="h.id"
          class="hot-item"
          @click="goDetail(h)"
        >
          <view :class="['hot-item__rank', `hot-item__rank--${i + 1}`]">{{ i + 1 }}</view>
          <image class="hot-item__img" :src="h.coverImage || h.mainImage || ''" mode="aspectFill" />
          <text class="hot-item__name">{{ h.name || h.title }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐产品横向滚动 -->
    <view class="section">
      <view class="section__header">
        <text class="section__title">精选推荐</text>
        <text class="section__more" @click="goMore('recommend')">更多 ></text>
      </view>
      <scroll-view class="recommend-scroll" scroll-x>
        <view
          v-for="r in recommendProducts"
          :key="r.id"
          class="recommend-item"
          @click="goRecommend(r)"
        >
          <image class="recommend-item__img" :src="r.image" mode="aspectFill" />
          <view class="recommend-item__info">
            <text class="recommend-item__title">{{ r.title }}</text>
            <text class="recommend-item__price">¥{{ r.price.toFixed(2) }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 非遗好物 -->
    <view class="section">
      <view class="section__header">
        <text class="section__title">非遗好物</text>
        <text class="section__more" @click="goMore('goods')">更多 ></text>
      </view>
      <wd-loading v-if="loading" />
      <wd-empty v-else-if="!goods.length" text="暂无商品" />
      <view v-else class="goods">
        <wd-goods-card v-for="g in goods" :key="g.id" :goods="transformGoods(g)" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import * as homeApi from '@/api/modules/home';
import * as goodsApi from '@/api/modules/goods';
import type { Banner, Goods } from '@/api/types';
import { banners as mockBanners, goodsList as mockGoods } from '@/mock/data';

// 默认轮播图
const defaultBanners: Banner[] = [
  { id: 1, title: '乌东苗寨', imageUrl: 'https://images.pexels.com/photos/6129969/pexels-photo-6129969.jpeg?auto=compress&cs=tinysrgb&w=750&h=380&fit=crop' },
  { id: 2, title: '长桌宴', imageUrl: 'https://images.pexels.com/photos/16582298/pexels-photo-16582298.jpeg?auto=compress&cs=tinysrgb&w=750&h=380&fit=crop' },
  { id: 3, title: '蜡染刺绣', imageUrl: 'https://images.pexels.com/photos/31119469/pexels-photo-31119469.jpeg?auto=compress&cs=tinysrgb&w=750&h=380&fit=crop' },
];

const banners = ref<Banner[]>([]);
const goods = ref<Goods[]>([]);
const hotGoods = ref<Goods[]>([]);
const loading = ref(true);

// 功能入口 2×4
const features = [
  { name: '非遗手作', icon: '🎨', image: 'https://images.pexels.com/photos/34583535/pexels-photo-34583535.jpeg?w=200&h=200&fit=crop', url: '/pages/goods/list' },
  { name: '苗族银饰', icon: '✨', image: 'https://images.pexels.com/photos/14802898/pexels-photo-14802898.jpeg?w=200&h=200&fit=crop', url: '/pages/goods/list' },
  { name: '蜡染刺绣', icon: '🧵', image: 'https://images.pexels.com/photos/17881567/pexels-photo-17881567.jpeg?w=200&h=200&fit=crop', url: '/pages/goods/list' },
  { name: '长桌宴', icon: '🍽️', image: 'https://images.pexels.com/photos/16582298/pexels-photo-16582298.jpeg?w=200&h=200&fit=crop', url: '/pages/food/restaurant?id=1' },
  { name: '精品民宿', icon: '🏠', image: 'https://images.pexels.com/photos/36647675/pexels-photo-36647675.jpeg?w=200&h=200&fit=crop', url: '/pages/hotel/list' },
  { name: '景区门票', icon: '🎫', image: 'https://images.pexels.com/photos/7206100/pexels-photo-7206100.png?w=200&h=200&fit=crop', url: '/pages/travel/ticket' },
  { name: '研学营地', icon: '⛺', image: 'https://images.pexels.com/photos/14036107/pexels-photo-14036107.jpeg?w=200&h=200&fit=crop', url: '/pages/travel/route' },
  { name: '旅游路线', icon: '🗺️', image: 'https://images.pexels.com/photos/8776825/pexels-photo-8776825.jpeg?w=200&h=200&fit=crop', url: '/pages/travel/route' },
];

// 分类卡片
const categories = [
  { name: '青少文旅', desc: '研学旅行', image: 'https://images.pexels.com/photos/7400017/pexels-photo-7400017.jpeg?w=300&h=200&fit=crop', color: '#22C55E' },
  { name: '亲子文旅', desc: '家庭出游', image: 'https://images.pexels.com/photos/34161634/pexels-photo-34161634.jpeg?w=300&h=200&fit=crop', color: '#F97316' },
  { name: '银发文旅', desc: '康养旅居', image: 'https://images.pexels.com/photos/2161540/pexels-photo-2161540.jpeg?w=300&h=200&fit=crop', color: '#EF4444' },
  { name: '全龄文旅', desc: '阖家出行', image: 'https://images.pexels.com/photos/34408549/pexels-photo-34408549.jpeg?w=300&h=200&fit=crop', color: '#3B82F6' },
];

// 推荐产品
const recommendProducts = ref([
  { id: 1, title: '乌东苗寨一日游', price: 268, image: 'https://images.pexels.com/photos/14036107/pexels-photo-14036107.jpeg?w=400&h=300&fit=crop' },
  { id: 2, title: '苗寨深度两日游', price: 598, image: 'https://images.pexels.com/photos/8776825/pexels-photo-8776825.jpeg?w=400&h=300&fit=crop' },
  { id: 3, title: '长桌宴体验', price: 168, image: 'https://images.pexels.com/photos/16582298/pexels-photo-16582298.jpeg?w=400&h=300&fit=crop' },
  { id: 4, title: '蜡染体验课', price: 88, image: 'https://images.pexels.com/photos/34583535/pexels-photo-34583535.jpeg?w=400&h=300&fit=crop' },
]);

const effectiveBanners = computed(() => banners.value.length > 0 ? banners.value : defaultBanners);

function transformGoods(g: Goods) {
  return {
    ...g,
    title: g.name || g.title,
    image: g.coverImage || g.mainImage || '',
    price: g.price,
  };
}

function onBannerError(e: any, banner: Banner) {
  const index = effectiveBanners.value.findIndex(b => b.id === banner.id);
  if (index > -1 && banners.value.length > 0) {
    banners.value[index] = { ...banner, imageUrl: defaultBanners[index % defaultBanners.length].imageUrl };
  }
}

// 倒计时
const endTime = new Date('2026-09-30 23:59:59');
const countdown = ref('00:00:00');
let countdownTimer: ReturnType<typeof setInterval> | undefined;

function updateCountdown() {
  const now = Date.now();
  const diff = endTime.getTime() - now;
  if (diff <= 0) {
    countdown.value = '00:00:00';
    return;
  }
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  countdown.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function selectLocation() {
  uni.showToast({ title: '当前位置：乌东苗寨', icon: 'none' });
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' });
}

function goFeature(f: any) {
  uni.navigateTo({ url: f.url });
}

function goCategory(c: any) {
  uni.navigateTo({ url: '/pages/goods/list' });
}

function goDetail(g: Goods) {
  uni.navigateTo({ url: `/pages/goods/detail?id=${g.id}` });
}

function goRecommend(r: any) {
  uni.navigateTo({ url: `/pages/travel/route?id=${r.id}` });
}

function goActivity() {
  uni.navigateTo({ url: '/pages/travel/route?id=1' });
}

function goMore(type: string) {
  if (type === 'goods') {
    uni.navigateTo({ url: '/pages/goods/list' });
  } else if (type === 'hot') {
    uni.navigateTo({ url: '/pages/goods/list' });
  } else {
    uni.navigateTo({ url: '/pages/travel/route' });
  }
}

onMounted(() => {
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);

  // 直接使用 mock 数据确保页面能显示
  banners.value = mockBanners;
  goods.value = mockGoods;
  hotGoods.value = mockGoods.slice(0, 3);
  loading.value = false;

  // 异步尝试从 API 获取数据（不阻塞页面显示）
  homeApi.banners()
    .then(b => { if (b && b.length > 0) banners.value = b; })
    .catch(() => {});

  goodsApi.list({ page: 1, size: 10 })
    .then(g => { if (g?.list?.length) goods.value = g.list; })
    .catch(() => {});

  goodsApi.list({ page: 1, size: 3, sort: 'sales' })
    .then(hot => { if (hot?.list?.length) hotGoods.value = hot.list.slice(0, 3); })
    .catch(() => {});
});

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer);
});
</script>

<style scoped>
.home {
  padding-bottom: 40rpx;
  background: linear-gradient(180deg, #fff8e7 0%, #fffbf0 30%, #fef9e7 100%);
}

/* 顶部品牌区 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 50%, #1a365d 100%);
}
.header__brand {
  display: flex;
  flex-direction: column;
}
.header__logo {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
}
.header__subtitle {
  font-size: 20rpx;
  color: rgba(255,255,255,0.8);
  letter-spacing: 1rpx;
  margin-top: 4rpx;
}
.header__actions {
  display: flex;
  gap: 20rpx;
}
.header__icon-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  color: #fff;
}

/* Banner */
.banner-wrap {
  position: relative;
}
.banner {
  height: 380rpx;
  background: #f0e6c8;
  overflow: hidden;
}
.banner__img {
  width: 100%;
  height: 380rpx;
}
.banner__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80rpx 30rpx 30rpx;
  background: linear-gradient(to top, rgba(26,54,93,0.9) 0%, rgba(26,54,93,0.6) 50%, transparent 100%);
  color: #fff;
}
.banner__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.4);
}
.banner__subtitle {
  display: block;
  font-size: 26rpx;
  color: rgba(255,255,255,0.95);
  margin-top: 10rpx;
  text-shadow: 0 1rpx 4rpx rgba(0,0,0,0.3);
}

/* 撕裂波浪分隔线 */
.banner-wave {
  height: 50rpx;
  background: linear-gradient(180deg, #D4A84C 0%, #C9A84C 100%);
  clip-path: polygon(
    0% 0%, 8% 100%, 16% 30%, 24% 100%, 32% 50%, 40% 100%,
    48% 20%, 56% 100%, 64% 60%, 72% 100%, 80% 40%, 88% 100%,
    96% 30%, 100% 100%, 100% 0%
  );
}

/* 搜索区域 */
.search-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 0 24rpx;
  margin-top: 20rpx;
}
.location {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #fff;
  border-radius: 50rpx;
  border: 2rpx solid #D4AF37;
  flex-shrink: 0;
}
.location__icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}
.location__text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}
.location__arrow {
  font-size: 20rpx;
  color: #999;
  margin-left: 8rpx;
}
.search {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 22rpx 28rpx;
  background: #fff;
  border-radius: 50rpx;
  border: 2rpx solid rgba(212,168,75,0.3);
}
.search__icon-wrap {
  margin-right: 16rpx;
  color: #b4a03c;
}
.search__text {
  font-size: 28rpx;
  color: #999;
}
.consultant-btn {
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941C 100%);
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  border-radius: 50rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(180,140,60,0.3);
}

/* 功能入口网格 2×4 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  padding: 30rpx 24rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  border: 3rpx solid #D4AF37;
}
.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.feature-item__img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #D4AF37;
  box-shadow: 0 6rpx 16rpx rgba(180,140,60,0.25);
}
.feature-item__name {
  font-size: 26rpx;
  color: #333;
  margin-top: 14rpx;
  font-weight: 600;
  text-align: center;
}

/* 分类卡片区 */
.category-section {
  padding: 0 20rpx;
  margin-top: 30rpx;
}
.category-section__title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a365d;
  display: block;
  margin-bottom: 20rpx;
}
.category-cards {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding-bottom: 10rpx;
}
.category-card {
  flex-shrink: 0;
  width: 220rpx;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  border: 2rpx solid #E8C872;
  box-shadow: 0 4rpx 12rpx rgba(180,140,60,0.15);
}
.category-card__img {
  width: 100%;
  height: 140rpx;
}
.category-card__info {
  padding: 16rpx;
}
.category-card__name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.category-card__desc {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-top: 6rpx;
}

/* 限时活动 */
.activity {
  display: flex;
  align-items: center;
  margin: 30rpx 20rpx;
  padding: 28rpx;
  background: #fff;
  border-radius: 18rpx;
  border: 4rpx solid #D4AF37;
  box-shadow: 0 4rpx 16rpx rgba(180,140,60,0.15);
}
.activity__body {
  flex: 1;
}
.activity__title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #1a365d;
}
.activity__desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
}
.activity__countdown {
  display: flex;
  align-items: center;
  margin-top: 14rpx;
}
.activity__countdown-label {
  font-size: 26rpx;
  color: #999;
  margin-right: 8rpx;
}
.activity__countdown-time {
  font-size: 30rpx;
  color: #DC2626;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 2rpx;
}
.activity__btn {
  padding: 18rpx 28rpx;
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
  color: #fff;
  font-size: 28rpx;
  border-radius: 18rpx;
  flex-shrink: 0;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(220, 38, 38, 0.3);
}

/* 区块通用 */
.section {
  padding: 0 20rpx;
  margin-top: 30rpx;
}
.section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.section__title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1a365d;
  letter-spacing: 1rpx;
}
.section__more {
  font-size: 26rpx;
  color: #999;
}

/* 热卖榜 */
.hots {
  display: flex;
  gap: 16rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 3rpx solid #D4AF37;
  padding: 20rpx 10rpx 10rpx;
}
.hot-item {
  flex: 1;
  position: relative;
  border: 2rpx solid #E8C872;
  border-radius: 12rpx;
  padding: 8rpx;
  background: #fffaf5;
}
.hot-item__rank {
  position: absolute;
  top: 0;
  left: 0;
  width: 40rpx;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  color: #fff;
  border-radius: 10rpx 0 10rpx 0;
  z-index: 1;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}
.hot-item__rank--1 { background: linear-gradient(135deg, #e54d42 0%, #c73e30 100%); }
.hot-item__rank--2 { background: linear-gradient(135deg, #ff9500 0%, #e08500 100%); }
.hot-item__rank--3 { background: linear-gradient(135deg, #8b6914 0%, #6d530f 100%); }
.hot-item__img {
  width: 100%;
  height: 220rpx;
  border-radius: 16rpx;
  background: linear-gradient(135deg, #f0e6c8 0%, #e8dcc0 100%);
}
.hot-item__name {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-top: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

/* 推荐产品横向滚动 */
.recommend-scroll {
  display: flex;
  gap: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 3rpx solid #D4AF37;
  padding: 20rpx;
  white-space: nowrap;
}
.recommend-item {
  flex-shrink: 0;
  width: 280rpx;
  display: inline-block;
  vertical-align: top;
  border: 2rpx solid #E8C872;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fffaf5;
}
.recommend-item__img {
  width: 100%;
  height: 160rpx;
}
.recommend-item__info {
  padding: 16rpx;
}
.recommend-item__title {
  display: block;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recommend-item__price {
  display: block;
  font-size: 30rpx;
  color: #DC2626;
  font-weight: 700;
  margin-top: 8rpx;
}

/* 非遗好物列表 */
.goods {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 10rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 3rpx solid #D4AF37;
}
.goods :deep(.wd-goods-card) {
  border: 2rpx solid #E8C872;
  border-radius: 12rpx;
  overflow: hidden;
}
</style>

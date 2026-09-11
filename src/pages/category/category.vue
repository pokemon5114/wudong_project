<template>
  <view class="category">
    <view class="category__body">
      <!-- 左侧分类栏 -->
      <scroll-view class="side" scroll-y>
        <view
          v-for="c in categories"
          :key="c.id"
          :class="['side__item', c.id === activeId ? 'side__item--active' : '']"
          @click="selectCategory(c)"
        >
          {{ c.name }}
        </view>
      </scroll-view>

      <!-- 右侧商品列表 -->
      <scroll-view class="main" scroll-y>
        <wd-loading v-if="loading" />
        <wd-empty v-else-if="!goodsList.length" text="该分类下暂无商品" />
        <view v-else class="goods">
          <view v-for="g in goodsList" :key="g.id" class="goods-card" @click="goDetail(g)">
            <image class="goods-card__img" :src="g.coverImage || g.mainImage || ''" mode="aspectFill" lazy-load />
            <view class="goods-card__info">
              <text class="goods-card__name">{{ g.name }}</text>
              <text class="goods-card__desc">{{ g.description }}</text>
              <view class="goods-card__bottom">
                <text class="goods-card__price">¥{{ (g.price / 100).toFixed(2) }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as goodsApi from '@/api/modules/goods';
import type { GoodsCategory, Goods } from '@/api/types';

const categories = ref<GoodsCategory[]>([]);
const activeId = ref(0);
const loading = ref(true);
const goodsList = ref<Goods[]>([]);

function selectCategory(c: GoodsCategory) {
  activeId.value = c.id;
  loadGoods(c.id);
}

function goDetail(g: Goods) {
  uni.navigateTo({ url: `/pages/goods/detail?id=${g.id}` });
}

async function loadGoods(categoryId: number) {
  loading.value = true;
  try {
    const res = await goodsApi.list({ categoryId, page: 1, size: 50 });
    goodsList.value = res.list || [];
  } finally {
    loading.value = false;
  }
}

onLoad(async () => {
  try {
    categories.value = await goodsApi.categoryTree();
    if (categories.value.length) {
      activeId.value = categories.value[0].id;
      loadGoods(activeId.value);
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.category {
  min-height: 100vh;
  background: #fff;
}

.category__body {
  display: flex;
  height: calc(100vh - 96rpx);
}

/* 左侧分类栏 */
.side {
  width: 180rpx;
  background: #fff;
  border-right: 2rpx solid #f0e6c8;
}
.side__item {
  padding: 34rpx 20rpx;
  font-size: 26rpx;
  color: #333;
  text-align: center;
  border-bottom: 1rpx solid #f5f0e6;
}
.side__item--active {
  background: #fef9e7;
  color: #D4AF37;
  font-weight: 700;
  border-left: 6rpx solid #D4AF37;
}

/* 右侧商品列表 */
.main {
  flex: 1;
  background: #fafafa;
}
.goods {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 20rpx;
}
.goods-card {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  border: 2rpx solid #D4AF37;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(180,140,60,0.1);
}
.goods-card__img {
  width: 100%;
  height: 280rpx;
}
.goods-card__info {
  padding: 16rpx;
}
.goods-card__name {
  font-size: 28rpx;
  color: #333;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
.goods-card__desc {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods-card__bottom {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
}
.goods-card__price {
  font-size: 32rpx;
  color: #DC2626;
  font-weight: 700;
}
</style>

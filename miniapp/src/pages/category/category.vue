<template>
  <view class="category">
    <scroll-view class="side" scroll-y>
      <view
        v-for="c in categories"
        :key="c.id"
        :class="['side__item', c.id === activeId ? 'side__item--active' : '']"
        @click="activeId = c.id"
      >
        {{ c.name }}
      </view>
    </scroll-view>

    <scroll-view class="main" scroll-y>
      <wd-loading v-if="loading" />
      <wd-empty v-else-if="!children.length" text="该分类下暂无子分类" />
      <view v-else class="main__list">
        <view v-for="c in children" :key="c.id" class="main__item" @click="goList(c)">
          <text class="main__name">{{ c.name }}</text>
          <text class="main__arrow">›</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as goodsApi from '@/api/modules/goods';
import type { GoodsCategory } from '@/api/types';

const categories = ref<GoodsCategory[]>([]);
const activeId = ref(0);
const loading = ref(true);

const children = computed(
  () => categories.value.find((c) => c.id === activeId.value)?.children ?? [],
);

function goList(c: GoodsCategory) {
  uni.navigateTo({
    url: `/pages/goods/list?categoryId=${c.id}&name=${encodeURIComponent(c.name)}`,
  });
}

onLoad(async () => {
  try {
    categories.value = await goodsApi.categoryTree();
    activeId.value = categories.value[0]?.id ?? 0;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.category {
  display: flex;
  height: 100vh;
}
.side {
  width: 200rpx;
  background: #f7f7f7;
}
.side__item {
  padding: 34rpx 20rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
}
.side__item--active {
  background: #fff;
  color: #e54d42;
  font-weight: 600;
}
.main {
  flex: 1;
  background: #fff;
}
.main__list {
  padding: 20rpx;
}
.main__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.main__name {
  font-size: 28rpx;
  color: #333;
}
.main__arrow {
  font-size: 32rpx;
  color: #ccc;
}
</style>

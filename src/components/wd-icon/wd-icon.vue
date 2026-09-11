<template>
  <view :class="['wd-icon', `wd-icon--${name}`]" :style="{ color, fontSize: size + 'rpx' }"></view>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  size?: number;
  color?: string;
}>();
</script>

<style scoped>
/* 基础样式 */
.wd-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  position: relative;
  font-size: inherit;
}

/* 🔍 搜索 */
.wd-icon--search::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  top: 15%;
  left: 15%;
  box-sizing: border-box;
}
.wd-icon--search::after {
  content: '';
  position: absolute;
  width: 35%;
  height: 3rpx;
  background: currentColor;
  transform: rotate(45deg);
  bottom: 15%;
  right: 15%;
  border-radius: 2rpx;
}

/* 🧣 衣（T恤） */
.wd-icon--clothes::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 70%;
  top: 30%;
  border: 3rpx solid currentColor;
  border-radius: 0 0 20% 20%;
  box-sizing: border-box;
}
.wd-icon--clothes::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 35%;
  top: 0;
  left: 35%;
  border: 3rpx solid currentColor;
  border-bottom: none;
  border-radius: 50% 50% 0 0;
  box-sizing: border-box;
}

/* 🍲 食（碗） */
.wd-icon--food::before {
  content: '';
  position: absolute;
  width: 80%;
  height: 50%;
  bottom: 10%;
  left: 10%;
  border: 3rpx solid currentColor;
  border-radius: 0 0 50% 50%;
  box-sizing: border-box;
}
.wd-icon--food::after {
  content: '';
  position: absolute;
  width: 60%;
  height: 30%;
  top: 20%;
  left: 20%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}

/* 🏡 住（房子） */
.wd-icon--home::before {
  content: '';
  position: absolute;
  width: 70%;
  height: 45%;
  bottom: 10%;
  left: 15%;
  border: 3rpx solid currentColor;
  border-radius: 4rpx;
  box-sizing: border-box;
}
.wd-icon--home::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 50% solid transparent;
  border-right: 50% solid transparent;
  border-bottom: 45% solid currentColor;
  top: 0;
  left: 0;
}

/* 🎫 行（票） */
.wd-icon--ticket::before {
  content: '';
  position: absolute;
  width: 90%;
  height: 55%;
  top: 22%;
  left: 5%;
  border: 3rpx solid currentColor;
  border-radius: 6rpx;
  box-sizing: border-box;
}
.wd-icon--ticket::after {
  content: '';
  position: absolute;
  width: 8%;
  height: 8%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  box-shadow: 190% 0 0 currentColor;
}

/* 📷 社（相机） */
.wd-icon--community::before {
  content: '';
  position: absolute;
  width: 75%;
  height: 55%;
  top: 30%;
  left: 12.5%;
  border: 3rpx solid currentColor;
  border-radius: 10rpx;
  box-sizing: border-box;
}
.wd-icon--community::after {
  content: '';
  position: absolute;
  width: 35%;
  height: 35%;
  top: 37.5%;
  left: 32.5%;
  border: 3rpx solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}

/* ❤ 收藏 */
.wd-icon--heart::before {
  content: '';
  position: absolute;
  width: 90%;
  height: 80%;
  top: 10%;
  left: 5%;
  background: currentColor;
  clip-path: path('M50% 85%, 10% 45%, 10% 25%, 25% 10%, 50% 30%, 75% 10%, 90% 25%, 90% 45%, 50% 85%');
}

/* 📍 地址（定位） */
.wd-icon--location::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  top: 5%;
  left: 20%;
  border: 3rpx solid currentColor;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-sizing: border-box;
}
.wd-icon--location::after {
  content: '';
  position: absolute;
  width: 25%;
  height: 25%;
  top: 25%;
  left: 37.5%;
  background: currentColor;
  border-radius: 50%;
}

/* ✉️ 消息 */
.wd-icon--message::before {
  content: '';
  position: absolute;
  width: 80%;
  height: 55%;
  top: 22%;
  left: 10%;
  border: 3rpx solid currentColor;
  border-radius: 6rpx;
  box-sizing: border-box;
}
.wd-icon--message::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-left: 40% solid transparent;
  border-right: 40% solid transparent;
  border-top: 35% solid currentColor;
  bottom: 0;
  left: 0;
}

/* ⭐ 星星 */
.wd-icon--star::before {
  content: '';
  position: absolute;
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  background: currentColor;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

/* ★ 单色星星（白名单） */
.wd-icon--star-fill::before {
  content: '★';
  font-size: 1.2em;
  color: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

<template>
  <view class="profile">
    <view class="card">
      <view class="row row--avatar" @click="chooseAvatar">
        <text class="row__label">头像</text>
        <view class="row__right">
          <image class="avatar" :src="fileUrl(form.avatar) || defaultAvatar" mode="aspectFill" />
          <text class="row__arrow">›</text>
        </view>
      </view>

      <view class="row">
        <text class="row__label">昵称</text>
        <input v-model="form.nickname" class="row__input" maxlength="20" placeholder="请输入昵称" />
      </view>

      <view class="row">
        <text class="row__label">性别</text>
        <picker :range="genderLabels" :value="form.gender" @change="changeGender">
          <view class="row__right">
            <text class="row__value">{{ genderLabels[form.gender] }}</text>
            <text class="row__arrow">›</text>
          </view>
        </picker>
      </view>

      <view class="row">
        <text class="row__label">地区</text>
        <input v-model="form.region" class="row__input" maxlength="30" placeholder="如：贵州黔东南" />
      </view>
    </view>

    <view class="card">
      <text class="card__title">个人简介</text>
      <textarea
        v-model="form.bio"
        class="bio"
        maxlength="100"
        placeholder="介绍一下自己…"
        :show-confirm-bar="false"
      />
      <text class="bio__count">{{ form.bio.length }}/100</text>
    </view>

    <view class="footer">
      <view :class="['footer__btn', saving ? 'footer__btn--disabled' : '']" @click="onSave">
        {{ saving ? '保存中…' : '保存' }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as authApi from '@/api/modules/auth';
import * as uploadApi from '@/api/modules/upload';
import { useUserStore } from '@/store/user';
import { requireLogin } from '@/utils/guard';
import { fileUrl } from '@/utils/url';

const DEFAULT_AVATAR =
  'https://images.pexels.com/photos/7400017/pexels-photo-7400017.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop';

const user = useUserStore();
const defaultAvatar = DEFAULT_AVATAR;
const saving = ref(false);

const genderLabels = ['保密', '男', '女'];

// 后端 PUT /api/auth/profile 只接受 nickname / avatar / gender / region / bio
const form = reactive({
  nickname: '',
  avatar: '',
  gender: 0,
  region: '',
  bio: '',
});

function fillFromStore() {
  const p = user.profile;
  form.nickname = p?.nickname || '';
  form.avatar = p?.avatar || '';
  form.gender = p?.gender ?? 0;
  form.region = p?.region || '';
  form.bio = p?.bio || '';
}

function changeGender(e: any) {
  form.gender = Number(e.detail.value);
}

function chooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    success: async (res) => {
      const path = res.tempFilePaths?.[0];
      if (!path) return;
      uni.showLoading({ title: '上传中' });
      try {
        const uploaded = await uploadApi.uploadImage(path);
        form.avatar = uploaded.url;
      } catch {
        // 上传函数内部已提示
      } finally {
        uni.hideLoading();
      }
    },
  });
}

async function onSave() {
  if (!form.nickname.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' });
    return;
  }
  if (saving.value) return;
  saving.value = true;
  try {
    await authApi.updateProfile({
      nickname: form.nickname.trim(),
      avatar: form.avatar,
      gender: form.gender as 0 | 1 | 2,
      region: form.region.trim(),
      bio: form.bio.trim(),
    });
    // 资料接口只返回 null，改完重新拉一次，保证 mine 页显示的是服务端真值
    await user.loadProfile();
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => uni.navigateBack(), 700);
  } catch {
    // 请求层已统一提示
  } finally {
    saving.value = false;
  }
}

onLoad(async () => {
  if (!requireLogin()) return;
  fillFromStore();
  // 登录时只带了 id/nickname/avatar，gender/region/bio 要单独拉
  try {
    await user.loadProfile();
    fillFromStore();
  } catch {
    // 拉取失败就先用本地已有的资料
  }
});
</script>

<style scoped>
.profile {
  min-height: 100vh;
  background: var(--wd-bg-page);
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}
.card {
  background: var(--wd-bg-card);
  border-radius: var(--wd-radius-lg);
  padding: 24rpx;
  overflow: hidden;
  box-shadow: var(--wd-shadow-card);
  margin-bottom: 24rpx;
}
.row {
  display: flex;
  align-items: center;
  min-height: 100rpx;
  border-bottom: 1rpx solid var(--wd-divider);
}
.row:last-child {
  border-bottom: none;
}
.row__label {
  width: 140rpx;
  font-size: 28rpx;
  color: var(--wd-text-1);
  flex-shrink: 0;
}
.row__input {
  flex: 1;
  font-size: 28rpx;
  text-align: right;
}
.row__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.row__value {
  font-size: 28rpx;
  color: var(--wd-text-2);
}
.row__arrow {
  font-size: 32rpx;
  color: var(--wd-text-4);
  margin-left: 12rpx;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: var(--wd-divider);
}
.card__title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--wd-text-1);
  padding: 24rpx 0 12rpx;
}
.bio {
  width: 100%;
  height: 180rpx;
  font-size: 28rpx;
  line-height: 1.6;
  padding: 12rpx 0;
}
.bio__count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: var(--wd-text-4);
  padding-bottom: 16rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 16rpx 24rpx calc(16rpx + env(safe-area-inset-bottom));
  background: var(--wd-bg-card);
  box-shadow: var(--wd-shadow-bar);
  box-sizing: border-box;
}
.footer__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  text-align: center;
  padding: 0 44rpx;
  background: var(--wd-brand);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: var(--wd-radius-pill);
  box-sizing: border-box;
}
.footer__btn--disabled {
  opacity: 0.6;
}
</style>

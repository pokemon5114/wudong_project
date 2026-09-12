<template>
  <view class="register">
    <text class="register__title">注册账号</text>
    <text class="register__subtitle">乌东文旅 · 衣食住行一站服务</text>

    <input
      v-model="phone"
      class="register__input"
      type="number"
      maxlength="11"
      placeholder="请输入手机号"
    />

    <view class="register__code">
      <input
        v-model="code"
        class="register__code-input"
        type="number"
        maxlength="6"
        placeholder="请输入验证码"
      />
      <text
        :class="['register__code-btn', canSendCode ? '' : 'register__code-btn--disabled']"
        @click="onSendCode"
      >
        {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
      </text>
    </view>

    <input v-model="password" class="register__input" password placeholder="请设置密码（6-20 位）" />
    <input
      v-model="confirmPassword"
      class="register__input"
      password
      placeholder="请再次输入密码"
    />

    <button class="register__btn" :loading="loading" @click="onRegister">注册</button>
    <text class="register__link" @click="goLogin">已有账号？去登录</text>
    <text class="register__tip">当前短信服务为模拟，验证码任意填写即可</text>
  </view>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import * as authApi from '@/api/modules/auth';
import { loginUrl } from '@/utils/guard';

const phone = ref('');
const code = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const countdown = ref(0);
const redirect = ref('');
let timer: ReturnType<typeof setInterval> | undefined;

onLoad((options) => {
  redirect.value = (options?.redirect as string) || '';
});

const canSendCode = computed(() => countdown.value === 0 && /^1\d{10}$/.test(phone.value));

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  }
}

function startCountdown() {
  countdown.value = 60;
  stopTimer();
  timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) stopTimer();
  }, 1000);
}

async function onSendCode() {
  if (countdown.value > 0) return;
  if (!/^1\d{10}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' });
    return;
  }
  try {
    await authApi.sendSms(phone.value);
    startCountdown();
    uni.showToast({ title: '验证码已发送', icon: 'none' });
  } catch {
    // 请求层已统一提示
  }
}

async function onRegister() {
  // 后端 /api/auth/register 不做任何校验（实测空手机号也能建号），
  // 所以格式校验必须放在前端，否则会往库里写入脏数据。
  if (!/^1\d{10}$/.test(phone.value)) {
    uni.showToast({ title: '请输入正确手机号', icon: 'none' });
    return;
  }
  if (!code.value.trim()) {
    uni.showToast({ title: '请输入验证码', icon: 'none' });
    return;
  }
  if (password.value.length < 6 || password.value.length > 20) {
    uni.showToast({ title: '密码需 6-20 位', icon: 'none' });
    return;
  }
  if (password.value !== confirmPassword.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    await authApi.register({
      phone: phone.value,
      code: code.value.trim(),
      password: password.value,
    });
    uni.showToast({ title: '注册成功', icon: 'success' });
    // 注册接口不返回 token，回到登录页让用户登录
    setTimeout(() => {
      uni.redirectTo({ url: loginUrl(redirect.value) });
    }, 800);
  } catch {
    // 请求层已统一提示（如「手机号已注册」）
  } finally {
    loading.value = false;
  }
}

function goLogin() {
  uni.redirectTo({ url: loginUrl(redirect.value) });
}

onUnmounted(stopTimer);
</script>

<style scoped>
.register {
  padding: 120rpx 60rpx 0;
  display: flex;
  flex-direction: column;
}
.register__title {
  font-size: 48rpx;
  font-weight: 600;
  color: var(--wd-brand);
  text-align: center;
}
.register__subtitle {
  font-size: 26rpx;
  color: var(--wd-text-3);
  text-align: center;
  margin-top: 12rpx;
  margin-bottom: 60rpx;
}
.register__input {
  height: 92rpx;
  border-bottom: 1rpx solid var(--wd-divider);
  font-size: 32rpx;
  margin-bottom: 20rpx;
}
.register__code {
  display: flex;
  align-items: center;
  height: 92rpx;
  border-bottom: 1rpx solid var(--wd-divider);
  margin-bottom: 20rpx;
}
.register__code-input {
  flex: 1;
  height: 92rpx;
  font-size: 32rpx;
}
.register__code-btn {
  flex-shrink: 0;
  font-size: 26rpx;
  color: var(--wd-brand);
  padding-left: 20rpx;
}
.register__code-btn--disabled {
  color: var(--wd-text-4);
}
.register__btn {
  margin-top: 60rpx;
  background: var(--wd-brand);
  color: #fff;
  border-radius: 46rpx;
  font-size: 32rpx;
}
.register__link {
  margin-top: 30rpx;
  font-size: 26rpx;
  color: var(--wd-brand);
  text-align: center;
}
.register__tip {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: var(--wd-text-4);
  text-align: center;
}
</style>

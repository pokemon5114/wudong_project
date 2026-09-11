<template>
  <div class="login-page">
    <div class="login-shell">
      <header class="login-topline">
        <router-link to="/" class="back-home" aria-label="返回首页">
          <span class="back-mark" aria-hidden="true">↖</span>
          <span>回到旅程</span>
        </router-link>
        <span class="topline-index">乌东 · 旅程手记</span>
      </header>

      <main class="login-layout" :class="{ 'is-registering': activeTab === 'register' }">
        <section class="journey-panel" aria-label="乌东旅程主题">
          <div class="journey-copy">
            <p class="eyebrow">WUDONG / TRAVEL NOTES</p>
            <h1>把一段山路，<br />留在自己的旅程里。</h1>
            <p class="journey-intro">收藏走过的村寨、尝过的风味，也记住每一次与乌东相遇的时刻。</p>
          </div>
          <div class="doodle-wrap">
            <img class="journey-doodle" src="/wudong-login-doodle.png" alt="" aria-hidden="true" />
            <span class="doodle-caption">01 / 山路 · 村寨 · 织纹</span>
          </div>
          <div class="journey-footnote">
            <span class="footnote-rule"></span>
            <span>从这里，继续你的乌东故事</span>
          </div>
        </section>

        <section class="login-card" :class="{ 'is-registering': activeTab === 'register' }">
          <div class="login-header">
            <p class="form-kicker">YOUR JOURNEY, YOUR NOTES</p>
            <h2>{{ activeTab === 'login' ? '欢迎回来' : '加入这段旅程' }}</h2>
            <p class="form-lede">
              {{ activeTab === 'login' ? '从上次停下的地方，继续探索乌东。' : '留下一个名字，和乌东再见面。' }}
            </p>
          </div>

          <div class="login-tabs" role="tablist" aria-label="账户操作">
            <button type="button" class="tab-item" :class="{ active: activeTab === 'login' }" role="tab" :aria-selected="activeTab === 'login'" @click="activeTab = 'login'">登录</button>
            <button type="button" class="tab-item" :class="{ active: activeTab === 'register' }" role="tab" :aria-selected="activeTab === 'register'" @click="activeTab = 'register'">注册</button>
            <span class="tab-indicator" :style="{ transform: `translateX(${activeTab === 'login' ? '0' : '100%'})` }" aria-hidden="true"></span>
          </div>

          <el-form ref="formRef" :model="form" :rules="rules" class="login-form" @submit.prevent="handleSubmit">
            <el-form-item prop="phone">
              <label class="field-label" for="login-phone">手机号</label>
              <el-input id="login-phone" v-model="form.phone" placeholder="请输入 11 位手机号" size="large" maxlength="11" @input="form.phone = sanitizePhone($event)" />
            </el-form-item>

            <el-form-item prop="password">
              <label class="field-label" for="login-password">密码</label>
              <el-input id="login-password" v-model="form.password" type="password" placeholder="请输入密码" size="large" show-password />
            </el-form-item>

            <el-form-item prop="nickname" v-if="activeTab === 'register'" class="nickname-field">
              <label class="field-label" for="login-nickname">旅人称呼 <span>可选</span></label>
              <el-input id="login-nickname" v-model="form.nickname" placeholder="给自己留一个昵称" size="large" />
            </el-form-item>

            <el-button native-type="submit" type="primary" size="large" :loading="loading" class="submit-btn">
              {{ activeTab === 'login' ? '进入我的旅程' : '创建旅程档案' }}
              <span class="submit-arrow" aria-hidden="true">↗</span>
            </el-button>
          </el-form>

          <div class="login-footer">
            <p class="test-account"><span class="account-dot" aria-hidden="true"></span>体验账号 13800138001 <span>/</span> 123456</p>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { PHONE_RE, sanitizePhone } from '@/utils/validate'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('login')
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  phone: '',
  password: '',
  nickname: '',
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: PHONE_RE, message: '请输入 11 位有效手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  loading.value = true

  try {
    let success = false

    if (activeTab.value === 'login') {
      success = await userStore.loginAction(form.phone, form.password)
    } else {
      success = await userStore.registerAction(form.phone, form.password, form.nickname)
    }

    if (success) {
      ElMessage.success(activeTab.value === 'login' ? '登录成功' : '注册成功')
      router.push('/')
    } else {
      ElMessage.error(activeTab.value === 'login' ? '登录失败' : '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '请求失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page { min-height:100vh; overflow:hidden; color:#13243d; background:#f5f2ea; }
.login-shell { position:relative; display:flex; min-height:100vh; flex-direction:column; padding:clamp(22px,3.2vw,48px) clamp(24px,5vw,88px) clamp(30px,4vw,58px); }
.login-topline { display:flex; align-items:center; justify-content:space-between; color:#657286; font-size:13px; letter-spacing:.08em; }
.back-home { display:inline-flex; align-items:center; gap:10px; color:#183653; font-weight:700; transition:color .2s ease,transform .2s ease; }.back-home:hover { color:#b88722; transform:translateX(-3px); }.back-mark { font-size:22px; line-height:1; }
.topline-index { color:#b88722; font-size:11px; font-weight:800; letter-spacing:.18em; }
.login-layout { display:grid; grid-template-columns:minmax(0,1fr) minmax(380px,470px); gap:clamp(54px,9vw,160px); width:min(1320px,100%); flex:1; align-items:center; margin:0 auto; padding-block:clamp(38px,6vh,92px); }
.journey-panel { position:relative; display:flex; min-height:550px; flex-direction:column; justify-content:center; padding:clamp(12px,2vw,26px) 0; }
.journey-copy { position:relative; z-index:1; max-width:580px; }.eyebrow,.form-kicker { margin:0; color:#b88722; font-size:11px; font-weight:800; letter-spacing:.22em; }.journey-copy h1 { margin:20px 0 23px; font-family:'Noto Serif SC',serif; color:#183653; font-size:clamp(42px,5.2vw,76px); font-weight:500; letter-spacing:-.07em; line-height:1.16; }.journey-intro { max-width:430px; margin:0; color:#687587; font-size:16px; line-height:2; }
.doodle-wrap { position:relative; width:min(720px,100%); margin-top:clamp(35px,5vw,72px); transform:translateX(-4%); transition:transform .65s cubic-bezier(.16,.84,.36,1); }.journey-panel:hover .doodle-wrap,.login-layout.is-registering .doodle-wrap { transform:translateX(-1%) translateY(-4px); }.journey-doodle { display:block; width:100%; height:auto; mix-blend-mode:multiply; opacity:.88; filter:saturate(.72) contrast(1.02); }.doodle-caption { position:absolute; right:4%; bottom:-14px; color:#8a7660; font-size:11px; letter-spacing:.12em; }
.journey-footnote { display:flex; align-items:center; gap:12px; margin-top:clamp(34px,4vw,58px); color:#657286; font-size:12px; letter-spacing:.06em; }.footnote-rule { display:block; width:40px; height:1px; background:#c99827; }
.login-card { position:relative; width:100%; padding:clamp(34px,4vw,56px) clamp(28px,4vw,52px); border:1px solid rgba(24,54,83,.16); background:rgba(255,253,248,.72); box-shadow:16px 20px 0 rgba(231,224,210,.72); transition:box-shadow .35s ease,transform .35s ease; }.login-card:hover { transform:translateY(-3px); box-shadow:20px 25px 0 rgba(231,224,210,.82); }
.login-header { margin-bottom:30px; }.login-header h2 { margin:13px 0 9px; font-family:'Noto Serif SC',serif; color:#183653; font-size:clamp(30px,3vw,44px); font-weight:500; letter-spacing:-.06em; }.form-lede { margin:0; color:#687587; font-size:14px; line-height:1.8; }
.login-tabs { position:relative; display:flex; width:100%; margin-bottom:31px; border-bottom:1px solid rgba(24,54,83,.2); }.tab-item { position:relative; z-index:1; width:50%; padding:0 0 13px; border:0; color:#7b8795; background:transparent; font:inherit; font-size:15px; text-align:left; cursor:pointer; transition:color .25s ease,font-weight .25s ease; }.tab-item + .tab-item { text-align:right; }.tab-item.active { color:#183653; font-weight:800; }.tab-indicator { position:absolute; bottom:-1px; left:0; width:50%; height:2px; background:#c99827; transition:transform .35s cubic-bezier(.16,.84,.36,1); }
.login-form :deep(.el-form-item) { margin-bottom:21px; }.field-label { display:flex; align-items:baseline; gap:7px; margin-bottom:8px; color:#183653; font-size:13px; font-weight:700; letter-spacing:.04em; }.field-label span { color:#9aa2ac; font-size:11px; font-weight:500; }.login-form :deep(.el-input__wrapper) { min-height:50px; padding:2px 0; border-radius:0; background:transparent; box-shadow:0 1px 0 rgba(24,54,83,.25); transition:box-shadow .25s ease,background .25s ease; }.login-form :deep(.el-input__wrapper:hover),.login-form :deep(.el-input__wrapper.is-focus) { background:rgba(255,255,255,.45); box-shadow:0 2px 0 #c99827; }.login-form :deep(.el-input__inner) { height:42px; color:#183653; font-size:16px; }.login-form :deep(.el-input__inner::placeholder) { color:#a1a8b0; }
.submit-btn { display:flex; width:100%; height:54px; align-items:center; justify-content:space-between; margin-top:8px; padding:0 20px 0 23px; border:1px solid #183653; border-radius:0; color:#fffdf8; background:#183653; font-size:15px; font-weight:700; letter-spacing:.06em; transition:background .25s ease,transform .25s ease,box-shadow .25s ease; }.submit-btn:hover { border-color:#285678; background:#285678; box-shadow:8px 8px 0 rgba(201,152,39,.26); transform:translate(-2px,-2px); }.submit-arrow { font-size:21px; font-weight:400; }
.login-footer { margin-top:25px; }.test-account { display:flex; align-items:center; gap:8px; margin:0; color:#7c8793; font-size:12px; letter-spacing:.03em; }.test-account span:not(.account-dot) { color:#b1b6bc; }.account-dot { width:6px; height:6px; border-radius:50%; background:#c99827; }
@media (max-width: 900px) { .login-layout { grid-template-columns:1fr; gap:30px; padding-block:48px 20px; }.journey-panel { min-height:auto; padding-top:0; }.journey-copy h1 { font-size:clamp(39px,8vw,62px); }.doodle-wrap { width:min(680px,100%); margin-top:28px; transform:none; }.login-card { max-width:520px; margin:0 auto; }.journey-footnote { display:none; } }
@media (max-width: 520px) { .login-shell { padding-inline:20px; }.login-topline { font-size:12px; }.topline-index { display:none; }.login-layout { padding-top:38px; }.journey-copy h1 { margin-top:15px; font-size:clamp(37px,11vw,52px); }.journey-intro { font-size:14px; }.doodle-wrap { margin-top:26px; }.doodle-caption { bottom:-10px; font-size:9px; }.login-card { padding:30px 24px 32px; box-shadow:9px 12px 0 rgba(231,224,210,.78); }.login-header h2 { font-size:32px; } }
@media (prefers-reduced-motion: reduce) { .login-card,.doodle-wrap,.back-home,.submit-btn { transition:none; } }
</style>

<template>
  <div class="user-page">
    <!-- Hero Section -->
    <div class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>个人中心</h1>
        <p>管理您的个人信息和收藏</p>
      </div>
    </div>

    <div class="container">
      <div class="user-layout">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <div class="user-card">
            <div class="avatar-wrapper">
              <el-avatar :size="80" class="user-avatar">{{ userStore.user?.nickname?.slice(0, 1) || '游' }}</el-avatar>
            </div>
            <h3 class="user-name">{{ userStore.user?.nickname || '游客' }}</h3>
            <p class="user-phone">{{ formatPhone(userStore.user?.phone) }}</p>
          </div>
          <nav class="user-nav">
            <a class="nav-item" :class="{ active: activeMenu === 'info' }" @click="activeMenu = 'info'">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </a>
            <a class="nav-item" :class="{ active: activeMenu === 'password' }" @click="activeMenu = 'password'">
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </a>
            <a class="nav-item" :class="{ active: activeMenu === 'favorites' }" @click="activeMenu = 'favorites'">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </a>
            <a class="nav-item logout" @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              <span>退出登录</span>
            </a>
          </nav>
        </aside>

        <!-- 主内容 -->
        <main class="user-main card">
          <!-- 个人信息 -->
          <div v-show="activeMenu === 'info'" class="info-section">
            <h2 class="section-title">个人信息</h2>
            <el-form :model="infoForm" label-width="100px" class="info-form">
              <el-form-item label="头像">
                <div class="avatar-upload">
                  <el-avatar :size="80" class="preview-avatar">{{ userStore.user?.nickname?.slice(0, 1) || '游' }}</el-avatar>
                  <el-button size="small" class="upload-btn">更换头像</el-button>
                </div>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="infoForm.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="性别">
                <el-radio-group v-model="infoForm.gender">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                  <el-radio label="secret">保密</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="生日">
                <el-date-picker v-model="infoForm.birthday" type="date" placeholder="选择生日" style="width: 100%" />
              </el-form-item>
              <el-form-item label="个人简介">
                <el-input v-model="infoForm.bio" type="textarea" :rows="4" placeholder="介绍一下自己..." />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleUpdateInfo" class="save-btn">保存修改</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 修改密码 -->
          <div v-show="activeMenu === 'password'" class="password-section">
            <h2 class="section-title">修改密码</h2>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px" class="password-form">
              <el-form-item label="当前密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleChangePassword" class="save-btn">修改密码</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 我的收藏 -->
          <div v-show="activeMenu === 'favorites'" class="favorites-section">
            <h2 class="section-title">我的收藏</h2>
            <el-tabs v-model="favoriteTab" class="favorite-tabs">
              <el-tab-pane label="商品" name="products">
                <div class="favorite-list" v-if="favoriteProducts.length > 0">
                  <div v-for="item in favoriteProducts" :key="item.id" class="favorite-item">
                    <el-image :src="item.coverImage || '/placeholder.svg'" fit="cover" class="item-image" />
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p class="item-price">¥{{ (item.price / 100).toFixed(2) }}</p>
                    </div>
                    <el-button size="small" @click="removeFavorite(item.id, 'product')" class="remove-btn">取消收藏</el-button>
                  </div>
                </div>
                <el-empty v-else description="暂无收藏的商品" />
              </el-tab-pane>
              <el-tab-pane label="民宿" name="hotels">
                <div class="favorite-list" v-if="favoriteHotels.length > 0">
                  <div v-for="item in favoriteHotels" :key="item.id" class="favorite-item">
                    <el-image :src="item.coverImage || '/placeholder.svg'" fit="cover" class="item-image" />
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p class="item-price">¥{{ (item.minPrice / 100).toFixed(0) }}起/晚</p>
                    </div>
                    <el-button size="small" @click="removeFavorite(item.id, 'hotel')" class="remove-btn">取消收藏</el-button>
                  </div>
                </div>
                <el-empty v-else description="暂无收藏的民宿" />
              </el-tab-pane>
              <el-tab-pane label="餐厅" name="restaurants">
                <div class="favorite-list" v-if="favoriteRestaurants.length > 0">
                  <div v-for="item in favoriteRestaurants" :key="item.id" class="favorite-item">
                    <el-image :src="item.coverImage || '/placeholder.svg'" fit="cover" class="item-image" />
                    <div class="item-info">
                      <h4>{{ item.name }}</h4>
                      <p class="item-price">人均 ¥{{ (item.avgPrice / 100).toFixed(0) }}</p>
                    </div>
                    <el-button size="small" @click="removeFavorite(item.id, 'restaurant')" class="remove-btn">取消收藏</el-button>
                  </div>
                </div>
                <el-empty v-else description="暂无收藏的餐厅" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Star, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const activeMenu = ref('info')
const favoriteTab = ref('products')

const infoForm = reactive({
  nickname: '',
  phone: '',
  gender: 'secret',
  birthday: '',
  bio: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordFormRef = ref(null)

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 收藏数据
const favoriteProducts = ref([])
const favoriteHotels = ref([])
const favoriteRestaurants = ref([])

const formatPhone = (phone) => {
  if (!phone) return '未绑定手机'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const handleUpdateInfo = () => {
  ElMessage.success('个人信息已更新')
}

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (e) {
    // 验证失败
  }
}

const removeFavorite = (id, type) => {
  ElMessage.success('已取消收藏')
  if (type === 'product') {
    favoriteProducts.value = favoriteProducts.value.filter(item => item.id !== id)
  } else if (type === 'hotel') {
    favoriteHotels.value = favoriteHotels.value.filter(item => item.id !== id)
  } else {
    favoriteRestaurants.value = favoriteRestaurants.value.filter(item => item.id !== id)
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  ElMessage.success('已退出登录')
}

onMounted(() => {
  if (userStore.user) {
    infoForm.nickname = userStore.user.nickname || ''
    infoForm.phone = userStore.user.phone || ''
    infoForm.gender = userStore.user.gender || 'secret'
  }
})
</script>

<style scoped lang="scss">
.user-page {
  background: linear-gradient(180deg, #f8f4ef 0%, #faf8f5 100%);
  min-height: 100vh;
  padding-bottom: 60px;
}

.page-hero {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #1a365d 0%, #6b21a8 50%, #1a365d 100%);
  background-image: url('https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=1920'),
                    linear-gradient(135deg, rgba(26, 54, 93, 0.9) 0%, rgba(107, 33, 168, 0.85) 50%, rgba(26, 54, 93, 0.9) 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(26, 54, 93, 0.8) 0%, rgba(107, 33, 168, 0.7) 100%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;

    h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-layout {
  display: flex;
  gap: 30px;
  margin-top: -50px;
  position: relative;
  z-index: 10;
}

.user-sidebar {
  width: 260px;
  flex-shrink: 0;

  .user-card {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 32px 24px;
    border-radius: 16px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 8px 32px rgba(26, 54, 93, 0.2);

    .avatar-wrapper {
      margin-bottom: 16px;

      .user-avatar {
        width: 80px;
        height: 80px;
        font-size: 32px;
        background: rgba(255, 255, 255, 0.2);
        border: 3px solid rgba(255, 255, 255, 0.3);
      }
    }

    .user-name {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .user-phone {
      font-size: 13px;
      opacity: 0.8;
    }
  }

  .user-nav {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(26, 54, 93, 0.08);

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      color: var(--text-color);
      cursor: pointer;
      transition: all 0.3s;
      border-left: 3px solid transparent;

      .el-icon {
        font-size: 20px;
        color: var(--text-light);
        transition: color 0.3s;
      }

      span {
        font-size: 15px;
      }

      &:hover {
        background: var(--bg-light);
      }

      &.active {
        background: rgba(26, 54, 93, 0.05);
        color: var(--primary-color);
        border-left-color: var(--primary-color);

        .el-icon {
          color: var(--primary-color);
        }
      }

      &.logout {
        color: var(--chinese-red);
        border-top: 1px solid var(--border-color);

        .el-icon {
          color: var(--chinese-red);
        }

        &:hover {
          background: rgba(153, 27, 27, 0.05);
        }
      }
    }
  }
}

.user-main {
  flex: 1;
  padding: 32px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--border-color);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, var(--accent-color), transparent);
    }
  }
}

.info-form {
  max-width: 560px;

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    border-radius: 10px;
  }

  .avatar-upload {
    display: flex;
    align-items: center;
    gap: 20px;

    .preview-avatar {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    }

    .upload-btn {
      border-radius: 20px;
    }
  }

  .save-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: none;
    border-radius: 20px;
    padding: 10px 32px;
  }
}

.password-form {
  max-width: 480px;

  :deep(.el-input__wrapper) {
    border-radius: 10px;
  }
}

.favorite-tabs {
  :deep(.el-tabs__item) {
    font-size: 15px;

    &.is-active {
      color: var(--primary-color);
    }
  }

  :deep(.el-tabs__active-bar) {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-light);
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: var(--bg-color);
    box-shadow: 0 4px 16px rgba(26, 54, 93, 0.1);
  }

  .item-image {
    width: 100px;
    height: 75px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;

    h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--text-color);
    }

    .item-price {
      color: var(--chinese-red);
      font-weight: 600;
    }
  }

  .remove-btn {
    border-radius: 20px;
    color: var(--text-light);

    &:hover {
      color: var(--chinese-red);
      border-color: var(--chinese-red);
    }
  }
}

@media (max-width: 768px) {
  .user-layout {
    flex-direction: column;
    margin-top: 0;
  }

  .user-sidebar {
    width: 100%;

    .user-card {
      padding: 24px;
    }
  }

  .user-main {
    padding: 20px;
  }
}
</style>

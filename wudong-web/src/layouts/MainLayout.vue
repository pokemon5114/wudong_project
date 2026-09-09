<template>
  <div class="main-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content container">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <img src="https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop" alt="logo" />
          </div>
          <div class="logo-text">
            <span class="logo-title">乌东文旅</span>
            <span class="logo-subtitle">WUDONG CULTURE</span>
          </div>
        </router-link>

        <nav class="nav">
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
          </router-link>
          <router-link to="/products" class="nav-item" :class="{ active: $route.path.startsWith('/products') }">
            <span class="nav-icon">👘</span>
            <span class="nav-text">非遗商品</span>
          </router-link>
          <router-link to="/restaurants" class="nav-item" :class="{ active: $route.path.startsWith('/restaurants') }">
            <span class="nav-icon">🍲</span>
            <span class="nav-text">餐饮美食</span>
          </router-link>
          <router-link to="/hotels" class="nav-item" :class="{ active: $route.path.startsWith('/hotels') }">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">住宿预订</span>
          </router-link>
          <router-link to="/tickets" class="nav-item" :class="{ active: $route.path.startsWith('/tickets') }">
            <span class="nav-icon">🎫</span>
            <span class="nav-text">线路订票</span>
          </router-link>
          <router-link to="/community" class="nav-item" :class="{ active: $route.path.startsWith('/community') }">
            <span class="nav-icon">📷</span>
            <span class="nav-text">社区</span>
          </router-link>
        </nav>

        <div class="header-actions">
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索非遗好物..."
              size="default"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <template v-if="userStore.isLoggedIn">
            <el-badge :value="3" class="header-badge">
              <el-button circle>
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
            <el-dropdown trigger="click" class="user-dropdown">
              <span class="user-info">
                <el-avatar :size="36" :src="userStore.user?.avatar">
                  {{ userStore.user?.nickname?.slice(0, 1) || '游' }}
                </el-avatar>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <div class="dropdown-user-info">
                    <el-avatar :size="48">{{ userStore.user?.nickname?.slice(0, 1) || '游' }}</el-avatar>
                    <div class="dropdown-user-detail">
                      <span class="dropdown-username">{{ userStore.user?.nickname || '游客' }}</span>
                      <span class="dropdown-userphone">{{ userStore.user?.phone || '' }}</span>
                    </div>
                  </div>
                  <el-dropdown-item divided @click="$router.push('/user')">
                    <el-icon><User /></el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/orders')">
                    <el-icon><List /></el-icon> 我的订单
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/cart')">
                    <el-icon><ShoppingCart /></el-icon> 购物车
                  </el-dropdown-item>
                  <el-dropdown-item @click="$router.push('/admin')" v-if="userStore.user?.role === 'admin'">
                    <el-icon><Setting /></el-icon> 管理后台
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" @click="$router.push('/login')" class="login-btn">
              <el-icon><User /></el-icon>
              登录 / 注册
            </el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 苗族风格装饰条 -->
    <div class="miao-decoration">
      <div class="decoration-line"></div>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-main">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="brand-logo">
                <img src="https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop" alt="乌东文旅" />
              </div>
              <h3>乌东文旅</h3>
              <p>传承千年苗寨文化<br/>体验独特民族风情</p>
              <div class="social-links">
                <a href="#" class="social-link">
                  <el-icon><ChatDotRound /></el-icon>
                </a>
                <a href="#" class="social-link">
                  <el-icon><Message /></el-icon>
                </a>
                <a href="#" class="social-link">
                  <el-icon><Share /></el-icon>
                </a>
              </div>
            </div>
            <div class="footer-links">
              <div class="link-group">
                <h4>探索</h4>
                <router-link to="/products">非遗商品</router-link>
                <router-link to="/restaurants">餐饮美食</router-link>
                <router-link to="/hotels">住宿预订</router-link>
                <router-link to="/tickets">线路订票</router-link>
              </div>
              <div class="link-group">
                <h4>关于</h4>
                <a href="#">关于我们</a>
                <a href="#">联系方式</a>
                <a href="#">商家入驻</a>
                <a href="#">人才招聘</a>
              </div>
              <div class="link-group">
                <h4>帮助</h4>
                <a href="#">常见问题</a>
                <a href="#">用户协议</a>
                <a href="#">隐私政策</a>
                <a href="#">退款说明</a>
              </div>
            </div>
            <div class="footer-contact">
              <h4>联系我们</h4>
              <div class="contact-item">
                <el-icon><Phone /></el-icon>
                <span>0855-8234567</span>
              </div>
              <div class="contact-item">
                <el-icon><Message /></el-icon>
                <span>info@wudong.village</span>
              </div>
              <div class="contact-item">
                <el-icon><Location /></el-icon>
                <span>贵州黔东南苗族侗族自治州</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-bottom-content">
            <p>© 2024 乌东文旅平台 版权所有 | 黔ICP备XXXXXXXX号</p>
            <div class="footer-tags">
              <span class="footer-tag">苗族文化</span>
              <span class="footer-tag">非遗传承</span>
              <span class="footer-tag">黔东南旅游</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, Bell, User, List, ShoppingCart, Setting, SwitchButton,
  ChatDotRound, Message, Share, Phone, Location
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const searchKeyword = ref('')

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({ path: '/products', query: { keyword: searchKeyword.value } })
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-gradient);
}

// 顶部导航
.header {
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 16px rgba(26, 54, 93, 0.08);

  .header-content {
    display: flex;
    align-items: center;
    height: 72px;
    gap: 40px;
  }
}

// Logo
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;

  .logo-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .logo-text {
    display: flex;
    flex-direction: column;

    .logo-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-color);
      font-family: 'Noto Serif SC', serif;
    }

    .logo-subtitle {
      font-size: 10px;
      color: var(--text-muted);
      letter-spacing: 2px;
    }
  }
}

// 导航
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all var(--transition-base);
    color: var(--text-color);
    font-size: 15px;

    .nav-icon {
      font-size: 18px;
    }

    &:hover {
      background: rgba(212, 175, 55, 0.1);
      color: var(--accent-dark);
    }

    &.active {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;

      .nav-icon {
        transform: scale(1.1);
      }
    }
  }
}

// 头部操作区
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;

  .search-box {
    :deep(.el-input__wrapper) {
      border-radius: var(--radius-full);
      padding: 8px 16px;
      background: var(--bg-light);
      border: 1px solid transparent;
      transition: all var(--transition-fast);

      &:hover,
      &.is-focus {
        border-color: var(--accent-color);
        background: white;
      }
    }
  }

  .header-badge {
    :deep(.el-badge__content) {
      background: var(--chinese-red);
    }
  }

  .user-dropdown {
    cursor: pointer;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;

    :deep(.el-avatar) {
      border: 2px solid var(--accent-color);
    }
  }

  .login-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border: none;
    padding: 10px 24px;
    border-radius: var(--radius-lg);
    font-weight: 500;

    &:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  }
}

// 下拉菜单用户信息
.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-light);
  margin: -8px -12px 8px;

  .dropdown-user-detail {
    display: flex;
    flex-direction: column;

    .dropdown-username {
      font-weight: 600;
      color: var(--text-color);
    }

    .dropdown-userphone {
      font-size: 12px;
      color: var(--text-muted);
    }
  }
}

// 苗族装饰条
.miao-decoration {
  height: 4px;
  background: var(--bg-color);

  .decoration-line {
    height: 100%;
    background: linear-gradient(90deg,
      var(--primary-color) 0%,
      var(--accent-color) 25%,
      var(--secondary-color) 50%,
      var(--accent-color) 75%,
      var(--primary-color) 100%
    );
  }
}

// 主内容区
.main-content {
  flex: 1;
}

// 底部
.footer {
  background: linear-gradient(180deg, #0f1729 0%, #1a365d 100%);
  color: white;
  margin-top: 80px;

  .footer-main {
    padding: 80px 0 60px;

    .footer-grid {
      display: grid;
      grid-template-columns: 300px 1fr 280px;
      gap: 80px;
    }

    .footer-brand {
      .brand-logo {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 20px;
        border: 2px solid var(--accent-color);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      h3 {
        font-size: 24px;
        font-family: 'Noto Serif SC', serif;
        margin-bottom: 12px;
        background: linear-gradient(135deg, #fff, var(--accent-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        font-size: 14px;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 24px;
      }

      .social-links {
        display: flex;
        gap: 12px;

        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);

          .el-icon {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.7);
          }

          &:hover {
            background: var(--accent-color);

            .el-icon {
              color: white;
            }
          }
        }
      }
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;

      .link-group {
        h4 {
          font-size: 16px;
          color: var(--accent-color);
          margin-bottom: 20px;
          font-weight: 600;
        }

        a {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 12px;
          transition: all var(--transition-fast);

          &:hover {
            color: white;
            padding-left: 4px;
          }
        }
      }
    }

    .footer-contact {
      h4 {
        font-size: 16px;
        color: var(--accent-color);
        margin-bottom: 20px;
        font-weight: 600;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 14px;
        margin-bottom: 14px;

        .el-icon {
          color: var(--accent-color);
          font-size: 16px;
        }
      }
    }
  }

  .footer-bottom {
    background: rgba(0, 0, 0, 0.3);
    padding: 20px 0;

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
      }

      .footer-tags {
        display: flex;
        gap: 12px;

        .footer-tag {
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .footer {
    .footer-main {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 60px;
      }

      .footer-brand {
        grid-column: 1 / -1;
        text-align: center;

        .social-links {
          justify-content: center;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .header {
    .header-content {
      gap: 20px;
    }
  }

  .nav {
    .nav-item {
      padding: 8px 14px;

      .nav-text {
        display: none;
      }
    }
  }

  .footer {
    .footer-main {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .footer-links {
        grid-template-columns: repeat(3, 1fr);
      }

      .footer-contact {
        .contact-item {
          justify-content: center;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .header {
    .header-content {
      height: 60px;
    }

    .logo {
      .logo-icon {
        width: 36px;
        height: 36px;
      }

      .logo-text {
        .logo-title {
          font-size: 16px;
        }

        .logo-subtitle {
          display: none;
        }
      }
    }

    .search-box {
      display: none;
    }
  }

  .footer {
    .footer-main {
      padding: 60px 0 40px;
    }

    .footer-links {
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }

    .footer-bottom {
      .footer-bottom-content {
        flex-direction: column;
        gap: 12px;

        .footer-tags {
          display: none;
        }
      }
    }
  }
}
</style>

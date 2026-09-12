import { getToken } from './auth';

/** tabBar 页面只能 switchTab 进入 */
const TAB_PAGES = [
  'pages/index/index',
  'pages/category/category',
  'pages/cart/cart',
  'pages/community/feed',
  'pages/mine/mine',
];

/** 当前页面地址（含参数），用于登录后跳回原处 */
export function currentPageUrl(): string {
  const pages = getCurrentPages();
  const cur: any = pages[pages.length - 1];
  if (!cur) return '';
  const query = cur.options || {};
  const qs = Object.keys(query)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`)
    .join('&');
  return '/' + cur.route + (qs ? `?${qs}` : '');
}

/** 登录页地址，带上登录成功后要回跳的位置 */
export function loginUrl(redirect?: string): string {
  return redirect
    ? `/pages/login/login?redirect=${encodeURIComponent(redirect)}`
    : '/pages/login/login';
}

/**
 * 登录成功后的跳转：回到登录前的页面，无处可回时才去首页。
 * 直接打开或刷新登录页时页面栈只有登录页一层，此时靠 redirect 参数兜底。
 */
export function goAfterLogin(redirect?: string): void {
  const pages = getCurrentPages();
  const prev: any = pages.length > 1 ? pages[pages.length - 2] : null;

  // 来源页就在栈里，直接回退，避免压入重复页面
  if (prev && redirect && '/' + prev.route === redirect.split('?')[0]) {
    uni.navigateBack();
    return;
  }

  if (redirect) {
    const path = redirect.replace(/^\//, '').split('?')[0];
    if (TAB_PAGES.includes(path)) {
      uni.switchTab({ url: '/' + path });
    } else {
      uni.redirectTo({ url: redirect, fail: () => uni.reLaunch({ url: redirect }) });
    }
    return;
  }

  if (pages.length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({ url: '/pages/index/index' });
}

/** 需要登录的操作统一调用；未登录时提示并跳登录页 */
export function requireLogin(): boolean {
  if (getToken()) return true;
  const redirect = currentPageUrl();
  uni.showToast({ title: '请先登录', icon: 'none' });
  setTimeout(() => {
    uni.navigateTo({ url: loginUrl(redirect) });
  }, 400);
  return false;
}

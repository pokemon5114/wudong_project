import { test, type Page } from '@playwright/test';

/**
 * 视觉验收截图 —— 换肤后逐页留档，人工比对用，不做断言。
 * 跑法（PC 端占着 5173 时必须指定端口）：
 *
 *     WD_BASE_URL=http://localhost:5199 npx playwright test shots
 *
 * 输出目录 tests/_shots。
 */

const SHOTS = 'tests/_shots';

/** 需要登录态的页面（购物车、订单）先注入 token，避免每页都走一遍 UI 登录 */
async function injectToken(page: Page) {
  const res = await page.request.post('http://127.0.0.1:8001/api/auth/login', {
    data: { phone: '13800138001', password: '123456' },
  });
  const body = await res.json();
  const token: string = body?.data?.token;
  if (!token) throw new Error('登录失败，拿不到 token');
  await page.addInitScript((t) => {
    localStorage.setItem('wudong_token', t);
  }, token);
}

/** 同文档 hash 导航：page.goto 换 hash 会整页重载，慢且会清掉内存态 */
async function nav(page: Page, hash: string) {
  await page.evaluate((h) => {
    window.location.hash = h;
  }, hash);
}

/**
 * 等所有已开始加载的图真正 load 完再截图。
 * uni-app H5 的 <image> 渲染成 uni-image 内的 <img>（opacity:0，只用来探活）
 * + 一个带 background-image 的 div；判断「加载完成」要看那个 <img> 的 naturalWidth。
 * ⚠️ 不加这步会拍到纯兜底色 —— banner 图是远程 pexels，比本地接口慢得多。
 */
async function settle(page: Page, extra = 500) {
  await page
    .waitForFunction(
      () => {
        const imgs = Array.from(document.querySelectorAll('uni-image img')).filter((i) =>
          i.getAttribute('src'),
        );
        if (!imgs.length) return false;
        return imgs.every((i) => {
          const el = i as HTMLImageElement;
          return el.complete && el.naturalWidth > 0;
        });
      },
      null,
      { timeout: 20_000 },
    )
    .catch(() => undefined);
  await page.waitForTimeout(extra);
}

test('截图：全部代表页', async ({ page }) => {
  await injectToken(page);

  await page.goto('/#/pages/index/index');
  await settle(page, 2500);

  // 首页轮播是自动播放的，隔一段时间连拍三张，覆盖三屏 banner
  await page.screenshot({ path: `${SHOTS}/n-index-1.png` });
  await page.waitForTimeout(4800);
  await page.screenshot({ path: `${SHOTS}/n-index-2.png` });
  await page.waitForTimeout(4800);
  await page.screenshot({ path: `${SHOTS}/n-index-3.png` });
  await page.screenshot({ path: `${SHOTS}/n-index-full.png`, fullPage: true });

  const pages: Array<[string, string, number]> = [
    ['category', '/pages/category/category', 1200],
    ['goods-list', '/pages/goods/list', 1600],
    ['goods-detail', '/pages/goods/detail?id=1', 1800],
    ['cart', '/pages/cart/cart', 1600],
    ['mine', '/pages/mine/mine', 1400],
    ['food-list', '/pages/food/list', 1600],
    ['hotel-list', '/pages/hotel/list', 1600],
    ['travel-ticket', '/pages/travel/ticket', 1400],
    ['community-feed', '/pages/community/feed', 1600],
  ];

  for (const [name, hash, wait] of pages) {
    await nav(page, `#${hash}`);
    await settle(page, wait);
    await page.screenshot({ path: `${SHOTS}/n-${name}.png` });
  }
});

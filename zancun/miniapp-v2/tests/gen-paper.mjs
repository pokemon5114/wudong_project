/**
 * 生成「撕纸边」几何数据与手绘笔触 SVG（纯 CSS/内联资源，零素材）。
 * 撕纸边 = clip-path: polygon(...)，点的抖动用固定种子，保证每次生成一致。
 *
 *     node tests/gen-paper.mjs
 *
 * 输出的 CSS 片段直接粘进 src/styles/tokens.scss。
 */

/** mulberry32：小而稳的 PRNG，固定 seed 才能复现同一张撕纸边 */
function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 生成一条撕裂边。
 * @param n     锯齿点数（越多越碎）
 * @param base  边缘基准线（%）
 * @param amp   撕口深度（%）
 * @param seed  随机种子
 */
function tornEdge(n, base, amp, seed) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    // 两级噪声叠加：大起伏 + 细碎毛边，单级看着像锯齿而不像纸
    const big = (r() - 0.5) * amp;
    const small = (r() - 0.5) * amp * 0.45;
    const y = Math.max(0, Math.min(100, base + big + small));
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  }
  return pts;
}

/** 拼成 clip-path 值：上边平，下边撕 */
function tornBottom(n = 40, base = 94, amp = 9, seed = 7) {
  const bottom = tornEdge(n, base, amp, seed).reverse();
  return `polygon(0% 0%, 100% 0%, ${bottom.join(', ')})`;
}

/** 上边撕，下边平（用于压在 banner 上的纸片） */
function tornTop(n = 40, base = 6, amp = 9, seed = 21) {
  const top = tornEdge(n, base, amp, seed);
  return `polygon(${top.join(', ')}, 100% 100%, 0% 100%)`;
}

/** 手绘波浪下划线：转成 base64 SVG，当 background-image 用（不依赖网络） */
function squiggleSvg(stroke = '#c8912f', w = 120, h = 8) {
  const d = 'M1 5 Q 12 1, 24 5 T 48 5 T 72 5 T 96 5 T 119 5';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}

/** 手绘圆圈（勾选/强调用） */
function circleSvg(stroke = '#2b4a6f', size = 48) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">` +
    `<path d="M24 4 C 36 3, 45 12, 44 24 C 43 36, 34 45, 23 44 C 11 43, 3 34, 4 23 C 5 12, 13 5, 24 4" ` +
    `fill="none" stroke="${stroke}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  return 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');
}

const out = [];
out.push('/* ---- 撕纸边 ---- */');
out.push('.wd-torn-bottom {');
out.push('  clip-path: ' + tornBottom() + ';');
out.push('}');
out.push('');
out.push('.wd-torn-top {');
out.push('  clip-path: ' + tornTop() + ';');
out.push('}');
out.push('');
out.push('/* ---- 手绘笔触（base64 SVG，零请求） ---- */');
out.push('.wd-squiggle {');
out.push('  background-image: url("' + squiggleSvg() + '");');
out.push('  background-repeat: repeat-x;');
out.push('  background-size: 120rpx 8rpx;');
out.push('}');
out.push('');
out.push('.wd-hand-circle {');
out.push('  background-image: url("' + circleSvg() + '");');
out.push('}');

console.log(out.join('\n'));

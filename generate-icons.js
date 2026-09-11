/**
 * generate-icons.js
 * 生成小程序图标 SVG（零素材，emoji 驱动）
 *
 * 使用方式：
 *   node generate-icons.js
 *
 * 输出到 console，可重定向到文件：
 *   node generate-icons.js > src/styles/icons.css
 */

const ICONS = {
 衣: { color: '#8B4513', bg: '#FFF8DC' },
 食: { color: '#E54D42', bg: '#FFEBEB' },
 住: { color: '#4A90D9', bg: '#E8F4FD' },
 行: { color: '#52C41A', bg: '#F6FFED' },
 社: { color: '#722ED1', bg: '#F9F0FF' },
};

const BASE_SIZE = 80;
const SVG_TPL = (emoji, size, color, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
  `<rect width="${size}" height="${size}" rx="16" fill="${bg}"/>` +
  `<text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="${size * 0.5}">${emoji}</text>` +
  `</svg>`;

const out = ['/* === Generated Icon SVGs === */\n'];

for (const [label, { color, bg }] of Object.entries(ICONS)) {
  const name = label.toLowerCase();
  const svg = SVG_TPL(label, BASE_SIZE, color, bg);
  const base64 = Buffer.from(svg, 'utf8').toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;

  out.push(`.icon-${name} {`);
  out.push(`  width: ${BASE_SIZE}rpx;`);
  out.push(`  height: ${BASE_SIZE}rpx;`);
  out.push(`  background-image: url("${dataUrl}");`);
  out.push(`  background-size: contain;`);
  out.push(`}`);
  out.push('');
}

console.log(out.join('\n'));

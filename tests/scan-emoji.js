/**
 * 扫描 src/pages、src/components 下 .vue 里出现的 emoji。
 * 国潮方案用靛蓝实心印章圆底，emoji 自带配色压不住靛蓝，需要全部换掉。
 * 输出全部为 ASCII（控制台是 cp936，打不出 emoji）。
 */
const fs = require('fs');
const path = require('path');

const EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}]/u;

/**
 * 白名单：这些码位默认是「文字呈现」（Emoji_Presentation=No），
 * 单色、吃 CSS color，能直接融进靛蓝/金体系，属于刻意保留。
 *
 *   U+2605 ★  U+2665 ♥  U+2661 ♡  U+2713 ✓  U+2190-2193 ← ↑ → ↓
 *
 * 反例（必须换掉）：U+2764 ❤ 与 U+2B50 ⭐ 默认是 emoji 呈现，
 * 自带红色/黄色，不吃 color —— 这类才是要清理的。
 */
const MONOCHROME_OK = new Set([
  0x2605, 0x2665, 0x2661, 0x2713, 0x2717, 0x2190, 0x2191, 0x2192, 0x2193,
]);

/** 注释行里的 emoji 只是文档说明，不影响渲染 */
const isComment = (line) => /^\s*(\/\/|\*|\/\*|<!--)/.test(line);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.vue')) out.push(p);
  }
  return out;
}

const files = [...walk('src/pages'), ...walk('src/components')];
let hits = 0;
const byCp = {};

for (const f of files) {
  fs.readFileSync(f, 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => {
      const found = [...line].filter(
        (c) => EMOJI.test(c) && !MONOCHROME_OK.has(c.codePointAt(0)),
      );
      if (!found.length) return;

      const cps = found.map((c) => {
        const h = c.codePointAt(0).toString(16);
        byCp[h] = (byCp[h] || 0) + 1;
        return 'U+' + h;
      });
      const tag = isComment(line) ? ' [comment, ok]' : '';
      if (tag) return; // 注释不计入问题数
      hits++;
      console.log(
        f.split(path.sep).join('/') + ':' + (i + 1) + '  ' + cps.join(' ') + tag,
      );
    });
}

console.log('--- lines with emoji: ' + hits + ' ---');
const ranked = Object.entries(byCp).sort((a, b) => b[1] - a[1]);
console.log('--- codepoint counts ---');
for (const [cp, n] of ranked) console.log('U+' + cp + '  x' + n);

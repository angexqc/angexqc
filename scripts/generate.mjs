/**
 * angexqc GitHub Profile —— SVG 素材生成器
 * 运行: node scripts/generate.mjs
 * 输出: assets/header.svg, assets/divider.svg, assets/cards/*.svg
 *
 * 修改个人文案 / 项目数据后重新运行即可，无需手改 SVG。
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p) => join(root, 'assets', p);

/* ------------------------------ 基础常量 ------------------------------ */
const FONT   = "'Segoe UI','PingFang SC','Microsoft YaHei',system-ui,sans-serif";
const MONO   = "'SF Mono',Consolas,'Courier New',monospace";

const C = {
  bgTop:    '#04070F',
  bgBottom: '#0B1526',
  cyan:     '#22D3EE',
  violet:   '#8B5CF6',
  emerald:  '#34D399',
  rose:     '#F472B6',
  amber:    '#FBBF24',
  text:     '#E2E8F0',
  sub:      '#94A3B8',
  dim:      '#64748B',
  line:     '#1E293B',
  chipBg:   'rgba(30,41,59,0.55)',
  chipBd:   'rgba(148,163,184,0.28)',
};

/* 近似字符宽度: CJK 按 fontsize 计算, 拉丁字母约 0.55em */
function textWidth(str, size) {
  let w = 0;
  for (const ch of str) w += /[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/.test(ch) ? size : size * 0.55;
  return w;
}

/* 简单换行, 最多 maxLines 行, 超出合并到末行并加省略号 */
function wrap(str, size, maxWidth, maxLines = 2) {
  const lines = [];
  let cur = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (cur && textWidth(cur + ch, size) > maxWidth && lines.length < maxLines) {
      lines.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  lines.push(cur);
  if (lines.length > maxLines) {
    const extra = lines.splice(maxLines - 1).join('');
    lines.push(extra);
  }
  if (textWidth(lines[lines.length - 1], size) > maxWidth) {
    let t = lines[lines.length - 1];
    while (textWidth(t + '…', size) > maxWidth && t.length > 1) t = t.slice(0, -1);
    lines[lines.length - 1] = t + '…';
  }
  return lines;
}

/* ------------------------------ 粒子 ------------------------------ */
function particles() {
  const seeds = [
    [180, 90, 1.8, 0.9], [300, 140, 1.4, 0.5], [470, 70, 1.6, 0.7],
    [110, 250, 1.3, 0.6], [560, 200, 1.5, 0.8], [1120, 90, 1.7, 0.5],
    [1180, 220, 1.4, 0.9], [880, 300, 1.5, 0.6], [760, 150, 1.3, 0.7],
    [1040, 180, 1.6, 0.4], [640, 420, 1.4, 0.8], [380, 360, 1.5, 0.5],
  ];
  return seeds.map(([x, y, r, o], i) => `
  <circle cx="${x}" cy="${y}" r="${r}" fill="#7DD3FC">
    <animate attributeName="opacity" values="${o};0.15;${o}" dur="${3 + (i % 4)}s" repeatCount="indefinite"/>
  </circle>`).join('');
}

/* ------------------------------ 头图 ------------------------------ */
function buildHeader() {
  const W = 1200, H = 470;

  const chips = ['# Vue 3', '# JavaScript', '# 微信小程序', '# Node.js', '# AI / LLM'];
  const chipSize = 14;
  let chipX = 64;
  const chipEls = chips.map((t) => {
    const w = textWidth(t, chipSize) + 26;
    const el = `
  <g>
    <rect x="${chipX}" y="272" width="${w}" height="30" rx="15"
          fill="${C.chipBg}" stroke="${C.chipBd}" stroke-width="1"/>
    <text x="${chipX + w / 2}" y="292" text-anchor="middle" font-family="${FONT}"
          font-size="${chipSize}" fill="#CBD5E1">${t}</text>
  </g>`;
    chipX += w + 10;
    return el;
  }).join('');

  const termLines = [
    { p: '$ whoami', out: '揽仙歌 · Full-Stack Developer' },
    { p: '$ cat skills.txt', out: 'Vue3 · JavaScript · 小程序 · Node.js' },
    { p: '$ npm run deploy:life', out: '✓ 正在构建有趣的产品…' },
  ];
  let ty = 122;
  const termBody = termLines.map((l, i) => {
    const gap = 1.25 + i * 1.1; // 相对整体时长 6.5s
    const row = `
    <g>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${gap / 6.5};${(gap + 0.25) / 6.5};${6.2 / 6.5};1" dur="6.5s" repeatCount="indefinite"/>
      <text x="644" y="${ty}" font-family="${MONO}" font-size="13.5" fill="#38BDF8">$</text>
      <text x="662" y="${ty}" font-family="${MONO}" font-size="13.5" fill="#22D3EE">${l.p.slice(2)}</text>
    </g>
    <g>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(gap + 0.35) / 6.5};${(gap + 0.55) / 6.5};${6.2 / 6.5};1" dur="6.5s" repeatCount="indefinite"/>
      <text x="662" y="${ty + 24}" font-family="${MONO}" font-size="13.5" fill="#94A3B8">${l.out}</text>
    </g>`;
    ty += 56;
    return row;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="angexqc banner">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.bgTop}"/>
      <stop offset="1" stop-color="${C.bgBottom}"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowEmerald" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#34D399" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#34D399" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22D3EE">
        <animate attributeName="offset" values="0;0.25;0.5;0.25;0" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="0.5" stop-color="#A78BFA">
        <animate attributeName="offset" values="0.5;0.7;0.9;0.7;0.5" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="1" stop-color="#34D399">
        <animate attributeName="offset" values="1;0.95;0.9;0.95;1" dur="8s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#1E293B" stroke-width="1" stroke-opacity="0.5"/>
    </pattern>
    <filter id="blur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" opacity="0.35"/>

  <!-- 光晕 -->
  <circle cx="980" cy="120" r="260" fill="url(#glowCyan)" filter="url(#blur)">
    <animate attributeName="cy" values="120;190;120" dur="14s" repeatCount="indefinite"/>
  </circle>
  <circle cx="180" cy="400" r="280" fill="url(#glowViolet)" filter="url(#blur)">
    <animate attributeName="cx" values="180;120;180" dur="16s" repeatCount="indefinite"/>
  </circle>
  <circle cx="620" cy="40" r="150" fill="url(#glowEmerald)" filter="url(#blur)"/>

  ${particles()}

  <!-- 左侧文案 -->
  <text x="64" y="96" font-family="${MONO}" font-size="16" fill="#38BDF8">
    console.log<tspan fill="#F472B6">(</tspan><tspan fill="#FBBF24">'Hello World 👋'</tspan><tspan fill="#F472B6">)</tspan>
  </text>

  <text x="60" y="182" font-family="${FONT}" font-size="56" font-weight="800" fill="url(#titleGrad)">你好，我是 揽仙歌</text>
  <text x="62" y="226" font-family="${MONO}" font-size="20" fill="#64748B">@<tspan fill="#7DD3FC">angexqc</tspan></text>
  <text x="64" y="256" font-family="${FONT}" font-size="22" fill="#94A3B8">Full-Stack Developer · Vue · 微信小程序 · AI</text>

  ${chipEls}

  <text x="64" y="360" font-family="${FONT}" font-size="15" fill="#64748B">📍 中国 · 持续折腾中 &#160;·&#160; ✨ 喜欢把想法变成产品</text>
  <text x="64" y="392" font-family="${FONT}" font-size="15" fill="#64748B">🔭 正在研究 LLM Agent · 边缘计算 &#160;·&#160; 📫 501979124@qq.com</text>

  <!-- 右侧终端窗口 -->
  <g>
    <rect x="628" y="56" width="516" height="360" rx="16" fill="rgba(10,20,36,0.9)" stroke="rgba(148,163,184,0.22)" stroke-width="1"/>
    <rect x="628" y="56" width="516" height="40" rx="16" fill="#0D1B2E"/>
    <rect x="628" y="80" width="516" height="16" fill="#0D1B2E"/>
    <circle cx="650" cy="76" r="6" fill="#FF5F56"/>
    <circle cx="670" cy="76" r="6" fill="#FFBD2E"/>
    <circle cx="690" cy="76" r="6" fill="#27C93F"/>
    <text x="740" y="81" font-family="${MONO}" font-size="13" fill="#64748B">angexqc — zsh</text>
    <g>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.54;0.7;0.95;1" dur="6.5s" repeatCount="indefinite"/>
      <text x="644" y="300" font-family="${MONO}" font-size="13.5" fill="#38BDF8">$</text>
      <rect x="664" y="287" width="8" height="15" fill="#22D3EE">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>
    </g>
  </g>

  <!-- 底部渐变细线 -->
  <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="url(#titleGrad)" stroke-width="1.5" opacity="0.6"/>
</svg>
`;
}

/* ------------------------------ 项目卡片 ------------------------------ */
function buildCard(p) {
  const W = 320, H = 158;
  const accent = p.accent;
  const lines = wrap(p.desc, 12, 268, 2);
  const name = p.name.length > 26 ? p.name.slice(0, 25) + '…' : p.name;

  const descEls = lines.map((l, i) =>
    `    <text x="18" y="${96 + i * 17}" font-family="${FONT}" font-size="12" fill="#94A3B8">${l}</text>`).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="cBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0C1828"/>
      <stop offset="1" stop-color="#091120"/>
    </linearGradient>
    <linearGradient id="cAccent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0.55"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" rx="18" fill="url(#cBg)" stroke="rgba(148,163,184,0.20)" stroke-width="1"/>
  <line x1="4" y1="0" x2="${W - 4}" y2="0" stroke="rgba(255,255,255,0.07)" stroke-width="1.5"/>

  <!-- 图标 -->
  <rect x="16" y="16" width="42" height="42" rx="12" fill="${accent}" fill-opacity="0.14"
        stroke="${accent}" stroke-opacity="0.45" stroke-width="1"/>
  <text x="37" y="45" text-anchor="middle" font-size="21">${p.emoji}</text>

  <!-- 名称 + 箭头 -->
  <text x="70" y="35" font-family="${FONT}" font-size="16" font-weight="700" fill="#E2E8F0">${name}</text>
  <text x="70" y="53" font-family="${MONO}" font-size="10.5" fill="#64748B">@angexqc/${name}</text>
  <text x="${W - 20}" y="33" text-anchor="middle" font-size="15" fill="${accent}">↗</text>

  ${descEls}

  <rect x="16" y="${H - 34}" width="${p.lang.length * 6.2 + 26}" height="22" rx="11"
        fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>
  <text x="${16 + p.lang.length * 3.1 + 13}" y="${H - 19}" text-anchor="middle" font-family="${FONT}"
        font-size="11" fill="#E2E8F0">${p.lang}</text>
</svg>
`;
}

/* ------------------------------ 分隔线 ------------------------------ */
function buildDivider() {
  const W = 1200, H = 28;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="divider">
  <defs>
    <linearGradient id="dGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22D3EE" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#34D399" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="14" x2="${W}" y2="14" stroke="url(#dGrad)" stroke-width="1.2"/>
  <rect x="${W / 2 - 4}" y="10" width="8" height="8" rx="2" fill="#A78BFA" transform="rotate(45 ${W / 2} 14)"/>
</svg>
`;
}

/* ------------------------------ 数据与输出 ------------------------------ */
const projects = [
  {
    name: 'wechat-bot', emoji: '🤖', accent: '#22D3EE', lang: 'JavaScript',
    desc: 'Wechaty + 多模型 AI 微信机器人：自动回复、群管理、僵尸粉检测',
  },
  {
    name: 'awesome-architecture', emoji: '🧭', accent: '#8B5CF6', lang: 'Docs',
    desc: '架构师成长路线：分布式 / AI 原生系统 / RAG，26 篇双语教程 + 25 套架构模板',
  },
  {
    name: 'vue3-admin', emoji: '🖥️', accent: '#34D399', lang: 'Vue',
    desc: 'Vue3 + Vite + Vue-Router + Element-Plus + ECharts + Axios 后台管理系统',
  },
  {
    name: 'Rainbow-Cats', emoji: '💘', accent: '#F472B6', lang: 'JavaScript',
    desc: '情侣点餐微信小程序：情侣专属任务系统 + 积分商城，甜甜的日常',
  },
];

mkdirSync(out('cards'), { recursive: true });
writeFileSync(out('header.svg'), buildHeader());
writeFileSync(out('divider.svg'), buildDivider());
for (const p of projects) writeFileSync(out(`cards/${p.name}.svg`), buildCard(p));

console.log(`✓ generated ${1 + 1 + projects.length} SVG files → assets/`);

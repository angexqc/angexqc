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
  bgTop:    '#F8FAFC',   // slate-50
  bgBottom: '#E8F0FA',   // 极浅蓝
  cyan:     '#06B6D4',   // cyan-500 (浅底上加深)
  violet:   '#7C3AED',   // violet-600
  emerald:  '#059669',   // emerald-600
  rose:     '#E11D48',   // rose-600
  amber:    '#D97706',   // amber-600
  text:     '#0F172A',   // slate-900
  sub:      '#475569',   // slate-600
  dim:      '#64748B',   // slate-500
  line:     '#E2E8F0',   // slate-200
  chipBg:   'rgba(255,255,255,0.92)',
  chipBd:   'rgba(148,163,184,0.55)',
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
  <circle cx="${x}" cy="${y}" r="${r}" fill="#38BDF8">
    <animate attributeName="opacity" values="${o};0.15;${o}" dur="${3 + (i % 4)}s" repeatCount="indefinite"/>
  </circle>`).join('');
}

/* ------------------------------ 头图 ------------------------------ */
function buildHeader() {
  const W = 1200, H = 470;

  const chips = ['# Vue 3', '# React', '# Java', '# Python', '# LangChain'];
  const chipSize = 14;
  let chipX = 64;
  const chipEls = chips.map((t) => {
    const w = textWidth(t, chipSize) + 26;
    const el = `
  <g>
    <rect x="${chipX}" y="330" width="${w}" height="30" rx="15"
          fill="${C.chipBg}" stroke="${C.chipBd}" stroke-width="1"/>
    <text x="${chipX + w / 2}" y="350" text-anchor="middle" font-family="${FONT}"
          font-size="${chipSize}" fill="#334155">${t}</text>
  </g>`;
    chipX += w + 10;
    return el;
  }).join('');

  const termLines = [
    { p: '$ whoami', out: '揽仙歌 · Full-Stack & AI Developer' },
    { p: '$ echo $STACK', out: 'LangChain · LangGraph · Dify · Coze · Agent' },
    { p: '$ npm run build:idea', out: '✓ 正在构建有趣的产品…' },
    { p: '$ gh profile status', out: '✓ 全部在线 · 欢迎交流' },
  ];
  let ty = 112;
  const termBody = termLines.map((l, i) => {
    const gap = 1.25 + i * 1.1; // 相对整体时长 6.5s
    const row = `
    <g>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${gap / 6.5};${(gap + 0.25) / 6.5};${6.2 / 6.5};1" dur="6.5s" repeatCount="indefinite"/>
      <text x="668" y="${ty}" font-family="${MONO}" font-size="13.5" fill="#0891B2">$</text>
      <text x="688" y="${ty}" font-family="${MONO}" font-size="13.5" fill="#0F172A">${l.p.slice(2)}</text>
    </g>
    <g>
      <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;${(gap + 0.35) / 6.5};${(gap + 0.55) / 6.5};${6.2 / 6.5};1" dur="6.5s" repeatCount="indefinite"/>
      <text x="688" y="${ty + 24}" font-family="${MONO}" font-size="13.5" fill="#64748B">${l.out}</text>
    </g>`;
    ty += 56;
    return row;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="angexqc banner">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDFDFF"/>
      <stop offset="1" stop-color="#EDF3FB"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#06B6D4" stop-opacity="0.20"/>
      <stop offset="1" stop-color="#06B6D4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7C3AED" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#7C3AED" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowEmerald" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#059669" stop-opacity="0.13"/>
      <stop offset="1" stop-color="#059669" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#06B6D4">
        <animate attributeName="offset" values="0;0.25;0.5;0.25;0" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="0.5" stop-color="#7C3AED">
        <animate attributeName="offset" values="0.5;0.7;0.9;0.7;0.5" dur="8s" repeatCount="indefinite"/>
      </stop>
      <stop offset="1" stop-color="#059669">
        <animate attributeName="offset" values="1;0.95;0.9;0.95;1" dur="8s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#06B6D4" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#7C3AED" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#06B6D4" stop-opacity="0.15"/>
    </linearGradient>
    <filter id="cardShadow" x="-20%" y="-30%" width="140%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="14" flood-color="#0F172A" flood-opacity="0.08"/>
    </filter>
    <clipPath id="clipTerm">
      <rect x="640" y="56" width="500" height="358" rx="18"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- 装饰圆环 -->
  <circle cx="1052" cy="96" r="180" fill="none" stroke="url(#ringGrad)" stroke-width="1.5"/>
  <circle cx="1052" cy="96" r="230" fill="none" stroke="#E2E8F0" stroke-width="1" opacity="0.6"/>
  <circle cx="122" cy="120" r="7" fill="#06B6D4" opacity="0.25"/>
  <circle cx="46" cy="330" r="4" fill="#7C3AED" opacity="0.3"/>
  <circle cx="560" cy="80" r="5" fill="#059669" opacity="0.25"/>
  <circle cx="1150" cy="380" r="6" fill="#06B6D4" opacity="0.2"/>

  <!-- 光晕 -->
  <circle cx="980" cy="120" r="260" fill="url(#glowCyan)">
    <animate attributeName="cy" values="120;190;120" dur="14s" repeatCount="indefinite"/>
  </circle>
  <circle cx="180" cy="400" r="280" fill="url(#glowViolet)">
    <animate attributeName="cx" values="180;120;180" dur="16s" repeatCount="indefinite"/>
  </circle>
  <circle cx="620" cy="40" r="150" fill="url(#glowEmerald)"/>

  ${particles()}

  <!-- 左侧文案 -->
  <g>
    <rect x="62" y="78" width="228" height="32" rx="16" fill="#FFFFFF" fill-opacity="0.75"
          stroke="rgba(6,182,212,0.4)" stroke-width="1"/>
    <text x="176" y="99" text-anchor="middle" font-family="${FONT}" font-size="14" fill="#0E7490">✨ 全栈开发者 · 热爱开源</text>
  </g>

  <text x="58" y="212" font-family="${FONT}" font-size="88" font-weight="800" fill="url(#titleGrad)">揽仙歌</text>
  <text x="62" y="256" font-family="${MONO}" font-size="20" fill="#94A3B8">@<tspan fill="#0891B2">angexqc</tspan> · Full-Stack & AI Developer</text>
  <text x="64" y="296" font-family="${FONT}" font-size="18" fill="#475569">用代码与 AI，把想法变成好用的产品</text>

  ${chipEls}

  <text x="64" y="414" font-family="${FONT}" font-size="15" fill="#64748B">📍 中国 · 持续折腾中 &#160;·&#160; ✨ 喜欢把想法变成产品</text>
  <text x="64" y="442" font-family="${FONT}" font-size="15" fill="#64748B">🔭 LLM Agent · 边缘计算 &#160;·&#160; 📫 501979124@qq.com</text>

  <!-- 右侧终端窗口 -->
  <g filter="url(#cardShadow)">
    <rect x="640" y="56" width="500" height="358" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <g clip-path="url(#clipTerm)">
      <rect x="640" y="56" width="500" height="44" fill="#F8FAFC"/>
      <line x1="640" y1="100" x2="1140" y2="100" stroke="#EFF3F8" stroke-width="1"/>
      <circle cx="664" cy="78" r="5.5" fill="#FF5F56"/>
      <circle cx="684" cy="78" r="5.5" fill="#FFBD2E"/>
      <circle cx="704" cy="78" r="5.5" fill="#27C93F"/>
      <text x="732" y="83" font-family="${MONO}" font-size="12.5" fill="#64748B">angexqc — zsh</text>
      ${termBody}
      <g>
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.62;0.76;0.95;1" dur="6.5s" repeatCount="indefinite"/>
        <text x="668" y="334" font-family="${MONO}" font-size="13.5" fill="#0891B2">$</text>
        <rect x="688" y="321" width="8" height="15" fill="#0891B2">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
        </rect>
      </g>
      <rect x="640" y="386" width="500" height="28" fill="#F8FAFC"/>
      <line x1="640" y1="386" x2="1140" y2="386" stroke="#EFF3F8" stroke-width="1"/>
      <text x="662" y="405" font-family="${MONO}" font-size="11" fill="#94A3B8">main* · node v22 · 🟢 在线</text>
    </g>
  </g>

  <!-- 底部渐变细线 -->
  <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" stroke="url(#titleGrad)" stroke-width="1.5" opacity="0.8"/>
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
    `    <text x="18" y="${96 + i * 17}" font-family="${FONT}" font-size="12" fill="#475569">${l}</text>`).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="cBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="1"/>
    </linearGradient>
    <radialGradient id="cGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="cShadow" x="-30%" y="-40%" width="160%" height="180%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.07"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" rx="18" fill="url(#cBg)" stroke="rgba(148,163,184,0.45)" stroke-width="1" filter="url(#cShadow)"/>
  <circle cx="30" cy="22" r="92" fill="url(#cGlow)"/>
  <line x1="4" y1="0.5" x2="${W - 4}" y2="0.5" stroke="#FFFFFF" stroke-opacity="0.9" stroke-width="1.5"/>

  <!-- 图标 -->
  <rect x="16" y="16" width="42" height="42" rx="12" fill="#FFFFFF" fill-opacity="0.75"
        stroke="${accent}" stroke-opacity="0.45" stroke-width="1"/>
  <text x="37" y="45" text-anchor="middle" font-size="21">${p.emoji}</text>

  <!-- 名称 + 箭头 -->
  <text x="70" y="35" font-family="${FONT}" font-size="16" font-weight="700" fill="#0F172A">${name}</text>
  <text x="70" y="53" font-family="${MONO}" font-size="10.5" fill="#64748B">@angexqc/${name}</text>
  <text x="${W - 20}" y="33" text-anchor="middle" font-size="15" fill="${accent}">↗</text>

  ${descEls}

  <rect x="16" y="${H - 34}" width="${p.lang.length * 6.2 + 26}" height="22" rx="11"
        fill="${accent}" fill-opacity="0.12" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>
  <text x="${16 + p.lang.length * 3.1 + 13}" y="${H - 19}" text-anchor="middle" font-family="${FONT}"
        font-size="11" fill="#0F172A">${p.lang}</text>
</svg>
`;
}

/* ------------------------------ 分隔线 ------------------------------ */
function buildDivider() {
  const W = 1200, H = 28;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="divider">
  <defs>
    <linearGradient id="dGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#06B6D4" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#7C3AED"/>
      <stop offset="1" stop-color="#059669" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <line x1="0" y1="14" x2="${W}" y2="14" stroke="url(#dGrad)" stroke-width="1.2"/>
  <rect x="${W / 2 - 4}" y="10" width="8" height="8" rx="2" fill="#7C3AED" transform="rotate(45 ${W / 2} 14)"/>
</svg>
`;
}

/* ------------------------------ 数据与输出 ------------------------------ */
const projects = [
  {
    name: 'pi-switch', emoji: '🔀', accent: '#2563EB', lang: 'Electron',
    desc: '多 AI 编码工具配置切换 + 用量统计桌面应用，支持 Pi/Codex/Claude/opencode',
  },
  {
    name: 'pi-switch-rust', emoji: '🦀', accent: '#EA580C', lang: 'Rust',
    desc: 'Tauri 2 + Rust 重写版：本地代理精确统计、四工具配置引擎、托盘集成',
  },
  {
    name: 'wechat-bot', emoji: '🤖', accent: '#06B6D4', lang: 'JavaScript',
    desc: 'Wechaty + 多模型 AI 微信机器人：自动回复、群管理、僵尸粉检测',
  },
  {
    name: 'awesome-architecture', emoji: '🧭', accent: '#7C3AED', lang: 'Docs',
    desc: '架构师成长路线：分布式 / AI 原生系统 / RAG，26 篇双语教程 + 25 套架构模板',
  },
  {
    name: 'vue3-admin', emoji: '🖥️', accent: '#059669', lang: 'Vue',
    desc: 'Vue3 + Vite + Vue-Router + Element-Plus + ECharts + Axios 后台管理系统',
  },
  {
    name: 'Rainbow-Cats', emoji: '💘', accent: '#DB2777', lang: 'JavaScript',
    desc: '情侣点餐微信小程序：情侣专属任务系统 + 积分商城，甜甜的日常',
  },
];

mkdirSync(out('cards'), { recursive: true });
writeFileSync(out('header.svg'), buildHeader());
writeFileSync(out('divider.svg'), buildDivider());
for (const p of projects) writeFileSync(out(`cards/${p.name}.svg`), buildCard(p));

console.log(`✓ generated ${1 + 1 + projects.length} SVG files → assets/`);

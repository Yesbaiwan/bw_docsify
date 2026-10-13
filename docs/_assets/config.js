/* ============================================================
   Docsify 全局配置（供 index.html 引用，须在 docsify.min.js 之前加载）
   ============================================================ */
window.$docsify = {
  name: '百万的博客',
  loadSidebar: true,
  alias: {
    '/.*/_sidebar.md': '/_sidebar.md',
  },
  homepage: 'home.md',

  // 分页导航
  pagination: {
    previousText: '上一篇',
    nextText: '下一篇',
    crossChapter: true,
    crossChapterText: true,
  },

  // 字数统计
  count: {
    countable: true,
    fontsize: '0.9em',
    language: 'chinese',
  },

  // 最后更新时间插件（docsify-updated）
  timeUpdater: {
    text: "<div class='update-time'>最后更新时间: {docsify-updated}</div>",
    formatUpdated: '{YYYY}/{MM}/{DD} {HH}:{mm}',
    whereToPlace: 'bottom',
  },

  // 侧边栏折叠配置 - 默认展开层级（自研 sidebar.js 读取）
  sidebarDisplayLevel: 2,

  // 全文搜索
  search: {
    maxAge: 86400000, // 过期时间，单位毫秒，默认一天
    paths: 'auto', // 自动索引所有页面
    placeholder: '搜索文档...',
    noData: '找不到相关结果',
    depth: 3, // 搜索标题的最大层级
  },

  // Mermaid 配置（docsify-mermaid 读取）
  mermaidConfig: {
    querySelector: '.mermaid',
  },

  // LaTeX 公式配置（docsify-latex 读取，默认 $...$ / $$...$$）
  latex: {},
};

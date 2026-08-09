/* ============================================================
   代码块：Shiki 高亮 + 复制按钮（替代 docsify-prism 等社区插件）
   依赖：docsify v5（通过 window.$docsify.plugins 挂载）
   说明：
     - Shiki 运行时通过动态 import 从 CDN 懒加载，语法文件按需下载
     - docsify 对未标注语言的代码块默认标记为 markup，这里映射为 markdown 高亮
     - 复制按钮包在 .code-wrap 容器里，不随代码块横向滚动移动
   ============================================================ */
(function () {
  'use strict';

  const SHIKI_URL = 'https://cdn.jsdelivr.net/npm/shiki@1/+esm';
  const THEME = 'catppuccin-latte';
  // docsify 未标注语言的代码块默认 lang 为 markup，映射成 markdown
  // （其余 js/ts/py 等简写均为 Shiki 原生别名，无需再映射）
  const LANG_ALIASES = { markup: 'markdown' };

  // Shiki 运行时单例：只加载一次；失败时重置，允许下次导航重试
  let shikiPromise;
  function loadShiki() {
    if (!shikiPromise) {
      shikiPromise = import(SHIKI_URL)
        .then(({ codeToHtml }) => codeToHtml)
        .catch((err) => {
          console.warn('[code-block] Shiki 加载失败，代码块保持 docsify 默认渲染', err);
          shikiPromise = null;
          return null;
        });
    }
    return shikiPromise;
  }

  // 语言名归一化：别名映射 + 空值兜底纯文本
  function normalizeLang(lang) {
    lang = (lang || 'text').toLowerCase();
    return LANG_ALIASES[lang] || lang;
  }

  // 高亮单个代码块，返回替换用的 HTML；任何失败都降级为纯文本，绝不抛错
  async function highlightBlock(pre) {
    const code = pre.querySelector('code');
    if (!code) return null;

    const lang = normalizeLang(
      Array.from(code.classList)
        .find((c) => c.startsWith('lang-') && !c.startsWith('language-'))
        ?.slice('lang-'.length) || '',
    );

    const codeToHtml = await loadShiki();
    if (!codeToHtml) return null;

    try {
      return await codeToHtml(code.textContent, { lang, theme: THEME });
    } catch (err) {
      console.warn(`[code-block] Shiki 不支持语言 "${lang}"，降级为纯文本`, err);
      try {
        return await codeToHtml(code.textContent, { lang: 'text', theme: THEME });
      } catch {
        return null;
      }
    }
  }

  // Shiki 高亮后为 pre.shiki 添加复制按钮
  function addCopyButtonsToShiki() {
    document.querySelectorAll('pre.shiki').forEach((pre) => {
      if (pre.parentElement?.classList.contains('code-wrap')) return;

      // 用外层容器包裹代码块，把按钮放到容器里而不是 pre 里，
      // 这样 pre 横向滚动时按钮固定在可见区域右上角，不会跟着内容跑
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.replaceWith(wrap);
      wrap.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = '复制';

      // 连点时不互相干扰（清除上一个恢复计时器）
      let resetTimer;
      btn.addEventListener('click', async () => {
        const text = pre.querySelector('code')?.textContent || '';
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = '已复制';
        } catch {
          btn.textContent = '失败';
        }
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => (btn.textContent = '复制'), 1000);
      });

      wrap.appendChild(btn);
    });
  }

  // docsify 插件：页面渲染完成后高亮代码块并挂复制按钮
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = window.$docsify.plugins || [];
  window.$docsify.plugins.push((hook) => {
    hook.doneEach(async function () {
      const pres = [...document.querySelectorAll('pre:not(.shiki)')].filter((pre) => pre.querySelector('code'));

      // 并行发起高亮，全部完成后一次性替换 DOM
      const results = await Promise.all(pres.map(async (pre) => [pre, await highlightBlock(pre)]));
      for (const [pre, html] of results) {
        if (html) pre.outerHTML = html;
      }

      addCopyButtonsToShiki();
    });
  });
})();

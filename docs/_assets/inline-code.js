/* ============================================================
   行内代码：点击整段复制，气泡提示结果
   依赖：docsify v5（通过 window.$docsify.plugins 挂载）
   说明：样式在 _assets/inline-code.css；链接内的 code 不绑定，
     避免点击复制与链接跳转冲突
   ============================================================ */
(function () {
  'use strict';

  // 优先 Clipboard API；http 等非安全上下文回退 execCommand
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  // 结果气泡：全站复用一个元素，1.2s 后淡出
  let copyTip;
  let copyTipTimer;
  function showCopyTip(anchor, ok) {
    if (!copyTip) {
      copyTip = document.createElement('div');
      copyTip.className = 'copy-tip';
      document.body.appendChild(copyTip);
    }
    copyTip.textContent = ok ? '已复制' : '复制失败';

    const rect = anchor.getBoundingClientRect();
    copyTip.style.left = `${Math.min(Math.max(4, rect.left), window.innerWidth - 80)}px`;
    const above = rect.top - 30; // 气泡高约 24px；上方放不下时退到下方
    copyTip.style.top = `${above >= 0 ? above : rect.bottom + 6}px`;

    copyTip.classList.add('show');
    clearTimeout(copyTipTimer);
    copyTipTimer = setTimeout(() => copyTip.classList.remove('show'), 1200);
  }

  function addCopyToInlineCode() {
    document.querySelectorAll('.markdown-section :not(pre) > code').forEach((code) => {
      if (code.dataset.copyBound || code.closest('a')) return;
      code.dataset.copyBound = '1';
      code.classList.add('copyable');
      code.title = '点击复制';
      code.addEventListener('click', async () => {
        // 用户正在 code 里选择部分文字时不打扰
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && code.contains(sel.anchorNode)) return;
        showCopyTip(code, await copyText(code.textContent));
      });
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = window.$docsify.plugins || [];
  window.$docsify.plugins.push((hook) => {
    hook.doneEach(addCopyToInlineCode);
  });
})();

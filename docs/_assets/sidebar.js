/* ============================================================
   自定义侧边栏折叠交互（替代 docsify-sidebar-collapse 社区插件）
   依赖：docsify v5 原生 li.group 结构 + sidebar.css
   配置：window.$docsify.sidebarDisplayLevel（未配置时默认展开 1 级）
   ============================================================ */
(function () {
  'use strict';

  function initSidebar() {
    const level = (window.$docsify && window.$docsify.sidebarDisplayLevel) || 1;

    document.querySelectorAll('.sidebar-nav ul:not(.app-sub-sidebar) > li.group').forEach((li) => {
      // 标记已绑定，避免 doneEach 重复初始化
      if (li.dataset.sidebarBound) return;
      li.dataset.sidebarBound = '1';

      // 分组深度（嵌套了几层 group）
      let depth = 1;
      for (let p = li.parentElement; p && !p.classList.contains('sidebar-nav'); p = p.parentElement) {
        if (p.tagName === 'LI' && p.classList.contains('group')) depth++;
      }

      // 点击分组标题（非链接、非子列表区域）切换折叠
      const nestedUl = li.querySelector(':scope > ul');
      li.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        if (nestedUl && nestedUl.contains(e.target)) return;
        li.classList.toggle('open');
        li.classList.toggle('collapse');
      });

      // 初始状态：深度 <= 展开层级则展开，否则折叠
      li.classList.add(depth > level ? 'collapse' : 'open');
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = window.$docsify.plugins || [];
  window.$docsify.plugins.push((hook) => {
    hook.doneEach(initSidebar);
  });
})();

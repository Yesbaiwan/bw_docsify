# DeepSeek 自动启用识图模式

因为就四十行代码，发油猴/github都太麻烦，直接贴出代码。

```js
// ==UserScript==
// @name         DeepSeek 自动启用识图模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  打开 DeepSeek 网页时自动启用识图模式（视图模式）；新建/切换会话重置为快速模式时也会再次启用
// @author       YourName
// @match        https://chat.deepseek.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 记录已处理过的识图按钮节点：新会话会重建节点，因此能再次自动启用；
  // 同一节点上用户手动切换则不会被干扰
  const handled = new WeakSet();

  function enableVisionMode() {
    // 使用 data-model-type="vision" 精准定位识图模式按钮
    const visionBtn = document.querySelector('[data-model-type="vision"]');
    if (!visionBtn || handled.has(visionBtn)) return;

    // 点击后 React 异步更新 aria-checked，用定时重试确认最终生效
    const confirm = (tries) => {
      if (handled.has(visionBtn)) return;
      if (visionBtn.getAttribute('aria-checked') === 'true') {
        handled.add(visionBtn);
        console.log('[DeepSeek] 已自动启用识图模式');
        return;
      }
      if (tries >= 8) return; // 多次重试仍失败则放弃，避免无效重复点击
      visionBtn.click();
      setTimeout(() => confirm(tries + 1), 250);
    };
    confirm(0);
  }

  // 页面加载后初始尝试
  setTimeout(enableVisionMode, 500);

  // 监听动态渲染：新建会话 / 切换会话会重建 radio 组并重置为快速模式。
  // 仅需 childList：新节点必然伴随节点增删，属性监听在 WeakSet 设计下无额外收益
  const observer = new MutationObserver(() => enableVisionMode());
  observer.observe(document.body, { childList: true, subtree: true });
})();
```

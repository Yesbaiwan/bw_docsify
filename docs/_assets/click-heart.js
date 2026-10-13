/* ============================================================
   红心点击特效（本地自研，替代 CDN 的 click-heart-animation）
   说明：点击页面任意处，在光标位置散出若干红心粒子，上浮消散
     样式由本文件注入 <style>，无需额外 css
   ============================================================ */
(function () {
  'use strict';

  const HEART_COUNT = 8; // 每次点击生成的心形数量
  const LIFE_MS = 900; // 粒子存活时长
  const COLORS = ['#ff5b7f', '#ff7a9c', '#ff96b0', '#f94d6f'];

  const STYLE = `
.heart-fx {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
  color: var(--heart-color, #ff5b7f);
  animation: heart-fx-rise var(--heart-life, 900ms) ease-out forwards;
}
@keyframes heart-fx-rise {
  from { transform: translate(-50%, -50%) rotate(var(--heart-rot, 0deg)) scale(1); opacity: 1; }
  to {
    transform: translate(calc(-50% + var(--heart-dx, 0px)), calc(-50% + var(--heart-dy, -60px)))
      rotate(var(--heart-rot, 0deg)) scale(0.4);
    opacity: 0;
  }
}`;

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  // 单颗红心：随机颜色、大小、漂移方向与旋转，动画结束后移除
  function spawnHeart(x, y) {
    const heart = document.createElement('span');
    heart.className = 'heart-fx';
    heart.textContent = '\u2665';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${10 + Math.random() * 10}px`;
    heart.style.setProperty('--heart-color', COLORS[(Math.random() * COLORS.length) | 0]);
    heart.style.setProperty('--heart-life', `${LIFE_MS}ms`);
    heart.style.setProperty('--heart-dx', `${(Math.random() - 0.5) * 80}px`);
    heart.style.setProperty('--heart-dy', `${-40 - Math.random() * 50}px`);
    heart.style.setProperty('--heart-rot', `${(Math.random() - 0.5) * 60}deg`);
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  function onClick(e) {
    for (let i = 0; i < HEART_COUNT; i++) spawnHeart(e.clientX, e.clientY);
  }

  function init() {
    injectStyle();
    document.addEventListener('click', onClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

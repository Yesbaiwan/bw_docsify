/* ============================================================
   Mermaid 图表引擎（ESM 加载，供 index.html 引用）
   说明：window.mermaid 供 docsify-mermaid 插件在路由切换后重新渲染
   ============================================================ */
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@12/dist/mermaid.esm.min.mjs';

mermaid.initialize({ startOnLoad: true });
window.mermaid = mermaid;

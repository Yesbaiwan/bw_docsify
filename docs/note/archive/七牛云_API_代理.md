# 七牛云 API 代理

七牛云模型列表请查看 https://www.qiniu.com/ai/models

## 透明代理

由于官方的模型列表接口获取到的模型不全，特做此代理增加模型列表返回，由于从网页元素中正则提取模型名称，获取模型列表速度稍慢，其他请求透传给官方接口 https://api.qnaigc.com

cloudflare workers 部署：

```js
const DOCS_URL = "https://www.qiniu.com/ai/models";
const API_BASE = "https://api.qnaigc.com";

async function fetchModels() {
  const res = await fetch(DOCS_URL);
  const html = await res.text();
  const start = html.indexOf('"models"', html.indexOf('"models"') + 1);
  const section = html.slice(start);
  const models = [];
  for (const match of section.matchAll(/"id":\s*"([^"]+)"[\s\S]*?"retirement_at":\s*"([^"]*)"/gi)) {
    const id = match[1];
    if (id && !(match[2] && new Date(match[2]) < new Date())) {
      models.push({ id, object: "model" });
    }
  }
  return models;
}

export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response("模型列表请查看 https://www.qiniu.com/ai/models", { status: 200 });
    }
    if (url.pathname === "/models" || url.pathname === "/v1/models") {
      return Response.json({ data: await fetchModels(), object: "list" });
    }
    return fetch(`${API_BASE}${url.pathname}${url.search}`, req);
  },
};
```

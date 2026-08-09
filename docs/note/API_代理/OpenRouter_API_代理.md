# OpenRouter API 代理

OpenRouter 一直以来有免费的模型，于是也筛选出所有的免费的模型，其他请求透传给官方接口

## 透明代理

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BASE = 'https://openrouter.ai/api';

    if (url.pathname === '/') {
      return new Response('获取密钥前往 https://openrouter.ai/keys', { status: 200 });
    }

    if (url.pathname === '/models' || url.pathname === '/v1/models') {
      const res = await fetch(`${BASE}/v1/models${url.search}`, req);
      if (!res.ok) return new Response(await res.text(), { status: res.status });
      const data = await res.json();
      data.data = data.data?.filter((m) => m.pricing?.prompt === '0' && m.pricing?.completion === '0') || [];
      return Response.json(data);
    }

    return fetch(`${BASE}${url.pathname}${url.search}`, req);
  },
};
```

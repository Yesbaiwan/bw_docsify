# Aihubmix API 代理

Aihubmix 有免费模型，每天有 100 万 Token 的免费使用额度，官方的模型众多，作此代理筛选出免费模型。

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BASE = 'https://aihubmix.com';
    // 官方有一个没有被墙的端点：https://api.inferera.com

    if (url.pathname === '/') {
      return new Response('获取密钥前往 https://aihubmix.com', { status: 200 });
    }

    if (url.pathname === '/models' || url.pathname === '/v1/models') {
      const res = await fetch(`${BASE}/call/mdl_info_pagination?num=10000`);
      if (!res.ok) return new Response(await res.text(), { status: res.status });
      const data = await res.json();
      const free = data.data?.filter((m) => m.model_ratio === 0) || [];
      const models = free.map((m) => {
        const { model, ...rest } = m;
        return { id: model, object: 'model', ...rest };
      });
      return Response.json({ object: 'list', data: models });
    }

    return fetch(`${BASE}${url.pathname}${url.search}`, req);
  },
};
```

# kilo free API 代理

最近发现 kilo_free 有免费的模型，于是做此代理筛选出所有的免费的模型，其他请求透传给官方接口。因为 kilo 的对话地址没有 /v1 前缀，这里处理了这个情况。

API 密钥使用：`anonymous`

## 透明代理

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    const BASE = 'https://api.kilo.ai/api/openrouter';

    if (url.pathname === '/') {
      return new Response('Hello World', { status: 200 });
    }

    // 去掉 /v1 前缀，得到上游路径
    const upstreamPath = url.pathname.replace(/^\/v1/, '');

    // 模型列表接口（支持 /models 和 /v1/models）
    if (upstreamPath === '/models') {
      const res = await fetch(`${BASE}/models${url.search}`, req);
      if (!res.ok) return new Response(await res.text(), { status: res.status });
      const data = await res.json();
      const free = data.data?.filter((m) => m.isFree === true) || [];
      return Response.json({ object: data.object, data: free });
    }

    // 其他请求透传给上游（去掉 /v1 后的路径）
    return fetch(`${BASE}${upstreamPath}${url.search}`, req);
  },
};
```

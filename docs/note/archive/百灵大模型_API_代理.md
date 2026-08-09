# 百灵大模型 API 代理

API 获取页面：https://ling.tbox.cn/open

每个账号每天 50 万 tokens 的额度，包含输入和输出。免费额度每天 02:00 前完成发，当日未用完的额度不会转结到下一天，超额会从余额进行扣除。

## 透明代理

由于官方 API 没有模型列表接口，特此做此代理增加模型列表返回，其他请求透传给官方接口 https://api.tbox.cn/api/llm

cloudflare workers 部署：

```js
export default {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/') {
      return new Response('获取密钥前往 https://ling.tbox.cn/open', { status: 200 });
    }
    if (url.pathname === '/models' || url.pathname === '/v1/models') {
      try {
        const res = await fetch('https://lingstudio.tbox.cn/meta/model/list', {
          headers: { referer: 'https://ling.tbox.cn/' },
        });
        if (!res.ok) return Response.json({ data: [], object: 'list' });
        const json = await res.json();
        const data = (json.data || []).filter((m) => m.status === 'ACTIVE').map((m) => ({ id: m.code, object: 'model' }));
        return Response.json({ data, object: 'list' });
      } catch {
        return Response.json({ data: [], object: 'list' });
      }
    }
    return fetch(`https://api.tbox.cn/api/llm${url.pathname}${url.search}`, req);
  },
};
```

# siliconflow API 代理

siliconflow 的默认获取模型列表的接口不包含价格信息，从网页获取呢提取又比较麻烦，今天找到了一个隐藏的接口，可以直接获取到模型列表的 JSON，包含价格信息，需要用 token 鉴权。

```js
export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === '/') {
      return new Response('SiliconFlow 官网地址：https://cloud.siliconflow.cn/me/models', { status: 200 });
    }

    if (url.pathname === '/models' || url.pathname === '/v1/models') {
      const res = await fetch('https://busy-bear.siliconflow.cn/api/v1/playground/comprehensive/all', {
        headers: {
          Authorization: `Bearer ${env.SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) return new Response(await res.text(), { status: res.status });
      const data = await res.json();
      const models = data?.data?.models || [];

      // 过滤免费模型
      const freeModels = models.filter((m) => {
        if (m.status !== 'normal') return false;
        if (m.price === '0') return true;
        if (!m.pricing) return false;
        return m.pricing.every((p) => p.price === '0');
      });

      // 统计每个 sub_type 的数量
      const subTypeCount = {};
      freeModels.forEach((m) => {
        subTypeCount[m.subType] = (subTypeCount[m.subType] || 0) + 1;
      });

      // 按 sub_type 数量从多到少排序
      const sortedModels = freeModels.sort((a, b) => {
        return subTypeCount[b.subType] - subTypeCount[a.subType];
      });

      // 转换为 OpenAI 兼容格式
      const openaiModels = sortedModels.map((m) => ({
        id: m.modelName,
        object: 'model',
        context_length: m.contextLen || 0,
        type: m.type,
        sub_type: m.subType,
      }));

      return Response.json({
        object: 'list',
        data: openaiModels,
      });
    }

    return fetch(`https://api.siliconflow.cn${url.pathname}${url.search}`, req);
  },
};
```

需要添加一个环境变量 `SILICONFLOW_API_KEY`，值为 siliconflow 的 API Key。

这个接口本身是用 token 鉴权的，可以直接调用。

```bash
curl -X GET "https://busy-bear.siliconflow.cn/api/v1/playground/comprehensive/all" \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -H "Content-Type: application/json"
```

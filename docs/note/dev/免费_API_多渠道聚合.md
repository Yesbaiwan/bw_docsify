# 免费 API 多渠道聚合

多个渠道每个都建一个 worker 太麻烦了，所以做了一个聚合 worker，将多个渠道的 API 都聚合到一个 worker 中。

注意：

- 此代码将多个渠道的免费的模型过滤出来，你看到的不是所有模型，只是可以免费调用的模型。
- 这几个渠道的名称是：`aihubmix`、`kilo`、`kilo-openrouter`、`aiping`、`poe`、`openrouter`、`siliconflow`。
- `siliconflow` 渠道需要添加环境变量 `SILICONFLOW_API_KEY` 来获取模型列表，值为 siliconflow 的 API Key。
- `kilo` 和 `kilo-openrouter` 是同一个渠道，只是上游接口不同，这两个渠道密钥填写 `anonymous` 即可。其余渠道密钥填写自己的密钥。
- 每个渠道的通过 `/渠道名` 来访问，例如，你的 worker 地址是 `https://xxx.workers.dev/`，那么 `/kilo` 就是 `https://xxx.workers.dev/kilo`，推荐自定义域名使用。
- 不再提供单独的渠道的代码，维护优先，此聚合拥有之前的全部渠道。
- 不想部署直接用我的 worker 地址：`https://free.newapi.me` 来访问。

```js
const CHANNELS = {
  aihubmix: {
    base: 'https://aihubmix.com',
    root: '获取密钥前往 https://aihubmix.com',
    async models() {
      const res = await fetch('https://aihubmix.com/call/mdl_info_pagination?num=10000');
      if (!res.ok) return { data: [], object: 'list' };
      const json = await res.json();
      const free = json.data?.filter((m) => m.model_ratio === 0) || [];
      const models = free.map((m) => {
        const { model, ...rest } = m;
        return { id: model, object: 'model', ...rest };
      });
      return { object: 'list', data: models };
    },
  },
  'kilo-openrouter': {
    base: 'https://api.kilo.ai/api/openrouter',
    root: 'Hello World',
    async models() {
      const res = await fetch(`${this.base}/models`);
      if (!res.ok) return { data: [], object: 'list' };
      const json = await res.json();
      const free = json.data?.filter((m) => m.isFree === true) || [];
      return { object: json.object, data: free };
    },
    transform(path) {
      return path.replace(/^\/v1/, '');
    },
  },

  kilo: {
    base: 'https://api.kilo.ai/api/gateway',
    root: 'Hello World',
    async models() {
      const res = await fetch(`${this.base}/v1/models`);
      if (!res.ok) return { data: [], object: 'list' };
      const json = await res.json();
      const free = json.data?.filter((m) => m.isFree === true) || [];
      return { object: json.object, data: free };
    },
  },

  aiping: {
    base: 'https://aiping.cn/api',
    root: '请在 https://aiping.cn/user/called-records 查看调用记录',
    async models() {
      const res = await fetch('https://aiping.cn/api/v1/models');
      if (!res.ok) return { data: [], object: 'list' };
      const { data, object } = await res.json();
      const excluded = ['text2video', 'image2video', 'video2video'];
      const free = data.filter(
        (m) =>
          m.price?.input_price_range?.[0] === 0 &&
          m.price?.output_price_range?.[0] === 0 &&
          ![].concat(m.model_type).some((t) => excluded.includes(t)),
      );
      return { object, data: free };
    },
    async transform(path, req) {
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const body = await req.clone().json();
          body.extra_body = {
            provider: {
              sort: ['throughput'],
              input_price_range: [0, 0],
              output_price_range: [0, 0],
              allow_fallbacks: false,
            },
          };
          const fwdHeaders = new Headers(req.headers);
          fwdHeaders.delete('content-length');
          fwdHeaders.set('Content-Type', 'application/json');
          const newReq = new Request(req.url, {
            method: req.method,
            headers: fwdHeaders,
            body: JSON.stringify(body),
          });
          return { path, req: newReq };
        } catch {
          // fall through
        }
      }
      return path;
    },
  },

  poe: {
    base: 'https://api.poe.com',
    root: '获取密钥前往 https://poe.com/api/keys',
    async models(req) {
      const res = await fetch(`${this.base}/v1/models`, req);
      if (!res.ok) return { data: [], object: 'list' };
      const json = await res.json();
      const free = json.data?.filter((m) => m.pricing?.request === '0.00') || [];
      return { object: json.object, data: free };
    },
  },

  openrouter: {
    base: 'https://openrouter.ai/api',
    root: '获取密钥前往 https://openrouter.ai/keys',
    async models(req) {
      const res = await fetch(`${this.base}/v1/models`, req);
      if (!res.ok) return { data: [], object: 'list' };
      const json = await res.json();
      json.data = json.data?.filter((m) => m.pricing?.prompt === '0' && m.pricing?.completion === '0') || [];
      return json;
    },
  },

  siliconflow: {
    base: 'https://api.siliconflow.cn',
    root: 'SiliconFlow 官网地址：https://cloud.siliconflow.cn/me/models',
    async models(req, env) {
      const res = await fetch('https://busy-bear.siliconflow.cn/api/v1/playground/comprehensive/all', {
        headers: {
          Authorization: `Bearer ${env.SILICONFLOW_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) return { data: [], object: 'list' };
      const data = await res.json();
      const models = data?.data?.models || [];

      // 过滤免费模型
      const freeModels = models.filter((m) => {
        if (m.status !== 'normal') return false;
        if (m.price === '0') return true;
        if (!m.pricing) return false;
        return m.pricing.every((p) => p.price === '0');
      });

      const subTypeCount = {};
      freeModels.forEach((m) => {
        subTypeCount[m.subType] = (subTypeCount[m.subType] || 0) + 1;
      });

      const sortedModels = freeModels.sort((a, b) => {
        return subTypeCount[b.subType] - subTypeCount[a.subType];
      });

      const openaiModels = sortedModels.map((m) => ({
        id: m.modelName,
        object: 'model',
        context_length: m.contextLen || 0,
        type: m.type,
        sub_type: m.subType,
      }));

      return { object: 'list', data: openaiModels };
    },
    transform(path, req, env) {
      const upstreamPath = path;
      const newReq = new Request(req);
      newReq.headers.set('Authorization', `Bearer ${env.SILICONFLOW_API_KEY}`);
      return { path: upstreamPath, req: newReq };
    },
  },
};

async function handleChannel(channel, path, search, req, env) {
  const config = CHANNELS[channel];
  if (!config) {
    return new Response('Unknown channel', { status: 404 });
  }

  if (path === '/' || path === '') {
    return new Response(config.root, { status: 200 });
  }

  if (path === '/models' || path === '/v1/models') {
    const result = await config.models(req, env);
    return Response.json(result);
  }

  if (config.transform) {
    const result = await config.transform(path, req, env);
    if (typeof result === 'object' && result.path) {
      return fetch(`${config.base}${result.path}${search}`, result.req);
    }
    return fetch(`${config.base}${result}${search}`, req);
  }
  return fetch(`${config.base}${path}${search}`, req);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      return new Response(
        'API Gateway - Available channels: /aihubmix, /kilo, /kilo-openrouter, /aiping, /poe, /openrouter, /siliconflow',
        {
          status: 200,
        },
      );
    }

    const channel = pathParts[0];
    const subPath = '/' + pathParts.slice(1).join('/');

    return handleChannel(channel, subPath, url.search, req, env);
  },
};
```

> 基于 [Docsify](https://docsify.js.org) 的极简静态博客，无构建步骤：`docs/` 即站点根目录

## 开始写作

在 `docs/note/<分类>/` 下创建 `.md` 文件（文件名空格用下划线），然后运行：

```bash
node scripts/update-sidebar.js  # 更新侧边栏和首页
```

## 启动预览

```bash
npm install
npm run dev
```

开发见 [AGENTS.md](AGENTS.md)。

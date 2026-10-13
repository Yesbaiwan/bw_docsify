# AGENTS.md

## 项目概览

- Docsify 中文极简静态博客，无构建步骤：`docs/` 即站点根目录，GitHub Pages / 静态服务器直接服务其中文件。
- 文章在 `docs/note/<分类>/`（`.md`）；图片图标在 `docs/_media/`；自定义样式与脚本在 `docs/_assets/`（逐文件说明见下）。
- `scripts/` 为本地工具；`docs/_sidebar.md` 与 `docs/home.md` 是生成产物，不要手改。

## 目录结构

```
docs/
├── index.html        # 入口：只含引用，不写内联逻辑
├── _assets/          # 自研样式与脚本
├── _media/           # 图片图标
├── _sidebar.md       # 生成产物
├── home.md           # 生成产物
└── note/<分类>/      # 文章
```

## 常用命令

```bash
npm install                     # 安装开发依赖
npm run dev                     # docsify serve docs --port 4000（需全局 docsify-cli）
npm run format                  # Prettier 格式化仓库
npx prettier --check .          # 格式检查
node scripts/update-sidebar.js  # 扫描 docs/note 生成侧边栏与首页
node scripts/check-spaces.js    # 检查文章目录/文件名中的空格
```

新增或移动文章后运行 `update-sidebar.js`，并用 `git diff` 核对生成的导航。

## docs/_assets/ 资产说明

| 文件                                 | 职责                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| `theme.css`                          | 页面观感：正文字体、标题层级、内容区宽度、链接样式、更新时间戳 |
| `sidebar.css` + `sidebar.js`         | 自定义侧边栏（v4 观感：文件图标、折叠、宽度），替代社区插件    |
| `code-block.css` + `code-block.js`   | 代码块：Shiki 高亮（catppuccin-latte）+ 悬停复制按钮           |
| `inline-code.css` + `inline-code.js` | 行内代码：配色对齐代码块、字号随正文；点击整段复制（气泡反馈） |
| `click-heart.js`                     | 红心点击特效（本地自研，样式由 JS 注入，替代已弃用的 CDN 库）  |
| `config.js`                          | `window.$docsify` 全局配置（须在 docsify.min.js 之前加载）     |
| `mermaid.js`                         | Mermaid ESM 引擎加载与初始化，暴露 `window.mermaid` 给插件     |

## 依赖与版本策略

`docs/index.html` 中所有 CDN 依赖一律**固定版本号**，禁止 `@latest`、未固定版本、GitHub 仓库 `@main` 引入：

- 核心与官方插件：docsify@5（含 core/vue 主题、zoom-image、search）
- 第三方插件：katex@0.19 + docsify-latex@0.5.2、mermaid@12 + docsify-mermaid@2.0.1、docsify-pagination@2.10.1、docsify-count@1.1.0、docsify-updated@1.0.5
- 字体：lxgw-wenkai-webfont@1.7.0、@mogeko/maple-mono-cn@7.9.0

升级依赖的注意事项：

- 升级后必须本地起服务用浏览器回归：代码高亮、KaTeX 公式、Mermaid 图表、分页、字数统计、更新时间、搜索、图片缩放、红心特效，并确认 console 无报错。
- `docsify-latex` 与 `docsify-mermaid` 均已停更，但是 v5 下的社区标准方案，缺一不可（mermaid 渲染依赖 docsify-mermaid 触发）。若未来 v5 更新弄坏它们，参照自研插件方式接管。
- v5 已废弃 `topMargin` 配置，锚点滚动偏移由 `theme.css` 的 `--scroll-padding-top` 提供，勿加回。

## 字体

- 正文用霞鹜文楷（CDN webfont），代码用 Maple Mono CN（`code-block.css` 的 `--font-code`）。
- 行内代码字号用 `1em` 随所在文字，勿改回主题默认 `0.875rem`（比正文小一号，标题内更悬殊）。
- 已知限制：霞鹜文楷 Bold 字面本身只比 Regular 粗三成左右，加粗观感偏温和；本机若装有同名霞鹜文楷（无 Bold 字面），webfont 加载失败时加粗会更弱。曾为此引入别名家族方案，已按要求回退，勿未经确认重做。

## 编辑约定与边界

- 新文章放 `docs/note/<分类>/`，文件名空格用下划线（导航显示时还原）；`docs/note/archive|Archive` 不进侧边栏与首页。
- 前端能力一律做成 `docs/_assets/` 下独立 css/js 文件，`index.html` 只加 `<link>/<script>` 引用。
- 修改 HTML/CSS/JS/Markdown 后：运行相关脚本并 `git diff` 核对。
- JS/JSON 遵循 Prettier（单引号、2 空格、140 列）；文章 Markdown 交由 `npm run format` 统一格式。
- 视觉修改优先复用现有文件的变量与结构，不引入新的构建工具或框架。

## 注意事项

- `node_modules/`、`package-lock.json` 均被 `.gitignore` 忽略，不入库。
- `docs/index.html` 依赖 CDN，离线时插件与字体不完整。
- 线上（GitHub Pages）需 commit + push 后才更新；本机预览用 `npm run dev`（端口 4000）。

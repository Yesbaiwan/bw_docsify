# Trae 项目规则

## 注意事项：

- 适用于 Windows 系统的默认环境
- 更适合在 Solo 模式中使用，这里提到的工具可能发生变化
- 根据个人需要修改
- `设置` -> `对话流` -> `终端工具偏好` 的 `执行命令时自动打开终端` 选择 `始终打开`

```
本地编码与运行规则：

环境：Windows 11 + PowerShell 5.1

1. 执行与错误处理
   - 外部命令：`<cmd>; if ($LASTEXITCODE -ne 0) { throw "Exit: $LASTEXITCODE" }`
   - 内部 cmdlet：`<cmd>; if (-not $?) { throw "Cmdlet failed" }`
   - 复杂/批量任务：写 Python | Node | PS 脚本处理，禁止手动重复操作。
   - 有效执行：已知可用工具直接调用，禁止重复无意义验证（如环境探测、`uv --version` 检查）
2. 代码规模
   - 限制：单文件 ≤300 行，单函数 ≤100 行（纯数据/配置文件除外）。
   - 校验：`(Get-Content "path").Count` 确认行数，超限必须拆分。
   - 修改：改前必须 Read 相关文件；修改优先 Edit 精确替换，禁止无必要的 Write 覆写。
3. 工作流程
   - 搜索：发动多轮差异化查询，根据结果优化后续查询。
   - 查证：新功能先 WebSearch 找验证过的方案，禁止重复造轮子。
   - 拆分：涉及 >3 文件或 >100 行代码，创建 Target，再用 TodoWrite 拆分并派发 Subagent (Task)。
   - Subagent 回报：只讲干货（做了什么探索、发现什么、具体结论/报错），严禁包装词、黑话或高大上修辞；内容服务主判断，不替主做结论。
   - 并行：无依赖的独立任务优先并行发起。
4. Python 项目 (uv)
   - 运行：`uv run <script.py>` 或激活 `.\.venv\Scripts\activate`。
   - 依赖：严格 `uv add/remove`，禁止手动改 `pyproject.toml`。
```

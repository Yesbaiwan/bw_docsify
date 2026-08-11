# Trae 项目规则

## 注意事项：

- ~~适用于 Windows 系统的默认环境~~ Windows PowerShell 默认是 5.1，你可以升级或者直接将下面的版本改为 5.1
- gpt 系模型本身喜欢调用子代理，规则这里写要求调用子代理可能还要加重这个毛病，建议使用非 gpt 系模型，推荐 deepseek-v4-flash
- 更适合在 Solo 模式中使用，这里提到的工具可能发生变化
- 根据个人需要修改

```markdown
本地编码与运行规则：

环境：Windows 11 + PowerShell 7.6.4

1. 交流原则
   - 用户提出问题不合理，纠正/提醒用户重新描述，不要直接开始任务。
   - 每次对话开始时，使用 `date` 获取当前时间。
2. 执行与错误处理
   - 外部命令：`<cmd>; if ($LASTEXITCODE -ne 0) { throw "Exit: $LASTEXITCODE" }`。
   - 内部 cmdlet：`<cmd>; if (-not $?) { throw "Cmdlet failed" }`。
   - 复杂/批量任务：写 Node | Python | PS 脚本处理，禁止手动重复操作。
   - 有效执行：已知可用工具直接调用，禁止重复无意义验证（如环境探测、`uv --version` 检查）
3. 代码规模
   - 限制：单文件 ≤300 行，单函数 ≤100 行（纯数据/配置文件除外）。
   - 校验：`(Get-Content "path").Count` 确认行数，超限必须拆分。
   - 修改：改前必须 Read 相关文件；修改优先 Edit 精确替换，禁止无必要的 Write 覆写。
4. 工作流程
   - 探索过程小心谨慎，定位问题再解决。
   - 发动多轮差异化查询，根据结果优化后续查询。
   - 任何技术相关问题先网络搜索官方公告、文档、社区验证过的方案，禁止闭门造车。
   - 涉及 >3 文件或 >100 行代码，创建 Target，再用 TodoWrite 拆分并派发 Subagent (Task)。
   - Subagent 回报：讲清楚用了什么工具、做了什么探索、发现什么、文件路径与代码片段以及具体的结果/报错，不做修辞禁用黑话，内容服务主判断，不替主做结论。
   - 检查：当任务完成后，检查结果是否符合预期，不符合则再次进行任务、重复流程。
5. Python 项目 (uv)
   - 运行：`uv run <script.py>` 或激活 `.\.venv\Scripts\activate`。
   - 依赖：严格 `uv add/remove`，禁止手动改 `pyproject.toml`。
```

# 更新日志 / Changelog

## v1.0.0（2026-10-18）

🎉 首个开源版本发布！

> 一个赛博朋克「粉黑萌系」风格的多智能体（Multi-Agent）AI 量化交易可视化看板。
> 顶部 6 个圆脸机器人 Agent 监控、K 线主图、实时决策日志、资金曲线——全部数据可本地模拟，也可对接你自己的后端。

### ✨ 首发特性

- 🎨 **粉黑萌系赛博朋克 UI**：深色卡片浮于粉色世界之上，霓虹绿/粉配色，圆脸机器人头像
- 🤖 **6 个 AI Agent 卡片**：表情随行情联动——赚钱兴奋、亏钱哭泣、空头偷笑
- 📈 **专业图表**：`lightweight-charts` K 线主图 + `recharts` 资金曲线
- 🧪 **零配置即可运行**：内置本地模拟数据，无需任何后端，clone 下来就能看到会动的数据
- 🔌 **可选对接真实后端**：FastAPI 读取 JSON 提供 `/api/live`，前端每 3 秒拉取
- 📜 **趣味彩蛋**：底部跑马灯量化冷笑话 + 系统吐槽日志

### 🚀 快速开始

```bash
git clone https://github.com/B1itE2/moreb1essed-quant-dashboard.git
cd moreb1essed-quant-dashboard
npm install
npm run dev
# 浏览器打开 http://localhost:5173
```

> 想要真实数据？再开一个终端跑后端即可：
> ```bash
> pip3 install -r backend/requirements.txt
> python3 backend/server.py
> ```

### 📡 数据接口契约

前端每 3 秒请求 `http://localhost:8000/api/live`，后端默认读取 `backend/data/` 下最新的 `*.json`。
完整字段说明见仓库 [README](README.md) 的「数据接口契约」一节。

### 🔒 数据安全与隐私

- 本项目**不含任何 API Key、密钥或真实交易数据**，可直接公开
- 数据目录仅提交示例 `sample.json`；你的真实输出会被 `.gitignore` 忽略，**绝不入库**
- 提交身份已使用 GitHub noreply 邮箱，不暴露真实姓名 / 邮箱

### 📄 许可证

[MIT](LICENSE) © 2026 moreb1essed —— 可自由使用、修改、二次创作，请保留版权声明。

### ⚠️ 免责声明

本项目仅用于技术演示与学习，所有数据均为模拟或示例，**不构成任何投资建议**。

---

📷 **截图建议**：把你的看板运行截图放到 `docs/` 下，并在本说明里引用 `![preview](docs/preview.png)`，发布后会更吸引人。

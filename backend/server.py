"""
极简实时数据 API —— 给前端 ai-trading-dashboard 用
作用：读取本机某个目录下【最新的】JSON 文件，对外提供 http://localhost:8000/api/live

运行前先装依赖：
    pip install -r requirements.txt
然后启动：
    python server.py
（或者：uvicorn server:app --reload --port 8000）

想要对接真实数据？把 TradingAgents-CN 写出的 JSON 目录指给这个脚本即可：
    DATA_DIR=/你的/真实/JSON/目录 python server.py
"""
import os
import json
import glob
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Trading Live API")

# 跨域：前端跑在 Vite(默认 5173)，后端在 8000，浏览器会因"跨域"拦截，
# 这里开发阶段直接全开。生产环境可改成 allow_origins=["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# JSON 文件所在目录：默认读脚本同级的 data/ 文件夹；
# 真实对接时通过环境变量 DATA_DIR 改成 TradingAgents-CN 的输出目录
DATA_DIR = os.getenv("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))


@app.get("/")
def root():
    return {"status": "ok", "data_dir": DATA_DIR, "hint": "前端请访问 /api/live"}


@app.get("/api/live")
def live():
    files = glob.glob(os.path.join(DATA_DIR, "*.json"))
    if not files:
        return {
            "error": "no_json",
            "message": f"{DATA_DIR} 目录下还没有 JSON 文件",
        }
    # 取"最近修改"的那个文件，即最新一帧数据
    latest = max(files, key=os.path.getmtime)
    with open(latest, "r", encoding="utf-8") as f:
        data = json.load(f)
    # 如果文件本身是数组，包一层，避免前端解构报错
    if isinstance(data, list):
        data = {"raw": data}
    return data


if __name__ == "__main__":
    print(f"✅ 实时 API 已启动：http://localhost:8000/api/live")
    print(f"📂 正在读取目录：{DATA_DIR}")
    uvicorn.run(app, host="0.0.0.0", port=8000)

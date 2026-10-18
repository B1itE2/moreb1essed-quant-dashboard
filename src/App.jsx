import { useState, useEffect, useRef } from 'react'
import TopBar from './components/TopBar.jsx'
import KLineChart from './components/KLineChart.jsx'
import AgentLog from './components/AgentLog.jsx'
import PortfolioCurve from './components/PortfolioCurve.jsx'
import TickerStrip from './components/TickerStrip.jsx'
import {
  generateInitialCandles,
  initialAgents,
  generateInitialEquity,
  nextAgentLog,
} from './lib/mockData.js'

// 后端实时接口地址（改 IP/端口时只动这一行）
const API_URL = 'http://localhost:8000/api/live'

export default function App() {
  // 初始先用本地 mock 兜底，避免后端没开时白屏
  const [candles, setCandles] = useState(() => generateInitialCandles(240))
  const chartRef = useRef(null)
  const [agents, setAgents] = useState(() => initialAgents())
  const [logs, setLogs] = useState(() => Array.from({ length: 12 }, nextAgentLog))
  const [equity, setEquity] = useState(() => generateInitialEquity(120))
  // 是否已连上后端；连不上就退回本地模拟跳动
  const [usingBackend, setUsingBackend] = useState(false)

  // ===== 真实数据：每 3 秒拉一次后端 =====
  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) return
        const data = await res.json()
        if (!alive) return
        // 只更新后端确实返回的字段，避免缺字段时页面崩
        if (data.candles) setCandles(data.candles)
        if (data.agents) setAgents(data.agents)
        if (data.logs) setLogs(data.logs)
        if (data.equity) setEquity(data.equity)
        setUsingBackend(true)
      } catch (e) {
        // 后端没开 / 跨域失败 → 退回本地模拟
        setUsingBackend(false)
      }
    }
    load()
    const timer = setInterval(load, 3000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [])

  // ===== 本地模拟兜底：仅当后端连不上时才跑，让画面继续跳动 =====
  useEffect(() => {
    if (usingBackend) return // 已连上后端，模拟器让位

    const klineTimer = setInterval(() => {
      setCandles((prev) => {
        const last = prev[prev.length - 1]
        const close = +(last.close * (1 + (Math.random() - 0.5) * 0.006)).toFixed(1)
        const next = {
          time: last.time + 60,
          open: last.close,
          close,
          high: +(Math.max(last.close, close) * 1.001).toFixed(1),
          low: +(Math.min(last.close, close) * 0.999).toFixed(1),
          volume: +(80 + Math.random() * 320).toFixed(1),
        }
        const m = [...prev, next]
        return m.length > 600 ? m.slice(m.length - 600) : m
      })
    }, 800)

    const agentTimer = setInterval(() => {
      setAgents((prev) =>
        prev.map((a, i) =>
          i === Math.floor(Math.random() * prev.length)
            ? {
                ...a,
                status: Math.random() > 0.35 ? 'working' : 'idle',
                lastActive: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
              }
            : a
        )
      )
    }, 2000)

    const logTimer = setInterval(() => {
      setLogs((prev) => {
        const m = [...prev, nextAgentLog()]
        return m.length > 200 ? m.slice(m.length - 200) : m
      })
    }, 1200)

    const equityTimer = setInterval(() => {
      setEquity((prev) => {
        const last = prev[prev.length - 1].equity
        const eq = +(last * (1 + (Math.random() - 0.5) * 0.005)).toFixed(0)
        const m = [
          ...prev,
          { time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), equity: eq },
        ]
        return m.length > 300 ? m.slice(m.length - 300) : m
      })
    }, 1000)

    return () => {
      clearInterval(klineTimer)
      clearInterval(agentTimer)
      clearInterval(logTimer)
      clearInterval(equityTimer)
    }
  }, [usingBackend])

  // 市场心情：按当日盈亏幅度决定机器人表情
  const firstEq = equity[0]?.equity
  const lastEq = equity[equity.length - 1]?.equity
  const mood =
    firstEq && lastEq
      ? (lastEq - firstEq) / firstEq > 0.002
        ? 'bull'
        : (lastEq - firstEq) / firstEq < -0.002
          ? 'bear'
          : 'flat'
      : 'flat'

  return (
    <div className="relative z-10 h-full flex flex-col gap-3 p-3 select-none">
      {/* 1. 顶部：Agent 监控栏 */}
      <TopBar agents={agents} mood={mood} />

      {/* 2. 中部：左 K 线 60% + 右决策日志 40% */}
      <main className="flex gap-3 flex-1 min-h-0">
        <div className="w-[60%] min-w-0 h-full">
          <KLineChart ref={chartRef} data={candles} symbol="BTC/USDT · 1m" />
        </div>
        <div className="w-[40%] min-w-0 h-full">
          <AgentLog logs={logs} />
        </div>
      </main>

      {/* 3. 底部：资金曲线 */}
      <footer className="h-[26%] shrink-0">
        <PortfolioCurve data={equity} />
      </footer>

      {/* 4. 粉色跑马灯：机器人冷笑话 / 日常播报 */}
      <TickerStrip equity={equity} />
    </div>
  )
}

// 模拟数据引擎：生成 K 线、Agent 日志、资金曲线的伪实时数据
// 接入真实行情时，只需用 WebSocket 数据替换这里的生成器

const AGENT_META = [
  { id: 'master',   name: '主控 AGENT',   en: 'MASTER',   color: '#22D3EE', face: 'serious' },
  { id: 'intel',    name: '情报 AGENT',   en: 'INTEL',    color: '#FFB800', face: 'curious' },
  { id: 'risk',     name: '风控 AGENT',   en: 'RISK',     color: '#FF2E88', face: 'sleepy' },
  { id: 'long',     name: '多头 AGENT',   en: 'LONG',     color: '#00FF9D', face: 'excited' },
  { id: 'short',    name: '空头 AGENT',   en: 'SHORT',    color: '#FF2E88', face: 'cool' },
  { id: 'executor', name: '执行 AGENT',   en: 'EXECUTOR', color: '#B388FF', face: 'happy' },
]

const THOUGHTS = [
  '检测到成交量异常放大，波动率上升 12%',
  'MACD 金叉确认，动能指标转强',
  '盘口卖压减轻，买一至买三挂单增厚',
  '资金费率偏移，多头拥挤度偏高',
  '突破前高阻力位，回踩确认中',
  '回撤触及 2% 警戒线，评估减仓',
  '与情报 Agent 共识度 0.87，信号可信',
  '滑点预估 3bp，在可接受范围内',
  '持仓时长超均值 1.4σ，考虑止盈',
  '链上巨鲸地址异动，相关性 0.62',
]

const ACTIONS = ['HOLD', 'BUY', 'SELL', 'REDUCE', 'ADD', 'CLOSE']

// 系统吐槽彩蛋：偶尔混入一条不正经的 SYSTEM 广播
const EASTER_EGGS = [
  '多头和空头在茶水间偶遇，场面一度十分尴尬 (◕‿◕)',
  '情报 Agent 的请求次数已达标，获得称号：冲浪达人',
  '风控 Agent 第 47 次警告，第 47 次被无视',
  '执行 Agent 的订单滑点比昨天小，奖励自己一次早退',
  '检测到主控机器人偷偷把 "长期持有" 写进了备忘录',
  'SYSTEM：本系统不预测市场，只负责在亏损时陪聊 (；′⌒`)',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min, max) {
  return min + Math.random() * (max - min)
}

// ---------- K 线 ----------
export function generateInitialCandles(count = 240) {
  const candles = []
  let price = 42000
  const now = Math.floor(Date.now() / 1000)
  // 对齐到 1 分钟边界
  const start = now - count * 60
  for (let i = 0; i < count; i++) {
    const open = price
    const close = open * (1 + rand(-0.004, 0.0042))
    const high = Math.max(open, close) * (1 + rand(0, 0.002))
    const low = Math.min(open, close) * (1 - rand(0, 0.002))
    const volume = rand(80, 400) * (1 + Math.abs(close - open) / open * 400)
    candles.push({
      time: start + i * 60,
      open: +open.toFixed(1),
      high: +high.toFixed(1),
      low: +low.toFixed(1),
      close: +close.toFixed(1),
      volume: +volume.toFixed(1),
    })
    price = close
  }
  return candles
}

// 生成下一根实时 bar（模拟）
export function nextRealtimeBar(last) {
  const open = last.close
  const close = open * (1 + rand(-0.003, 0.0032))
  const high = Math.max(open, close) * (1 + rand(0, 0.0015))
  const low = Math.min(open, close) * (1 - rand(0, 0.0015))
  return {
    time: last.time + 60,
    open: +open.toFixed(1),
    high: +high.toFixed(1),
    low: +low.toFixed(1),
    close: +close.toFixed(1),
    volume: +rand(80, 400).toFixed(1),
  }
}

// ---------- Agent ----------
let logSeq = 0
export function nextAgentLog() {
  // ~12% 概率刷出一条系统彩蛋
  if (Math.random() < 0.12) {
    logSeq += 1
    return {
      id: `${Date.now()}-${logSeq}`,
      seq: logSeq,
      ts: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      agent: { id: 'system', en: 'SYSTEM', color: '#FF2E88' },
      thought: pick(EASTER_EGGS),
      decision: { action: 'CHILL', confidence: 1.0, size: 0 },
    }
  }
  const agent = pick(AGENT_META)
  const action = pick(ACTIONS)
  const confidence = rand(0.5, 0.98)
  logSeq += 1
  return {
    id: `${Date.now()}-${logSeq}`,
    seq: logSeq,
    ts: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    agent,
    thought: pick(THOUGHTS),
    decision: { action, confidence: +confidence.toFixed(2), size: +(rand(0.01, 0.5)).toFixed(3) },
  }
}

export function initialAgents() {
  return AGENT_META.map((a) => ({
    ...a,
    status: Math.random() > 0.4 ? 'working' : 'idle',
    lastSay: pick(THOUGHTS),
    lastActive: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
  }))
}

// 随机翻转某个 Agent 的状态与发言
export function tickAgents(agents) {
  const idx = Math.floor(Math.random() * agents.length)
  return agents.map((a, i) =>
    i === idx
      ? {
          ...a,
          status: Math.random() > 0.35 ? 'working' : 'idle',
          lastSay: pick(THOUGHTS),
          lastActive: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        }
      : a
  )
}

// ---------- 资金曲线 ----------
export function generateInitialEquity(count = 120) {
  const data = []
  let equity = 1_000_000
  const now = Math.floor(Date.now() / 1000)
  for (let i = 0; i < count; i++) {
    equity *= 1 + rand(-0.002, 0.0026)
    data.push({
      time: new Date((now - (count - i) * 300) * 1000).toLocaleTimeString('zh-CN', { hour12: false }),
      equity: +equity.toFixed(0),
    })
  }
  return data
}

export function nextEquityPoint(lastEquity) {
  const equity = lastEquity * (1 + rand(-0.002, 0.0026))
  return {
    time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    equity: +equity.toFixed(0),
  }
}

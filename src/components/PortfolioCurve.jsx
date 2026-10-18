import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// 底部：账户总资产曲线（recharts 绿色面积图）
export default function PortfolioCurve({ data }) {
  const latest = data[data.length - 1]
  const first = data[0]
  const pnl = latest && first ? latest.equity - first.equity : 0
  const pnlPct = first ? (pnl / first.equity) * 100 : 0
  const positive = pnl >= 0

  return (
    <section className="card-cyber flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2D3139]">
        <span className="text-neon-green glow-green font-bold tracking-wider">
          资金曲线 · TOTAL EQUITY
        </span>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-text-dim">
            最新 <span className="text-[#D7DBE2]">¥{latest?.equity.toLocaleString()}</span>
          </span>
          <span className={positive ? 'text-neon-green glow-green' : 'text-neon-pink glow-pink'}>
            {positive ? '▲' : '▼'} {positive ? '+' : ''}¥{Math.abs(pnl).toLocaleString()} ({pnlPct.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 px-2 py-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF9D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00FF9D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2D3139" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#5A6272"
              tick={{ fill: '#8B93A3', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              minTickGap={60}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#5A6272"
              tick={{ fill: '#8B93A3', fontSize: 10, fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 10000).toFixed(1)}w`}
              width={52}
            />
            <Tooltip
              contentStyle={{
                background: '#1A1D24',
                border: '1px solid #2D3139',
                borderRadius: 6,
                fontFamily: 'monospace',
                fontSize: 11,
              }}
              labelStyle={{ color: '#8B93A3' }}
              itemStyle={{ color: '#00FF9D' }}
              formatter={(value) => [`¥${Number(value).toLocaleString()}`, '总资产']}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#00FF9D"
              strokeWidth={2}
              fill="url(#equityFill)"
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

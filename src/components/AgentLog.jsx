import { useEffect, useRef } from 'react'

const ACTION_STYLE = {
  BUY:   { color: '#00FF9D', label: '买入' },
  ADD:   { color: '#00FF9D', label: '加仓' },
  SELL:  { color: '#FF2E88', label: '卖出' },
  REDUCE:{ color: '#FF2E88', label: '减仓' },
  CLOSE: { color: '#FF2E88', label: '平仓' },
  HOLD:  { color: '#8B93A3', label: '持有' },
  CHILL: { color: '#FFB800', label: '摸鱼中' },
}

// 右侧：AI 决策日志，实时滚动打印
export default function AgentLog({ logs }) {
  const boxRef = useRef(null)

  // 新日志到达时自动滚到底部
  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <section className="card-cyber flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2D3139]">
        <span className="text-neon-pink glow-pink font-bold tracking-wider">AI 决策日志</span>
        <span className="text-[10px] text-text-dim">
          {logs.length} msgs
        </span>
      </div>

      <div ref={boxRef} className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1.5">
        {logs.map((log) => {
          const style = ACTION_STYLE[log.decision.action] ?? ACTION_STYLE.HOLD
          const isBuySide = style.color === '#00FF9D'
          return (
            <div key={log.id} className="log-item card-cyber px-2.5 py-2">
              {/* 头部：时间 + Agent */}
              <div className="flex items-center justify-between">
                <span className="text-[10px]" style={{ color: log.agent.color }}>
                  [{log.agent.en}] #{log.seq}
                </span>
                <span className="text-[9px] text-[#5A6272]">{log.ts}</span>
              </div>

              {/* 思考过程 */}
              <div className="text-[11px] text-[#C6CBD6] mt-1 leading-snug">
                <span className="text-text-dim">thought&gt;</span> {log.thought}
              </div>

              {/* 决策 JSON */}
              <pre
                className={`text-[10px] mt-1.5 px-2 py-1 rounded overflow-x-auto ${
                  isBuySide ? 'glow-green' : log.decision.action === 'HOLD' ? '' : 'glow-pink'
                }`}
                style={{
                  background: '#12131A',
                  borderLeft: `2px solid ${style.color}`,
                  color: style.color,
                }}
              >
{`{
  "action": "${log.decision.action}",      // ${style.label}
  "confidence": ${log.decision.confidence},
  "size": ${log.decision.size}
}`}
              </pre>
            </div>
          )
        })}
      </div>
    </section>
  )
}

import RobotAvatar from './RobotAvatar.jsx'

// 行情心情 → 各 Agent 的表情映射（亏钱时多头会哭，空头会偷笑）
const MOOD_FACES = {
  bull: { master: 'cool', intel: 'excited', risk: 'sleepy', long: 'excited', short: 'sad', executor: 'happy' },
  bear: { master: 'serious', intel: 'curious', risk: 'excited', long: 'cry', short: 'cool', executor: 'sad' },
  flat: null, // 用默认表情
}

// 顶部状态栏：6 个 AI Agent 监控卡片（圆脸小机器人版，表情随行情联动）
export default function TopBar({ agents, mood = 'flat' }) {
  const moodMap = MOOD_FACES[mood]
  return (
    <header className="card-cyber flex items-stretch gap-3 px-4 py-3">
      {/* Logo 区 */}
      <div className="flex items-center gap-2.5 pr-4 border-r border-[#33202E] shrink-0">
        <div className="floaty">
          <RobotAvatar color="#FF2E88" face="excited" size={40} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-neon-pink glow-pink font-bold tracking-widest text-sm">
            more<span className="text-neon-cyan glow-cyan">b1essed</span>
          </div>
          <div className="text-text-dim text-[10px] tracking-wider mt-0.5">
            MULTI-AGENT v2.1.4
          </div>
        </div>
      </div>

      {/* 6 个 Agent 卡片 */}
      <div className="grid grid-cols-6 gap-3 flex-1 min-w-0">
        {agents.map((a) => {
          const working = a.status === 'working'
          const face = (moodMap && moodMap[a.id]) || a.face
          return (
            <div
              key={a.id}
              className={`card-cyber px-3 py-2 min-w-0 transition-all ${
                working ? 'border-l-2' : 'opacity-75'
              }`}
              style={working ? { borderLeftColor: a.color } : undefined}
            >
              <div className="flex items-center gap-2">
                <span className={working ? 'floaty' : ''} style={{ animationDelay: `${Math.random() * 2}s` }}>
                  <RobotAvatar color={a.color} face={face} size={28} working={working} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold truncate" style={{ color: a.color }}>
                      {a.name}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <span
                        className={`w-1.5 h-1.5 rounded-full blink-dot ${
                          working ? 'bg-neon-green' : 'bg-[#4A5160]'
                        }`}
                      />
                      <span
                        className={`text-[9px] ${
                          working ? 'text-neon-green glow-green' : 'text-text-dim'
                        }`}
                      >
                        {working ? '工作中' : '等待'}
                      </span>
                    </span>
                  </div>
                  <div className="text-[10px] text-text-dim truncate mt-1" title={a.lastSay}>
                    {a.lastSay}
                  </div>
                  <div className="text-[9px] text-[#5A6272] mt-0.5">{a.lastActive}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </header>
  )
}

// 底部粉色跑马灯：量化冷笑话 + 机器人日常播报
// 内容重复两份做无缝循环滚动

const QUOTES = [
  '主控机器人：今天也是全仓信仰的一天 (◕‿◕)',
  '情报 Agent 偷看到巨鲸在喝咖啡，价格波动 +0.3%',
  '风控 Agent：回撤 2%？我先紧张一下 (；′⌒`)',
  '多头 Agent：DCA！DCA！跌了就 DCA！',
  '空头 Agent：我就说这要跌 (¬‿¬)',
  '执行 Agent：滑点 3bp，比外卖准时率还稳',
  'SYSTEM：多头与空头达成暂时停火协议，有效期 1 根 K 线',
  '今日小目标：跑赢沪深 300，以及楼下煎饼摊的毛利率',
  '情报 Agent：链上数据说，Diamond Hands 正在加仓',
  '风控 Agent 提醒：别把回测当许愿池 (╯°□°)╯',
  '执行 Agent：订单已成交，手续费比奶茶便宜',
  '主控机器人：止损不是认输，是换个姿势再来 ╰(°▽°)╯',
]

const MOOD_LABEL = {
  bull: '市场心情：亢奋 ✦',
  bear: '市场心情：恐慌 ≋',
  flat: '市场心情：摸鱼中 ∿',
}

export default function TickerStrip({ equity }) {
  const first = equity[0]?.equity
  const last = equity[equity.length - 1]?.equity
  const mood =
    first && last
      ? (last - first) / first > 0.002
        ? 'bull'
        : (last - first) / first < -0.002
          ? 'bear'
          : 'flat'
      : 'flat'

  const items = [...QUOTES, MOOD_LABEL[mood]]

  const Row = () => (
    <div className="flex shrink-0 items-center">
      {items.map((q, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="mx-6 text-neon-pink">◆</span>
          <span className="text-[#FFD6EC]">{q}</span>
        </span>
      ))}
    </div>
  )

  return (
    <div className="h-8 shrink-0 rounded-lg border border-[#33202E] bg-[#171922]/90 backdrop-blur overflow-hidden flex items-center relative">
      {/* 渐变遮罩，让滚动两端有淡出感 */}
      <div className="absolute inset-y-0 left-0 w-10 z-10 pointer-events-none bg-gradient-to-r from-[#171922] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-10 z-10 pointer-events-none bg-gradient-to-l from-[#171922] to-transparent" />
      <div className="marquee flex">
        <Row />
        <Row />
      </div>
    </div>
  )
}

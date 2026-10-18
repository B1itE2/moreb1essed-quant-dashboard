// 圆脸小机器人头像：每只 Agent 一张脸，眼睛会眨，表情各不相同
const FACES = {
  happy:   { eye: 'dot',   mouth: 'smile' },
  serious: { eye: 'line',  mouth: 'flat' },
  sleepy:  { eye: 'half',  mouth: 'o' },
  excited: { eye: 'star',  mouth: 'open' },
  cool:    { eye: 'shade', mouth: 'smirk' },
  curious: { eye: 'dot',   mouth: 'w' },
  sad:     { eye: 'dot',   mouth: 'frown' },
  cry:     { eye: 'tear',  mouth: 'wavy' },
}

export default function RobotAvatar({ color, face = 'happy', size = 30, working = true }) {
  const f = FACES[face] ?? FACES.happy
  const id = `${color.replace('#', '')}-${face}-${size}`

  const eyeY = 20
  const eyeL = 11
  const eyeR = 21

  const renderEye = (cx) => {
    switch (f.eye) {
      case 'line':
        return <rect x={cx - 3} y={eyeY - 0.75} width="6" height="1.5" rx="0.75" fill="#12131A" />
      case 'half':
        return <rect x={cx - 3} y={eyeY - 1.5} width="6" height="2.6" rx="1.3" fill="#12131A" />
      case 'star':
        return <text x={cx} y={eyeY + 2.6} textAnchor="middle" fontSize="7" fill="#12131A">★</text>
      case 'shade':
        return (
          <g>
            <rect x={cx - 3.6} y={eyeY - 2.6} width="7.2" height="4.6" rx="2.2" fill="#12131A" />
            <rect x={cx - 3.6} y={eyeY - 3.6} width="7.2" height="1.3" rx="0.65" fill="#12131A" />
          </g>
        )
      case 'tear':
        // > < 眼：亏钱专用
        return (
          <g>
            <path d={`M${cx - 3.4} ${eyeY - 2.4} L${cx + 3.4} ${eyeY + 2.4} M${cx + 3.4} ${eyeY - 2.4} L${cx - 3.4} ${eyeY + 2.4}`} stroke="#12131A" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )
      default:
        return <circle className="robot-eye" cx={cx} cy={eyeY} r="2.2" fill="#12131A" />
    }
  }

  const renderMouth = () => {
    switch (f.mouth) {
      case 'flat':
        return <rect x="12" y="25.4" width="8" height="1.4" rx="0.7" fill="#12131A" />
      case 'o':
        return <circle cx="16" cy="25.6" r="1.8" fill="#12131A" />
      case 'open':
        return <path d="M11.5 24.4 Q16 29 20.5 24.4 Z" fill="#12131A" />
      case 'smirk':
        return <path d="M12 25 Q17 27 20 23.8" stroke="#12131A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      case 'w':
        return <path d="M11 24.8 Q13.5 27 16 24.8 Q18.5 27 21 24.8" stroke="#12131A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      case 'frown':
        return <path d="M11.5 26.5 Q16 22.5 20.5 26.5" stroke="#12131A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      case 'wavy':
        // 波浪嘴：强忍泪水
        return <path d="M11 25.5 Q13 23.5 16 25.5 Q19 27.5 21 24.5" stroke="#12131A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      default:
        return <path d="M11.5 24 Q16 28 20.5 24" stroke="#12131A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={working ? '' : 'opacity-60'}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bot-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* 天线 */}
      <line x1="16" y1="4.5" x2="16" y2="8" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle className={working ? 'blink-dot' : ''} cx="16" cy="3.4" r="1.7" fill={color} />
      {/* 圆脸 */}
      <rect x="4" y="8" width="24" height="21" rx="9" fill={`url(#bot-${id})`} />
      <rect x="4" y="8" width="24" height="21" rx="9" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      {/* 眼睛 & 嘴 */}
      {renderEye(eyeL)}
      {renderEye(eyeR)}
      {renderMouth()}
      {/* 腮红 */}
      <ellipse cx="8" cy="24" rx="1.6" ry="1" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="24" cy="24" rx="1.6" ry="1" fill="rgba(255,255,255,0.35)" />
    </svg>
  )
}

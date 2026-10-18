import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { createChart, CandlestickSeries, HistogramSeries } from 'lightweight-charts'

/**
 * K 线主图（lightweight-charts v5）
 *
 * 对外暴露的实时数据接口（通过 ref）：
 *   const chartRef = useRef()
 *   <KLineChart ref={chartRef} data={candles} />
 *   // 接入 WebSocket 后，把行情推给图表：
 *   chartRef.current?.appendRealtimeBar({ time, open, high, low, close, volume })
 *
 * 约定：time 为 Unix 秒（UTC），与初始数据同精度。
 */
function KLineChart({ data, symbol = 'BTC/USDT · 1m' }, ref) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const volumeRef = useRef(null)
  const lastCloseRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: '#8B93A3',
        fontFamily: '"JetBrains Mono", Consolas, monospace',
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(45, 49, 57, 0.5)' },
        horzLines: { color: 'rgba(45, 49, 57, 0.5)' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#22D3EE', labelBackgroundColor: '#22D3EE' },
        horzLine: { color: '#22D3EE', labelBackgroundColor: '#22D3EE' },
      },
      rightPriceScale: { borderColor: '#2D3139' },
      timeScale: {
        borderColor: '#2D3139',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    // K 线序列：荧光绿涨 / 霓虹粉跌
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF9D',
      downColor: '#FF2E88',
      wickUpColor: '#00FF9D',
      wickDownColor: '#FF2E88',
      borderUpColor: '#00FF9D',
      borderDownColor: '#FF2E88',
    })

    // 成交量直方图（独立价格轴，压缩到底部）
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    })

    seriesRef.current = candleSeries
    volumeRef.current = volumeSeries
    chartRef.current = chart

    return () => {
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
      volumeRef.current = null
    }
  }, [])

  // 初始 / 历史数据灌入
  useEffect(() => {
    if (!data?.length || !seriesRef.current) return
    seriesRef.current.setData(
      data.map(({ time, open, high, low, close }) => ({ time, open, high, low, close }))
    )
    volumeRef.current.setData(
      data.map(({ time, open, close, volume }) => ({
        time,
        value: volume,
        color: close >= open ? 'rgba(0, 255, 0, 0.35)' : 'rgba(255, 0, 85, 0.35)',
      }))
    )
    lastCloseRef.current = data[data.length - 1].close
    chartRef.current?.timeScale().fitContent()
  }, [data])

  // 对外暴露：实时行情入口（供 WebSocket / 轮询调用）
  useImperativeHandle(ref, () => ({
    appendRealtimeBar(bar) {
      if (!seriesRef.current || !volumeRef.current || !bar) return
      const isUp = lastCloseRef.current == null ? bar.close >= bar.open : bar.close >= lastCloseRef.current
      seriesRef.current.update({
        time: bar.time,
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
      })
      volumeRef.current.update({
        time: bar.time,
        value: bar.volume ?? 0,
        color: isUp ? 'rgba(0, 255, 0, 0.35)' : 'rgba(255, 0, 85, 0.35)',
      })
      lastCloseRef.current = bar.close
    },
  }), [])

  return (
    <section className="card-cyber flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2D3139]">
        <div className="flex items-center gap-3">
          <span className="text-neon-cyan font-bold tracking-wider">{symbol}</span>
          <span className="text-[10px] text-text-dim border border-[#2D3139] rounded px-1.5 py-0.5">
            lightweight-charts v5
          </span>
        </div>
        <div className="text-[10px] text-text-dim">
          LIVE FEED <span className="text-neon-green blink-dot">●</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0 grid-overlay" />
    </section>
  )
}

export default forwardRef(KLineChart)

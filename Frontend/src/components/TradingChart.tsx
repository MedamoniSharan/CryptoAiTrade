import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface TradingChartProps {
  data: {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  pair: string;
}

export function TradingChart({ data: initialData, pair }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      crosshair: {
        mode: 0,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Update data every second
    const interval = setInterval(() => {
      const lastCandle = data[data.length - 1];
      const lastPrice = lastCandle.close;
      
      // Generate new price with small random change
      const change = lastPrice * (0.001 * (Math.random() - 0.5));
      const newPrice = lastPrice + change;
      
      // Create new candle with Unix timestamp
      const newCandle = {
        time: Math.floor(Date.now() / 1000),
        open: lastPrice,
        close: newPrice,
        high: Math.max(lastPrice, newPrice) + Math.abs(change) * Math.random(),
        low: Math.min(lastPrice, newPrice) - Math.abs(change) * Math.random(),
      };

      // Update data array ensuring unique timestamps
      const newData = [...data.slice(1), newCandle].map((candle, index, arr) => ({
        ...candle,
        time: Math.floor(Date.now() / 1000) - (arr.length - index - 1),
      }));
      
      setData(newData);
      candlestickSeries.setData(newData);
    }, 1000); // Update every second

    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-full" />;
}
'use client';

import React from 'react';
import { cn } from '@/lib/utils'; // Assuming cn is available here for styling
import { ChartData, SparklineData } from '@/lib/types'; // Import types

interface BarChartProps {
  data: ChartData;
  className?: string;
}

export function BarChart({ data, className }: BarChartProps) {
  const maxDataValue = Math.max(...data.datasets.flatMap(d => d.data));
  const height = 150; // Fixed height for simplicity
  const barWidth = 20; // Fixed width for bars
  const gap = 10; // Gap between bars
  const totalBarSets = data.labels.length;
  const barsPerSet = data.datasets.length;
  const totalWidth = totalBarSets * (barWidth * barsPerSet + gap) + gap;

  return (
    <div className={cn("relative w-full overflow-x-auto", className)}>
      <svg
        width={totalWidth}
        height={height + 30} // +30 for labels
        viewBox={`0 0 ${totalWidth} ${height + 30}`}
        className="text-zinc-600"
      >
        {/* Y-axis labels (optional, can be added if needed) */}
        {/* <line x1="40" y1="0" x2="40" y2={height} stroke="currentColor" strokeWidth="1" opacity="0.2"/> */}

        {/* Bars */}
        {data.labels.map((label, i) => (
          <g key={label} transform={`translate(${i * (barWidth * barsPerSet + gap) + gap}, 0)`}>
            {data.datasets.map((dataset, j) => {
              const barHeight = (dataset.data[i] / maxDataValue) * height;
              return (
                <rect
                  key={`${label}-${dataset.label}`}
                  x={j * barWidth}
                  y={height - barHeight}
                  width={barWidth - 2} // Slightly smaller for visual separation
                  height={barHeight}
                  className={cn(dataset.color || 'fill-zinc-900', 'transition-all duration-300 ease-out')}
                  rx="2"
                  ry="2"
                />
              );
            })}
            <text
              x={ (barWidth * barsPerSet - 2) / 2 } // Center text under the group of bars
              y={height + 20}
              fontSize="12"
              textAnchor="middle"
              className="fill-zinc-600"
            >
              {label}
            </text>
          </g>
        ))}
        {/* X-axis line */}
        <line x1="0" y1={height} x2={totalWidth} y2={height} stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      </svg>
    </div>
  );
}

interface SparklineProps {
  data: SparklineData;
  className?: string;
  lineColor?: string; // Tailwind color class, e.g., 'stroke-emerald-500'
  fillColor?: string; // Tailwind color class, e.g., 'fill-emerald-500/20'
}

export function Sparkline({ data, className, lineColor = 'stroke-zinc-900', fillColor = 'fill-zinc-900/10' }: SparklineProps) {
  if (!data || data.data.length < 2) {
    return (
      <div className={cn("flex items-center justify-center h-full text-zinc-400 text-sm", className)}>
        Not enough data
      </div>
    );
  }

  const values = data.data;
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal;

  const width = 100;
  const height = 30;
  const pointSpacing = width / (values.length - 1);

  const points = values.map((val, i) => {
    const x = i * pointSpacing;
    const y = range === 0 ? height / 2 : height - ((val - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  // Create path for area fill
  const areaPath = `M0,${height} ${points} L${width},${height} Z`;

  return (
    <div className={cn("flex-shrink-0", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full h-full">
        <path d={areaPath} className={cn(fillColor)} fillOpacity="1" />
        <polyline
          fill="none"
          className={cn(lineColor, "stroke-2")}
          points={points}
        />
      </svg>
    </div>
  );
}
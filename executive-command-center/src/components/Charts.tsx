'use client';

import React, { useState } from 'react';

export interface PieChartSegment {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartSegment[];
  size?: number;
  donut?: boolean;
  centerText?: string;
  centerSubtitle?: string;
}

export function PieChart({ data, size = 180, donut = true, centerText, centerSubtitle }: PieChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-slate-400 text-xs font-medium">
        No chart data available
      </div>
    );
  }

  const radius = size / 2;
  const strokeWidth = donut ? radius * 0.45 : radius;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  let cumulativeAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((slice, i) => {
            const percentage = slice.value / total;
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += percentage;

            const isHovered = hoveredIdx === i;

            return (
              <circle
                key={i}
                cx={radius}
                cy={radius}
                r={normalizedRadius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {donut && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {hoveredIdx !== null ? (
              <>
                <span className="text-base font-extrabold text-slate-900">{data[hoveredIdx].value}</span>
                <span className="text-[11px] font-semibold text-slate-500">{data[hoveredIdx].label}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-black text-slate-900">{centerText || total}</span>
                <span className="text-[11px] font-medium text-slate-500">{centerSubtitle || 'Total'}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs">
        {data.map((slice, i) => {
          const pct = Math.round((slice.value / total) * 100);
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between gap-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                hoveredIdx === i ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-slate-800 font-medium">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-slate-600">
                <span className="font-bold text-slate-900">{slice.value}</span>
                <span className="text-[10px] text-slate-400">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface HorizontalBarProps {
  data: { label: string; value: number; max: number; color: string }[];
}

export function HorizontalBarChart({ data }: HorizontalBarProps) {
  return (
    <div className="space-y-3 text-xs">
      {data.map((item, i) => {
        const pct = item.max > 0 ? Math.min(100, Math.round((item.value / item.max) * 100)) : 0;
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">{item.label}</span>
              <span className="font-mono text-slate-600 font-bold">
                {item.value.toLocaleString()} / {item.max.toLocaleString()} ({pct}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

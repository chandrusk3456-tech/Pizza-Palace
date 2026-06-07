import React from 'react';

const RevenueChart = ({ data = [] }) => {
  const chartHeight = 200;
  const chartWidth = 500;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-neutral-400 font-bold uppercase tracking-wider bg-neutralLight rounded-2xl">
        No sales data available
      </div>
    );
  }

  // Find max sales for scaling y
  const salesValues = data.map(d => d.sales);
  const maxSales = Math.max(...salesValues, 500); // default min scale limit to 500
  const yMax = Math.ceil(maxSales / 100) * 100; // round up to nearest 100

  // Calculate SVG Coordinates
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - (d.sales / yMax) * graphHeight;
    return { x, y, value: d.sales, date: d.date };
  });

  // Generate SVG Line path
  const linePath = points.reduce((acc, point, index) => {
    return acc + `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
  }, '');

  // Generate Gradient Area path underneath the line
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  // Y-axis grid helper
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }, (_, i) => {
    const value = (yMax / (gridLinesCount - 1)) * i;
    const y = paddingTop + graphHeight - (value / yMax) * graphHeight;
    return { y, value: Math.round(value) };
  });

  return (
    <div className="w-full overflow-x-auto select-none">
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
        className="w-full min-w-[450px] font-sans"
      >
        <defs>
          {/* Crimson Red to transparent gradient */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C0392B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#C0392B" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {gridLines.map((line, idx) => (
          <g key={idx} className="opacity-40">
            <line 
              x1={paddingLeft} 
              y1={line.y} 
              x2={chartWidth - paddingRight} 
              y2={line.y} 
              stroke="#EAECEE" 
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            {/* Y axis labels */}
            <text 
              x={paddingLeft - 10} 
              y={line.y + 4} 
              textAnchor="end" 
              className="text-[9px] fill-neutral-400 font-extrabold"
            >
              ₹{line.value}
            </text>
          </g>
        ))}

        {/* Gradient Fill Under Line */}
        {areaPath && (
          <path d={areaPath} fill="url(#chartGradient)" />
        )}

        {/* Main Line path */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="#C0392B" 
            strokeWidth={3} 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        )}

        {/* Data points (circles with price overlays) */}
        {points.map((pt, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle 
              cx={pt.x} 
              cy={pt.y} 
              r={4} 
              fill="#C0392B" 
              stroke="#FFF" 
              strokeWidth={1.5}
              className="transition-all hover:r-6"
            />
            {/* Mini Sales Label tooltip on hover */}
            <text 
              x={pt.x} 
              y={pt.y - 10} 
              textAnchor="middle" 
              className="text-[9px] font-extrabold fill-neutralDark opacity-0 hover:opacity-100 transition-opacity bg-white"
            >
              ₹{pt.value}
            </text>
          </g>
        ))}

        {/* X Axis Date labels */}
        {points.map((pt, idx) => (
          <text 
            key={idx} 
            x={pt.x} 
            y={chartHeight - 10} 
            textAnchor="middle" 
            className="text-[9px] fill-neutral-400 font-bold uppercase tracking-wider"
          >
            {pt.date}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default RevenueChart;

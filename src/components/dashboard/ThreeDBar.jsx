import React from 'react';

// Helper function to create a darker shade of a color for the 3D effect
const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
};

export const ThreeDBar = (props) => {
  const { x, y, width, height, fill } = props;
  const topSideFill = darkenColor(fill, -20); // Darker shade for top/side
  const barWidth = Math.max(width, 1); // Ensure width is at least 1
  const depth = 5; // How "deep" the 3D effect looks

  return (
    <g>
      {/* Side face */}
      <path
        d={`M${x + barWidth},${y} L${x + barWidth + depth},${y - depth} L${x + barWidth + depth},${y + height - depth} L${x + barWidth},${y + height} Z`}
        fill={topSideFill}
      />
      {/* Top face */}
      <path
        d={`M${x},${y} L${x + depth},${y - depth} L${x + barWidth + depth},${y - depth} L${x + barWidth},${y} Z`}
        fill={topSideFill}
      />
      {/* Front face */}
      <rect x={x} y={y} width={barWidth} height={height} fill={fill} />
    </g>
  );
};
import React, { useState, useEffect, useRef } from 'react';

const CalculusAnimation = () => {
  const [mode, setMode] = useState('derivative'); // 'derivative' or 'integral'
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dx, setDx] = useState(1.5);
  const [numRects, setNumRects] = useState(5);
  const animationRef = useRef(null);

  // 3Blue1Brown color palette
  const colors = {
    background: '#1c1c1c',
    axes: '#888888',
    function: '#58C4DD', // Blue
    derivative: '#FFFF00', // Yellow
    tangent: '#FF8C00', // Orange
    integral: '#83C167', // Green
    area: 'rgba(131, 193, 103, 0.4)',
    text: '#FFFFFF',
    grid: '#333333',
    dx: '#FC6255', // Red
  };

  // Graph dimensions
  const width = 800;
  const height = 500;
  const padding = 60;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Scale functions
  const xMin = -1, xMax = 5;
  const yMin = -2, yMax = 10;
  
  const scaleX = (x) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
  const scaleY = (y) => height - padding - ((y - yMin) / (yMax - yMin)) * graphHeight;

  // Function: f(x) = x²
  const f = (x) => x * x;
  const fPrime = (x) => 2 * x; // Derivative

  // Generate function path
  const generatePath = (func, start, end, steps = 200) => {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const x = start + (i / steps) * (end - start);
      const y = func(x);
      if (y >= yMin - 1 && y <= yMax + 1) {
        points.push(`${i === 0 ? 'M' : 'L'} ${scaleX(x)} ${scaleY(y)}`);
      }
    }
    return points.join(' ');
  };

  // Animation control
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setAnimationPhase(prev => {
          if (mode === 'derivative') {
            // Animate dx shrinking
            const newDx = Math.max(0.1, prev - 0.02);
            setDx(newDx);
            if (newDx <= 0.1) {
              setIsPlaying(false);
              return 0.1;
            }
            return newDx;
          } else {
            // Animate number of rectangles increasing
            const newNum = Math.min(50, Math.floor(prev) + 1);
            setNumRects(newNum);
            if (newNum >= 50) {
              setIsPlaying(false);
              return 50;
            }
            return newNum;
          }
        });
      }, 100);
    }
    return () => clearInterval(animationRef.current);
  }, [isPlaying, mode]);

  const resetAnimation = () => {
    setIsPlaying(false);
    if (mode === 'derivative') {
      setDx(1.5);
      setAnimationPhase(1.5);
    } else {
      setNumRects(5);
      setAnimationPhase(5);
    }
  };

  const startAnimation = () => {
    if (mode === 'derivative') {
      setAnimationPhase(dx);
    } else {
      setAnimationPhase(numRects);
    }
    setIsPlaying(true);
  };

  // Grid lines
  const renderGrid = () => {
    const lines = [];
    // Vertical lines
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      lines.push(
        <line
          key={`v${x}`}
          x1={scaleX(x)}
          y1={padding}
          x2={scaleX(x)}
          y2={height - padding}
          stroke={colors.grid}
          strokeWidth="1"
        />
      );
    }
    // Horizontal lines
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      lines.push(
        <line
          key={`h${y}`}
          x1={padding}
          y1={scaleY(y)}
          x2={width - padding}
          y2={scaleY(y)}
          stroke={colors.grid}
          strokeWidth="1"
        />
      );
    }
    return lines;
  };

  // Axes
  const renderAxes = () => (
    <>
      {/* X axis */}
      <line
        x1={padding}
        y1={scaleY(0)}
        x2={width - padding}
        y2={scaleY(0)}
        stroke={colors.axes}
        strokeWidth="2"
      />
      {/* Y axis */}
      <line
        x1={scaleX(0)}
        y1={padding}
        x2={scaleX(0)}
        y2={height - padding}
        stroke={colors.axes}
        strokeWidth="2"
      />
      {/* Axis labels */}
      {[1, 2, 3, 4].map(x => (
        <text
          key={`xl${x}`}
          x={scaleX(x)}
          y={scaleY(0) + 20}
          fill={colors.text}
          textAnchor="middle"
          fontSize="14"
        >
          {x}
        </text>
      ))}
      {[2, 4, 6, 8].map(y => (
        <text
          key={`yl${y}`}
          x={scaleX(0) - 15}
          y={scaleY(y) + 5}
          fill={colors.text}
          textAnchor="end"
          fontSize="14"
        >
          {y}
        </text>
      ))}
    </>
  );

  // Derivative visualization
  const renderDerivative = () => {
    const x0 = 2;
    const y0 = f(x0);
    const x1 = x0 + dx;
    const y1 = f(x1);
    const dy = y1 - y0;
    const slope = dy / dx;

    // Tangent line (at the limit)
    const tangentSlope = fPrime(x0);
    const tangentX1 = x0 - 1.5;
    const tangentX2 = x0 + 1.5;
    const tangentY1 = y0 + tangentSlope * (tangentX1 - x0);
    const tangentY2 = y0 + tangentSlope * (tangentX2 - x0);

    return (
      <>
        {/* Triangle showing rise/run */}
        <polygon
          points={`${scaleX(x0)},${scaleY(y0)} ${scaleX(x1)},${scaleY(y0)} ${scaleX(x1)},${scaleY(y1)}`}
          fill="rgba(255, 140, 0, 0.2)"
          stroke={colors.tangent}
          strokeWidth="2"
        />
        
        {/* dx label */}
        <line
          x1={scaleX(x0)}
          y1={scaleY(y0) + 5}
          x2={scaleX(x1)}
          y2={scaleY(y0) + 5}
          stroke={colors.dx}
          strokeWidth="3"
        />
        <text
          x={(scaleX(x0) + scaleX(x1)) / 2}
          y={scaleY(y0) + 25}
          fill={colors.dx}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          dx = {dx.toFixed(2)}
        </text>

        {/* dy label */}
        <line
          x1={scaleX(x1) + 5}
          y1={scaleY(y0)}
          x2={scaleX(x1) + 5}
          y2={scaleY(y1)}
          stroke={colors.derivative}
          strokeWidth="3"
        />
        <text
          x={scaleX(x1) + 25}
          y={(scaleY(y0) + scaleY(y1)) / 2}
          fill={colors.derivative}
          textAnchor="start"
          fontSize="16"
          fontWeight="bold"
        >
          dy = {dy.toFixed(2)}
        </text>

        {/* Secant line */}
        <line
          x1={scaleX(x0 - 0.5)}
          y1={scaleY(y0 - slope * 0.5)}
          x2={scaleX(x1 + 0.5)}
          y2={scaleY(y1 + slope * 0.5)}
          stroke={colors.tangent}
          strokeWidth="2"
          strokeDasharray="8,4"
        />

        {/* Tangent line (limit) */}
        <line
          x1={scaleX(tangentX1)}
          y1={scaleY(tangentY1)}
          x2={scaleX(tangentX2)}
          y2={scaleY(tangentY2)}
          stroke={colors.derivative}
          strokeWidth="3"
          opacity={dx < 0.3 ? 1 : 0.3}
        />

        {/* Points */}
        <circle cx={scaleX(x0)} cy={scaleY(y0)} r="6" fill={colors.function} />
        <circle cx={scaleX(x1)} cy={scaleY(y1)} r="6" fill={colors.tangent} />

        {/* Slope display */}
        <text
          x={width - padding - 10}
          y={padding + 30}
          fill={colors.derivative}
          textAnchor="end"
          fontSize="20"
          fontWeight="bold"
        >
          傾き = dy/dx = {slope.toFixed(3)}
        </text>
        <text
          x={width - padding - 10}
          y={padding + 60}
          fill={colors.text}
          textAnchor="end"
          fontSize="16"
        >
          (極限: f'(2) = 4)
        </text>
      </>
    );
  };

  // Integral visualization (Riemann sum)
  const renderIntegral = () => {
    const a = 0;
    const b = 3;
    const rectWidth = (b - a) / numRects;
    const rects = [];
    let totalArea = 0;

    for (let i = 0; i < numRects; i++) {
      const x = a + i * rectWidth;
      const y = f(x + rectWidth / 2); // Midpoint rule
      totalArea += y * rectWidth;
      
      rects.push(
        <rect
          key={`rect${i}`}
          x={scaleX(x)}
          y={scaleY(y)}
          width={scaleX(x + rectWidth) - scaleX(x)}
          height={scaleY(0) - scaleY(y)}
          fill={colors.area}
          stroke={colors.integral}
          strokeWidth="1"
        />
      );
    }

    // True integral value: ∫x² dx from 0 to 3 = [x³/3] = 27/3 = 9
    const trueArea = 9;

    return (
      <>
        {/* Rectangles */}
        {rects}
        
        {/* Bounds markers */}
        <line
          x1={scaleX(a)}
          y1={scaleY(0) - 10}
          x2={scaleX(a)}
          y2={scaleY(0) + 10}
          stroke={colors.integral}
          strokeWidth="3"
        />
        <text
          x={scaleX(a)}
          y={scaleY(0) + 30}
          fill={colors.integral}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          a = 0
        </text>
        
        <line
          x1={scaleX(b)}
          y1={scaleY(0) - 10}
          x2={scaleX(b)}
          y2={scaleY(0) + 10}
          stroke={colors.integral}
          strokeWidth="3"
        />
        <text
          x={scaleX(b)}
          y={scaleY(0) + 30}
          fill={colors.integral}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
        >
          b = 3
        </text>

        {/* Area display */}
        <text
          x={width - padding - 10}
          y={padding + 30}
          fill={colors.integral}
          textAnchor="end"
          fontSize="20"
          fontWeight="bold"
        >
          矩形数: {numRects}
        </text>
        <text
          x={width - padding - 10}
          y={padding + 60}
          fill={colors.text}
          textAnchor="end"
          fontSize="18"
        >
          近似面積: {totalArea.toFixed(3)}
        </text>
        <text
          x={width - padding - 10}
          y={padding + 90}
          fill={colors.derivative}
          textAnchor="end"
          fontSize="16"
        >
          (真の積分値: 9)
        </text>
        <text
          x={width - padding - 10}
          y={padding + 120}
          fill={colors.text}
          textAnchor="end"
          fontSize="14"
        >
          誤差: {Math.abs(totalArea - trueArea).toFixed(3)}
        </text>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen" style={{ backgroundColor: colors.background }}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
        微分積分の視覚化
      </h1>
      <p className="text-lg mb-4" style={{ color: colors.axes }}>
        3Blue1Brown スタイル
      </p>

      {/* Mode selector */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => { setMode('derivative'); resetAnimation(); setDx(1.5); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            mode === 'derivative' 
              ? 'bg-yellow-500 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          微分 (Derivative)
        </button>
        <button
          onClick={() => { setMode('integral'); resetAnimation(); setNumRects(5); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            mode === 'integral' 
              ? 'bg-green-500 text-black' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          積分 (Integral)
        </button>
      </div>

      {/* Main visualization */}
      <svg width={width} height={height} className="rounded-lg shadow-2xl">
        <rect width={width} height={height} fill={colors.background} />
        
        {renderGrid()}
        {renderAxes()}
        
        {/* Function curve */}
        <path
          d={generatePath(f, xMin, xMax)}
          fill="none"
          stroke={colors.function}
          strokeWidth="3"
        />
        
        {/* Mode-specific visualization */}
        {mode === 'derivative' ? renderDerivative() : renderIntegral()}
        
        {/* Function label */}
        <text
          x={scaleX(2.2)}
          y={scaleY(f(2.2)) - 15}
          fill={colors.function}
          fontSize="20"
          fontWeight="bold"
        >
          f(x) = x²
        </text>
      </svg>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 mt-4 p-4 rounded-lg" style={{ backgroundColor: '#2a2a2a' }}>
        {mode === 'derivative' ? (
          <>
            <div className="flex items-center gap-4">
              <label className="text-white">dx: {dx.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={dx}
                onChange={(e) => setDx(parseFloat(e.target.value))}
                className="w-48"
                disabled={isPlaying}
              />
            </div>
            <p className="text-sm" style={{ color: colors.axes }}>
              dx → 0 のとき、傾きは導関数 f'(x) = 2x に収束します
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <label className="text-white">矩形数: {numRects}</label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={numRects}
                onChange={(e) => setNumRects(parseInt(e.target.value))}
                className="w-48"
                disabled={isPlaying}
              />
            </div>
            <p className="text-sm" style={{ color: colors.axes }}>
              矩形数 → ∞ のとき、面積は定積分 ∫₀³ x² dx = 9 に収束します
            </p>
          </>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={startAnimation}
            disabled={isPlaying}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50"
          >
            ▶ アニメーション開始
          </button>
          <button
            onClick={resetAnimation}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500"
          >
            ↺ リセット
          </button>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-6 max-w-2xl p-6 rounded-lg text-sm" style={{ backgroundColor: '#2a2a2a', color: colors.text }}>
        {mode === 'derivative' ? (
          <>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.derivative }}>微分の本質</h3>
            <p className="mb-2">
              微分とは、関数の「瞬間的な変化率」を求めることです。
            </p>
            <p className="mb-2">
              2点間の傾き（変化率）は <span style={{ color: colors.tangent }}>dy/dx</span> で表されます。
              dx を限りなく小さくしていくと、この傾きは点 x での<span style={{ color: colors.derivative }}>接線の傾き</span>に収束します。
            </p>
            <p>
              f(x) = x² の場合、導関数は f'(x) = 2x となり、x = 2 では f'(2) = 4 です。
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-3" style={{ color: colors.integral }}>積分の本質</h3>
            <p className="mb-2">
              積分とは、曲線の下の「面積」を求めることです。
            </p>
            <p className="mb-2">
              <span style={{ color: colors.integral }}>リーマン和</span>は、区間を細かい矩形に分割し、その面積の合計で近似します。
              矩形の数を増やすほど、真の面積に近づきます。
            </p>
            <p>
              ∫₀³ x² dx = [x³/3]₀³ = 27/3 - 0 = 9
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CalculusAnimation;

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface AreaVisualizationProps {
  onComplete?: () => void;
}

export const AreaVisualization: React.FC<AreaVisualizationProps> = ({ onComplete }) => {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [showGrid, setShowGrid] = useState(true);

  const area = width * height;

  return (
    <div className="area-visualization">
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        {showGrid && (
          <Grid
            args={[10, 10]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6366f1"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#4f46e5"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <OrbitControls enableDamping />
      </Canvas>

      <div className="area-controls">
        <h3>面积可视化</h3>
        <div className="formula">
          面积 = 底 × 高 = {width} × {height} = {area}
        </div>
        <div className="sliders">
          <div>
            <label>底: {width}</label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div>
            <label>高: {height}</label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>
        <button onClick={() => setShowGrid(!showGrid)}>
          {showGrid ? '隐藏' : '显示'}网格
        </button>
        <div className="grid-count">
          可以数一数：大约有 {Math.round(area)} 个单位格子
        </div>
        {onComplete && (
          <button className="complete-button" onClick={onComplete}>
            完成
          </button>
        )}
      </div>
    </div>
  );
};

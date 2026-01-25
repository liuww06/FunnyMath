import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface TriangleAnglesProps {
  onComplete?: () => void;
}

export const TriangleAngles: React.FC<TriangleAnglesProps> = ({ onComplete }) => {
  const [angle1, setAngle1] = useState(60);
  const [angle2, setAngle2] = useState(60);

  const angle3 = useMemo(() => 180 - angle1 - angle2, [angle1, angle2]);
  const isValid = useMemo(() => angle3 > 0, [angle3]);

  const vertices = useMemo(() => {
    if (!isValid) {
      return [
        [0, 1, 0],
        [-1, -1, 0],
        [1, -1, 0],
      ];
    }

    const a = (angle1 * Math.PI) / 180;
    const b = (angle2 * Math.PI) / 180;

    return [
      [0, 1, 0],
      [-Math.sin(a), -Math.cos(a), 0],
      [Math.sin(b), -Math.cos(b), 0]
    ];
  }, [angle1, angle2, isValid]);

  return (
    <div className="triangle-content">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={3}
                array={new Float32Array(vertices.flat())}
                itemSize={3}
              />
            </bufferGeometry>
            <meshStandardMaterial color="#10B981" side={THREE.DoubleSide} />
          </mesh>
          <OrbitControls enableDamping />
        </Canvas>
      </div>
      <div className="controls">
        <h3>三角形内角和 = 180°</h3>
        <div className="angle-control">
          <label>角1: {angle1}°</label>
          <input
            type="range"
            min="20"
            max="140"
            value={angle1}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) setAngle1(val);
            }}
          />
        </div>
        <div className="angle-control">
          <label>角2: {angle2}°</label>
          <input
            type="range"
            min="20"
            max="140"
            value={angle2}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) setAngle2(val);
            }}
          />
        </div>
        <div className="angle-display">
          <p>角1: {angle1}°</p>
          <p>角2: {angle2}°</p>
          <p>角3: {angle3 > 0 ? `${angle3.toFixed(1)}°` : '无效'}</p>
          <p className="sum-display">
            内角和: {(angle1 + angle2 + Math.max(0, angle3)).toFixed(1)}°
          </p>
          {isValid && (
            <p className="valid-message">三角形内角和 = 180°</p>
          )}
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

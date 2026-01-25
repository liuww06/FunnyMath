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

    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;
    const rad3 = (angle3 * Math.PI) / 180;

    const side = 2;
    const x1 = 0;
    const y1 = 1;

    const x2 = -Math.sin(rad1) * side;
    const y2 = y1 - Math.cos(rad1) * side;

    const angleAtVertex2 = rad2;
    const x3 = x2 + Math.cos(angleAtVertex2) * side * Math.sin(rad3);
    const y3 = y2 - Math.sin(angleAtVertex2) * side * Math.cos(rad3);

    return [
      [x1, y1, 0],
      [x2, y2, 0],
      [x3, y3, 0],
    ];
  }, [angle1, angle2, angle3, isValid]);

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
            onChange={(e) => setAngle1(Number(e.target.value))}
          />
        </div>
        <div className="angle-control">
          <label>角2: {angle2}°</label>
          <input
            type="range"
            min="20"
            max="140"
            value={angle2}
            onChange={(e) => setAngle2(Number(e.target.value))}
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

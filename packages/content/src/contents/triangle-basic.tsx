import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface TriangleBasicProps {
  onComplete?: () => void;
}

export const TriangleBasic: React.FC<TriangleBasicProps> = ({ onComplete }) => {
  const [vertices, setVertices] = useState([
    [0, 1, 0],
    [-1, -1, 0],
    [1, -1, 0],
  ]);

  const handleVertexChange = (index: number, axis: 0 | 1, value: number) => {
    const newVertices = [...vertices];
    newVertices[index][axis] = value;
    setVertices(newVertices);
  };

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
            <meshStandardMaterial color="#4F46E5" side={THREE.DoubleSide} />
          </mesh>
          <OrbitControls enableDamping />
        </Canvas>
      </div>
      <div className="controls">
        <h3>拖动顶点改变三角形形状</h3>
        {vertices.map((v, i) => (
          <div key={i} className="vertex-control">
            <label>顶点 {i + 1}</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={v[0]}
              onChange={(e) => handleVertexChange(i, 0, parseFloat(e.target.value))}
            />
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={v[1]}
              onChange={(e) => handleVertexChange(i, 1, parseFloat(e.target.value))}
            />
          </div>
        ))}
        {onComplete && (
          <button className="complete-button" onClick={onComplete}>
            完成
          </button>
        )}
      </div>
    </div>
  );
};

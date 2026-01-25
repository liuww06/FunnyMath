import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface SolidUnfoldingProps {
  onComplete?: () => void;
}

export const SolidUnfolding: React.FC<SolidUnfoldingProps> = ({ onComplete }) => {
  const [unfoldProgress, setUnfoldProgress] = useState(0);
  const [selectedShape, setSelectedShape] = useState<'cube' | 'pyramid'>('cube');

  return (
    <div className="solid-unfolding">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />

        {selectedShape === 'cube' ? (
          <Cube unfoldProgress={unfoldProgress} />
        ) : (
          <Pyramid unfoldProgress={unfoldProgress} />
        )}

        <OrbitControls enableDamping />
      </Canvas>

      <div className="unfold-controls">
        <h3>立体图形展开</h3>
        <div className="shape-selector">
          <button
            className={selectedShape === 'cube' ? 'active' : ''}
            onClick={() => setSelectedShape('cube')}
          >
            正方体
          </button>
          <button
            className={selectedShape === 'pyramid' ? 'active' : ''}
            onClick={() => setSelectedShape('pyramid')}
          >
            三棱锥
          </button>
        </div>

        <div className="unfold-slider">
          <label>展开程度: {Math.round(unfoldProgress * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={unfoldProgress}
            onChange={(e) => setUnfoldProgress(Number(e.target.value))}
          />
        </div>

        <div className="hint">
          拖动滑块观察立体图形如何展开成平面图形
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

const Cube: React.FC<{ unfoldProgress: number }> = ({ unfoldProgress }) => {
  const angle = unfoldProgress * Math.PI;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>

      {/* Four side faces that rotate outward */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh
            position={[
              Math.sin(angle) * 0.5,
              0,
              0.5 - Math.cos(angle) * 0.5
            ]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[1, 1, 0.1]} />
            <meshStandardMaterial color="#10B981" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Pyramid: React.FC<{ unfoldProgress: number }> = ({ unfoldProgress }) => {
  const angle = unfoldProgress * Math.PI * 0.8;

  return (
    <group>
      {/* Base */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>

      {/* Four triangular faces */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh
            position={[
              Math.sin(angle) * 0.35,
              0.2,
              0.35 - Math.cos(angle) * 0.35
            ]}
            rotation={[0, 0, angle]}
          >
            <coneGeometry args={[0.7, 1, 3]} />
            <meshStandardMaterial color="#EC4899" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

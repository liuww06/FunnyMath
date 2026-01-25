import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface AngleMeasurementProps {
  onComplete?: () => void;
}

export const AngleMeasurement: React.FC<AngleMeasurementProps> = ({ onComplete }) => {
  const [targetAngle, setTargetAngle] = useState(45);
  const [userAngle, setUserAngle] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const accuracy = 100 - Math.abs(targetAngle - userAngle);

  return (
    <div className="angle-measurement">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />

        {/* Protractor base */}
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[0.8, 1, 64, 1, 0, Math.PI]} />
          <meshStandardMaterial color="#E5E7EB" side={THREE.DoubleSide} />
        </mesh>

        {/* Angle arc */}
        <ProtractorArc angle={userAngle} />

        {/* Target angle marker */}
        {showAnswer && (
          <mesh rotation={[0, 0, (-targetAngle * Math.PI) / 180]}>
            <boxGeometry args={[0.05, 0.5, 0.01]} />
            <meshStandardMaterial color="#10B981" />
          </mesh>
        )}

        <OrbitControls enableDamping enableZoom={false} />
      </Canvas>

      <div className="measurement-controls">
        <h3>角度测量练习</h3>

        <div className="target-angle">
          <label>目标角度: {targetAngle}°</label>
          <input
            type="range"
            min="10"
            max="170"
            step="5"
            value={targetAngle}
            onChange={(e) => {
              setTargetAngle(Number(e.target.value));
              setShowAnswer(false);
            }}
          />
        </div>

        <div className="user-angle">
          <label>你的测量: {userAngle.toFixed(0)}°</label>
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            value={userAngle}
            onChange={(e) => setUserAngle(Number(e.target.value))}
          />
        </div>

        <div className="actions">
          <button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? '隐藏' : '显示'}答案
          </button>
        </div>

        {showAnswer && (
          <div className={`result ${accuracy >= 90 ? 'excellent' : accuracy >= 70 ? 'good' : 'try-again'}`}>
            {accuracy >= 90 ? '太棒了！' : accuracy >= 70 ? '不错！' : '继续努力！'}
            误差: {Math.abs(targetAngle - userAngle).toFixed(0)}°
          </div>
        )}

        {onComplete && (
          <button className="complete-button" onClick={onComplete}>
            完成
          </button>
        )}
      </div>
    </div>
  );
};

const ProtractorArc: React.FC<{ angle: number }> = ({ angle }) => {
  const normalizedAngle = Math.max(0, Math.min(180, angle));

  return (
    <mesh rotation={[0, 0, (-normalizedAngle * Math.PI) / 360]}>
      <ringGeometry args={[0.6, 0.7, 64, 1, 0, (normalizedAngle * Math.PI) / 180]} />
      <meshStandardMaterial color="#4F46E5" side={THREE.DoubleSide} transparent opacity={0.7} />
    </mesh>
  );
};

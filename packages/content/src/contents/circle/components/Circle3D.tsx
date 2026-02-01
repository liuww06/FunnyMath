import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface Circle3DProps {
  radius: number;
  color?: string;
  showRadius?: boolean;
  showDiameter?: boolean;
  showCenter?: boolean;
  showChord?: boolean;
  wireframe?: boolean;
}

export const Circle3D: React.FC<Circle3DProps> = ({
  radius,
  color = '#4F46E5',
  showRadius = false,
  showDiameter = false,
  showCenter = true,
  showChord = false,
  wireframe = false
}) => {
  return (
    <group>
      {/* 圆的主体 */}
      <mesh rotation={[0, 0, 0]}>
        <ringGeometry args={[radius * 0.95, radius, 64]} />
        <meshStandardMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.7}
          wireframe={wireframe}
        />
      </mesh>

      {/* 圆心 */}
      {showCenter && (
        <>
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <Html position={[0, 0.1, 0]} center>
            <span style={{ color: '#EF4444', fontWeight: 'bold', fontSize: '12px' }}>O</span>
          </Html>
        </>
      )}

      {/* 半径线 */}
      {showRadius && (
        <>
          <mesh position={[radius / 2, 0, 0.01]}>
            <boxGeometry args={[radius, 0.02, 0.01]} />
            <meshStandardMaterial color="#10B981" />
          </mesh>
          <Html position={[radius / 2, 0.1, 0]} center>
            <span style={{ color: '#10B981', fontSize: '12px' }}>r = {radius.toFixed(1)}</span>
          </Html>
        </>
      )}

      {/* 直径线 */}
      {showDiameter && (
        <>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[radius * 2, 0.02, 0.01]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          <Html position={[0, 0.15, 0]} center>
            <span style={{ color: '#F59E0B', fontSize: '12px' }}>d = {(radius * 2).toFixed(1)}</span>
          </Html>
        </>
      )}

      {/* 弦 */}
      {showChord && (
        <mesh position={[0, radius * 0.6, 0.01]} rotation={[0, 0, 0]}>
          <boxGeometry args={[radius * 1.5, 0.02, 0.01]} />
          <meshStandardMaterial color="#8B5CF6" />
        </mesh>
      )}
    </group>
  );
};

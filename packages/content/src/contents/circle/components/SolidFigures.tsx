import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type SolidType = 'cylinder' | 'cone' | 'sphere' | 'none';

export interface SolidFiguresProps {
  type: SolidType;
  radius: number;
  highlightBase?: boolean;
}

export const SolidFigures: React.FC<SolidFiguresProps> = ({
  type,
  radius,
  highlightBase = false
}) => {
  const baseColor = highlightBase ? '#10B981' : '#4F46E5';
  const bodyColor = '#4F46E5';

  if (type === 'none') {
    return null;
  }

  return (
    <group>
      {type === 'cylinder' && (
        <>
          {/* 圆柱体 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[radius, radius, radius * 2, 32]} />
            <meshStandardMaterial color={bodyColor} transparent opacity={0.7} />
          </mesh>
          {/* 顶面圆 */}
          <mesh position={[0, radius, 0]}>
            <circleGeometry args={[radius, 32]} />
            <meshStandardMaterial color={baseColor} side={THREE.DoubleSide} />
          </mesh>
          {/* 底面圆 */}
          <mesh position={[0, -radius, 0]} rotation={[Math.PI, 0, 0]}>
            <circleGeometry args={[radius, 32]} />
            <meshStandardMaterial color={baseColor} side={THREE.DoubleSide} />
          </mesh>
          <Html position={[0, radius + 0.5, 0]} center>
            <span style={{ color: baseColor, fontWeight: 'bold', fontSize: '14px', background: 'white', padding: '4px 8px', borderRadius: '4px' }}>圆形底面</span>
          </Html>
        </>
      )}

      {type === 'cone' && (
        <>
          {/* 圆锥体 */}
          <mesh position={[0, 0, 0]}>
            <coneGeometry args={[radius, radius * 2, 32]} />
            <meshStandardMaterial color={bodyColor} transparent opacity={0.7} />
          </mesh>
          {/* 底面圆 */}
          <mesh position={[0, -radius * 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius, 32]} />
            <meshStandardMaterial color={baseColor} side={THREE.DoubleSide} />
          </mesh>
          <Html position={[0, -radius * 0.5 - 0.5, 0]} center>
            <span style={{ color: baseColor, fontWeight: 'bold', fontSize: '14px', background: 'white', padding: '4px 8px', borderRadius: '4px' }}>圆形底面</span>
          </Html>
        </>
      )}

      {type === 'sphere' && (
        <>
          {/* 球体 */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial color={bodyColor} transparent opacity={0.5} />
          </mesh>
          {/* 赤道圆 */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius, 0.02, 8, 64]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          <Html position={[0, 0, radius + 0.3]} center>
            <span style={{ color: baseColor, fontWeight: 'bold', fontSize: '14px', background: 'white', padding: '4px 8px', borderRadius: '4px' }}>球体的截面都是圆</span>
          </Html>
        </>
      )}
    </group>
  );
};

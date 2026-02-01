import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface AreaDerivationProps {
  radius: number;
  segments: number; // 8, 16, 32
  unfolded: number; // 0-1, 展开动画进度
}

export const AreaDerivation: React.FC<AreaDerivationProps> = ({
  radius,
  segments,
  unfolded
}) => {
  const anglePerSegment = (2 * Math.PI) / segments;

  // 生成扇形
  const sectors = React.useMemo(() => {
    const result: Array<{
      id: number;
      position: [number, number, number];
      rotation: [number, number, number];
      isTop: boolean;
    }> = [];

    for (let i = 0; i < segments; i++) {
      const isTop = i % 2 === 0;
      // 展开后的位置
      const targetX = ((i / 2) * radius * anglePerSegment) - (segments * radius * anglePerSegment) / 4;
      const targetY = isTop ? 0.05 : -0.05;
      const targetZ = 0;

      // 原始圆上的位置
      const originalAngle = i * anglePerSegment - Math.PI / 2;
      const originalX = radius * 0.5 * Math.cos(originalAngle);
      const originalY = radius * 0.5 * Math.sin(originalAngle);

      // 插值计算当前位置
      const t = unfolded;
      const position: [number, number, number] = [
        originalX + (targetX - originalX) * t,
        originalY + (targetY - originalY) * t,
        0
      ];

      const rotation: [number, number, number] = [
        0,
        0,
        isTop ? 0 : Math.PI * t
      ];

      result.push({
        id: i,
        position,
        rotation,
        isTop
      });
    }
    return result;
  }, [radius, segments, unfolded, anglePerSegment]);

  // 创建扇形几何体
  const createSectorGeometry = () => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, 0, anglePerSegment, false);
    shape.lineTo(0, 0);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: false
    });
  };

  const sectorGeometry = React.useMemo(() => createSectorGeometry(), [radius, anglePerSegment]);

  return (
    <group>
      {sectors.map((sector) => (
        <group
          key={sector.id}
          position={sector.position}
          rotation={sector.rotation}
        >
          <mesh geometry={sectorGeometry}>
            <meshStandardMaterial
              color={sector.isTop ? '#4F46E5' : '#10B981'}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 标注 */}
      {unfolded > 0.5 && (
        <>
          {/* 长（半圆周长） */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[Math.PI * radius, 0.02, 0.01]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* 宽（半径） */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[0.02, 0.02, radius]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          <Html position={[0, 0.4, 0]} center>
            <div style={{
              background: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>长 × 宽 = 面积</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#F59E0B' }}>
                πr × r = πr²
              </div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
};

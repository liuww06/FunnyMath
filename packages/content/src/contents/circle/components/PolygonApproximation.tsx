import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface PolygonApproximationProps {
  radius: number;
  sides: number;
  showCircle?: boolean;
}

export const PolygonApproximation: React.FC<PolygonApproximationProps> = ({
  radius,
  sides,
  showCircle = true
}) => {
  // 计算正多边形的顶点
  const vertices = React.useMemo(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      points.push([
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
      ]);
    }
    return points;
  }, [radius, sides]);

  // 计算多边形周长
  const perimeter = React.useMemo(() => {
    const sideLength = 2 * radius * Math.sin(Math.PI / sides);
    return sideLength * sides;
  }, [radius, sides]);

  // 计算周长与直径的比值（逼近圆周率）
  const ratio = React.useMemo(() => {
    return perimeter / (radius * 2);
  }, [perimeter, radius]);

  // 创建三角形面用于填充
  const triangles = React.useMemo(() => {
    const result: [[number, number, number], [number, number, number], [number, number, number]][] = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      result.push([vertices[0], vertices[i], vertices[i + 1]]);
    }
    return result;
  }, [vertices]);

  return (
    <group>
      {/* 参考圆 */}
      {showCircle && (
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[radius * 0.98, radius, 64]} />
          <meshStandardMaterial
            color="#E5E7EB"
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* 多边形填充 */}
      {triangles.map((triangle, i) => (
        <mesh key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={9}
              array={new Float32Array(triangle.flat())}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial
            color="#4F46E5"
            side={THREE.DoubleSide}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* 多边形边框 */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={vertices.length}
            array={new Float32Array(vertices.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#4F46E5" lineWidth={2} />
      </lineLoop>

      {/* 显示比值 */}
      <Html position={[0, -radius - 0.5, 0]} center>
        <div style={{
          background: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>
            {sides} 边形周长 ÷ 直径
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
            ≈ {ratio.toFixed(5)}
          </div>
          <div style={{ fontSize: '12px', color: '#10B981' }}>
            π ≈ 3.14159
          </div>
        </div>
      </Html>
    </group>
  );
};

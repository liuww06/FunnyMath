# 圆与圆周率互动内容实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 FunnyMath 添加两个关于"圆与圆周率"的互动内容，涵盖圆的组成、圆周率可视化、公式推导和计算练习。

**Architecture:** 在现有的 `packages/content` 目录下创建 `circle` 子目录，包含共享 3D 组件和两个主内容组件。使用 React Three Fiber 实现 3D 可视化，Zustand 管理本地状态。

**Tech Stack:** React, React Three Fiber, Three.js, Drei, Zustand, TypeScript

---

## Phase 1: 共享组件开发

### Task 1: 创建 Circle 目录结构和基础组件

**Files:**
- Create: `packages/content/src/contents/circle/components/Circle3D.tsx`

**Step 1: 创建 Circle3D 组件**

创建 `packages/content/src/contents/circle/components/Circle3D.tsx`:

```typescript
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  const circleRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* 圆的主体 */}
      <mesh ref={circleRef} rotation={[0, 0, 0]}>
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
```

**Step 2: Commit**

```bash
git add packages/content/src/contents/circle/components/Circle3D.tsx
git commit -m "feat: add Circle3D shared component"
```

---

### Task 2: 创建多边形逼近组件

**Files:**
- Create: `packages/content/src/contents/circle/components/PolygonApproximation.tsx`

**Step 1: 创建 PolygonApproximation 组件**

创建 `packages/content/src/contents/circle/components/PolygonApproximation.tsx`:

```typescript
import React from 'react';
import { useFrame } from '@react-three/fiber';
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
```

**Step 2: Commit**

```bash
git add packages/content/src/contents/circle/components/PolygonApproximation.tsx
git commit -m "feat: add PolygonApproximation component"
```

---

### Task 3: 创建圆与立体图形组件

**Files:**
- Create: `packages/content/src/contents/circle/components/SolidFigures.tsx`

**Step 1: 创建 SolidFigures 组件**

创建 `packages/content/src/contents/circle/components/SolidFigures.tsx`:

```typescript
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
          {/* 球体 - 用半透明的球 */}
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
```

**Step 2: Commit**

```bash
git add packages/content/src/contents/circle/components/SolidFigures.tsx
git commit -m "feat: add SolidFigures component"
```

---

### Task 4: 创建面积公式推导组件

**Files:**
- Create: `packages/content/src/contents/circle/components/AreaDerivation.tsx`

**Step 1: 创建 AreaDerivation 组件**

创建 `packages/content/src/contents/circle/components/AreaDerivation.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
      {unfold > 0.5 && (
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
        </>
      )}
    </group>
  );
};
```

**Step 2: Commit**

```bash
git add packages/content/src/contents/circle/components/AreaDerivation.tsx
git commit -m "feat: add AreaDerivation component"
```

---

### Task 5: 创建计算器和练习面板组件

**Files:**
- Create: `packages/content/src/contents/circle/components/CalculatorPanel.tsx`
- Create: `packages/content/src/contents/circle/components/QuizPanel.tsx`

**Step 1: 创建 CalculatorPanel 组件**

创建 `packages/content/src/contents/circle/components/CalculatorPanel.tsx`:

```typescript
import React from 'react';

export interface CalculatorPanelProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  showFormula?: boolean;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  radius,
  onRadiusChange,
  showFormula = true
}) => {
  const circumference = 2 * Math.PI * radius;
  const area = Math.PI * radius * radius;

  return (
    <div className="calculator-panel" style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
        圆的计算器
      </h3>

      {/* 半径控制 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
          半径 r: {radius.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.1"
          value={radius}
          onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {showFormula && (
        <div style={{ marginTop: '16px' }}>
          {/* 周长 */}
          <div style={{ marginBottom: '12px', padding: '12px', background: '#EEF2FF', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>周长 C = 2πr</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4F46E5' }}>
              C = 2 × π × {radius.toFixed(1)} = {circumference.toFixed(2)}
            </div>
          </div>

          {/* 面积 */}
          <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>面积 S = πr²</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981' }}>
              S = π × {radius.toFixed(1)}² = {area.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

**Step 2: 创建 QuizPanel 组件**

创建 `packages/content/src/contents/circle/components/QuizPanel.tsx`:

```typescript
import React, { useState, useEffect } from 'react';

export type QuizType = 'area-to-radius' | 'circumference-to-radius' | 'area-to-diameter';

export interface QuizPanelProps {
  quizType: QuizType;
  onCorrect: () => void;
  onComplete: () => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  quizType,
  onCorrect,
  onComplete
}) => {
  const [question, setQuestion] = useState<{ radius: number; answer: number; prompt: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 5;

  const generateQuestion = () => {
    const r = Math.round((Math.random() * 4 + 1) * 10) / 10; // 1-5，保留一位小数

    if (quizType === 'area-to-radius') {
      const area = Math.round(Math.PI * r * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r,
        prompt: `已知圆的面积是 ${area}，求半径 r。（π 取 3.14）`
      });
    } else if (quizType === 'circumference-to-radius') {
      const c = Math.round(2 * Math.PI * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r,
        prompt: `已知圆的周长是 ${c}，求半径 r。（π 取 3.14）`
      });
    } else {
      const area = Math.round(Math.PI * r * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r * 2,
        prompt: `已知圆的面积是 ${area}，求直径 d。（π 取 3.14）`
      });
    }
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [quizType]);

  const checkAnswer = () => {
    if (!question) return;

    const userNum = parseFloat(userAnswer);
    const tolerance = 0.15; // 允许误差

    if (Math.abs(userNum - question.answer) < tolerance) {
      setFeedback('correct');
      setScore(score + 1);
      setTimeout(() => {
        setQuestionCount(questionCount + 1);
        if (questionCount + 1 >= totalQuestions) {
          onComplete();
        } else {
          generateQuestion();
        }
      }, 1000);
    } else {
      setFeedback('incorrect');
    }
  };

  if (!question) return null;

  if (questionCount >= totalQuestions) {
    return (
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937' }}>练习完成！</h3>
        <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#10B981' }}>
          {score} / {totalQuestions}
        </p>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          正确率: {Math.round((score / totalQuestions) * 100)}%
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6B7280' }}>
          题目 {questionCount + 1} / {totalQuestions}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4F46E5' }}>
          得分: {score}
        </span>
      </div>

      <p style={{ fontSize: '16px', color: '#1F2937', marginBottom: '16px' }}>
        {question.prompt}
      </p>

      <input
        type="number"
        step="0.1"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="输入你的答案"
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '2px solid #E5E7EB',
          borderRadius: '8px',
          marginBottom: '12px'
        }}
      />

      <button
        onClick={checkAnswer}
        disabled={!userAnswer || feedback === 'correct'}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          background: feedback === 'incorrect' ? '#EF4444' : '#4F46E5',
          border: 'none',
          borderRadius: '8px',
          cursor: feedback === 'correct' ? 'default' : 'pointer'
        }}
      >
        {feedback === 'correct' ? '✓ 正确!' : feedback === 'incorrect' ? '✗ 再试试' : '提交答案'}
      </button>

      {feedback === 'correct' && onCorrect()}
    </div>
  );
};
```

**Step 3: Commit**

```bash
git add packages/content/src/contents/circle/components/CalculatorPanel.tsx packages/content/src/contents/circle/components/QuizPanel.tsx
git commit -m "feat: add CalculatorPanel and QuizPanel components"
```

---

## Phase 2: 认识圆主内容开发

### Task 6: 创建 CircleBasic 主组件

**Files:**
- Create: `packages/content/src/contents/circle/circle-basic.tsx`
- Modify: `packages/content/src/index.ts`

**Step 1: 创建 CircleBasic 组件**

创建 `packages/content/src/contents/circle/circle-basic.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Circle3D } from './components/Circle3D';
import { PolygonApproximation } from './components/PolygonApproximation';
import { SolidFigures, SolidType } from './components/SolidFigures';

export type TabType = 'parts' | 'pi' | 'solid' | 'measure';

export const CircleBasic: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('parts');
  const [radius, setRadius] = useState(2);
  const [polygonSides, setPolygonSides] = useState(6);
  const [solidType, setSolidType] = useState<SolidType>('cylinder');
  const [showRadius, setShowRadius] = useState(true);
  const [showDiameter, setShowDiameter] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<TabType>>(new Set());

  const handleModuleComplete = (tab: TabType) => {
    setCompletedModules(prev => new Set([...prev, tab]));
    if (completedModules.size === 3 && !completedModules.has(tab)) {
      onComplete?.();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标签页导航 */}
      <div style={{
        display: 'flex',
        background: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {[
          { id: 'parts' as TabType, label: '圆的组成' },
          { id: 'pi' as TabType, label: '圆周率' },
          { id: 'solid' as TabType, label: '立体图形' },
          { id: 'measure' as TabType, label: '测量验证' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
              background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4F46E5' : 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
            {completedModules.has(tab.id) && ' ✓'}
          </button>
        ))}
      </div>

      {/* 3D 场景 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <OrbitControls enableDamping />

          {activeTab === 'parts' && (
            <Circle3D
              radius={radius}
              showRadius={showRadius}
              showDiameter={showDiameter}
              showCenter={true}
            />
          )}

          {activeTab === 'pi' && (
            <PolygonApproximation
              radius={radius}
              sides={polygonSides}
              showCircle={true}
            />
          )}

          {activeTab === 'solid' && (
            <SolidFigures
              type={solidType}
              radius={radius}
              highlightBase={true}
            />
          )}

          {activeTab === 'measure' && (
            <Circle3D
              radius={radius}
              showRadius={true}
              showDiameter={true}
            />
          )}
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderTop: '1px solid #E5E7EB'
      }}>
        {activeTab === 'parts' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆的组成
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                半径: {radius.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowRadius(!showRadius)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '12px',
                  background: showRadius ? '#10B981' : '#E5E7EB',
                  color: showRadius ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                半径
              </button>
              <button
                onClick={() => setShowDiameter(!showDiameter)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '12px',
                  background: showDiameter ? '#F59E0B' : '#E5E7EB',
                  color: showDiameter ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                直径
              </button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
              💡 拖动滑块改变圆的大小，观察半径和直径的关系
            </p>
          </div>
        )}

        {activeTab === 'pi' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆周率可视化
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                多边形边数: {polygonSides}
              </label>
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={polygonSides}
                onChange={(e) => setPolygonSides(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              💡 边数越多，多边形越接近圆，周长与直径的比值越接近 π
            </p>
            {polygonSides >= 30 && (
              <button
                onClick={() => handleModuleComplete('pi')}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                完成此模块
              </button>
            )}
          </div>
        )}

        {activeTab === 'solid' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆与立体图形
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['cylinder', 'cone', 'sphere'] as SolidType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSolidType(type)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '12px',
                    background: solidType === type ? '#4F46E5' : '#E5E7EB',
                    color: solidType === type ? 'white' : '#6B7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {type === 'cylinder' ? '圆柱' : type === 'cone' ? '圆锥' : '球体'}
                </button>
              ))}
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
              💡 观察圆在不同立体图形中的作用，拖动旋转查看
            </p>
            <button
              onClick={() => handleModuleComplete('solid')}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              完成此模块
            </button>
          </div>
        )}

        {activeTab === 'measure' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              测量验证
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                选择圆的大小
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{
              padding: '12px',
              background: '#EEF2FF',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                直径 d = {(radius * 2).toFixed(1)}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                周长 C = {(2 * Math.PI * radius).toFixed(2)}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4F46E5', marginTop: '8px' }}>
                C ÷ d = {(2 * Math.PI * radius / (radius * 2)).toFixed(4)} ≈ π
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              💡 无论圆的大小如何，周长总是直径的 π 倍！
            </p>
            <button
              onClick={() => handleModuleComplete('measure')}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              完成此模块
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

**Step 2: 更新内容注册表**

修改 `packages/content/src/index.ts`，添加 circle-basic 的导出和注册：

```typescript
export { CircleBasic } from './contents/circle/circle-basic';
export { TriangleBasic } from './contents/triangle-basic';
export { TriangleAngles } from './contents/triangle-angles';
export { AreaVisualization } from './contents/area-visualization';
export { SolidUnfolding } from './contents/solid-unfolding';
export { AngleMeasurement } from './contents/angle-measurement';
export type { InteractiveContent, GeometryContent } from './types';

export const CONTENT_REGISTRY = [
  // ... 现有内容 ...
  {
    id: 'circle-basic',
    title: '认识圆',
    grade: '5-6',
    difficulty: 2,
    component: CircleBasic,
    category: 'plane',
    learningObjectives: [
      '认识圆的组成（圆心、半径、直径）',
      '理解圆周率的意义',
      '了解圆与立体图形的关系',
      '通过测量验证圆周率'
    ]
  },
  // ... 其他内容 ...
] as const;
```

**Step 3: Commit**

```bash
git add packages/content/src/contents/circle/circle-basic.tsx packages/content/src/index.ts
git commit -m "feat: add CircleBasic content component"
```

---

## Phase 3: 圆的公式与计算主内容开发

### Task 7: 创建 CircleFormulas 主组件

**Files:**
- Create: `packages/content/src/contents/circle/circle-formulas.tsx`
- Modify: `packages/content/src/index.ts`

**Step 1: 创建 CircleFormulas 组件**

创建 `packages/content/src/contents/circle/circle-formulas.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Circle3D } from './components/Circle3D';
import { AreaDerivation } from './components/AreaDerivation';
import { CalculatorPanel } from './components/CalculatorPanel';
import { QuizPanel, QuizType } from './components/QuizPanel';

export type FormulaTabType = 'derivation' | 'calculator' | 'reverse' | 'compare';

export const CircleFormulas: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<FormulaTabType>('derivation');
  const [radius, setRadius] = useState(2);
  const [segments, setSegments] = useState(8);
  const [unfolded, setUnfolded] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    onComplete?.();
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标签页导航 */}
      <div style={{
        display: 'flex',
        background: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {[
          { id: 'derivation' as FormulaTabType, label: '公式推导' },
          { id: 'calculator' as FormulaTabType, label: '计算器' },
          { id: 'reverse' as FormulaTabType, label: '逆向练习' },
          { id: 'compare' as FormulaTabType, label: '面积比较' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
              background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4F46E5' : 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
            {tab.id === 'reverse' && quizCompleted && ' ✓'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 3D 场景 */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls enableDamping />

            {activeTab === 'derivation' && (
              <AreaDerivation
                radius={radius}
                segments={segments}
                unfolded={unfolded}
              />
            )}

            {activeTab === 'calculator' && (
              <Circle3D
                radius={radius}
                showRadius={false}
                showDiameter={false}
                showCenter={false}
              />
            )}

            {activeTab === 'reverse' && (
              <Circle3D
                radius={radius}
                showRadius={true}
                showDiameter={false}
              />
            )}

            {activeTab === 'compare' && (
              <group>
                {/* 大圆 */}
                <Circle3D radius={2} color="#4F46E5" showRadius={false} showDiameter={false} showCenter={false} />
                {/* 内切小圆 */}
                <Circle3D radius={1} color="#10B981" showRadius={false} showDiameter={false} showCenter={false} />
              </group>
            )}
          </Canvas>
        </div>

        {/* 控制面板 */}
        <div style={{
          width: '320px',
          padding: '16px',
          background: 'white',
          borderLeft: '1px solid #E5E7EB',
          overflowY: 'auto'
        }}>
          {activeTab === 'derivation' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                面积公式推导
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                将圆切割成扇形，然后交错排列，可以拼成一个近似的长方形。
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  切割份数: {segments}
                </label>
                <select
                  value={segments}
                  onChange={(e) => { setSegments(parseInt(e.target.value)); setUnfolded(0); }}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                >
                  <option value={8}>8 份</option>
                  <option value={16}>16 份</option>
                  <option value={32}>32 份</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  展开程度: {Math.round(unfolded * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={unfolded}
                  onChange={(e) => setUnfolded(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {unfolded > 0.8 && (
                <div style={{
                  padding: '12px',
                  background: '#ECFDF5',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                    长方形的长 ≈ 半圆周长 = πr = {(Math.PI * radius).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>
                    长方形的宽 = r = {radius}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#10B981'
                  }}>
                    面积 = πr × r = πr²
                  </div>
                </div>
              )}

              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                💡 切割份数越多，拼成的图形越接近长方形！
              </p>
            </div>
          )}

          {activeTab === 'calculator' && (
            <CalculatorPanel
              radius={radius}
              onRadiusChange={setRadius}
              showFormula={true}
            />
          )}

          {activeTab === 'reverse' && (
            <QuizPanel
              quizType="area-to-radius"
              onCorrect={() => {}}
              onComplete={handleQuizComplete}
            />
          )}

          {activeTab === 'compare' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                面积比较
              </h3>

              <div style={{
                padding: '12px',
                background: '#EEF2FF',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1F2937' }}>
                  <strong>问题 1：</strong>大圆半径是小圆的 2 倍，大圆面积是小圆的几倍？
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['2 倍', '4 倍', '8 倍'].map(answer => (
                    <button
                      key={answer}
                      onClick={() => alert('4 倍！面积与半径的平方成正比。')}
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '12px',
                background: '#ECFDF5',
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1F2937' }}>
                  <strong>问题 2：</strong>圆的面积和它的外接正方形面积，谁更大？
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['圆更大', '正方形更大', '一样大'].map(answer => (
                    <button
                      key={answer}
                      onClick={() => alert('正方形更大！圆面积约为正方形的 78.5%。')}
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

**Step 2: 更新内容注册表**

修改 `packages/content/src/index.ts`，添加 circle-formulas 的导出和注册：

```typescript
export { CircleFormulas } from './contents/circle/circle-formulas';
export { CircleBasic } from './contents/circle/circle-basic';
// ... 其他导出

export const CONTENT_REGISTRY = [
  // ... 现有内容 ...
  {
    id: 'circle-formulas',
    title: '圆的公式与计算',
    grade: '6-7',
    difficulty: 3,
    component: CircleFormulas,
    category: 'plane',
    learningObjectives: [
      '理解圆面积公式的推导过程',
      '掌握周长与面积的计算公式',
      '能够解决逆向计算问题',
      '应用圆的知识解决比较问题'
    ]
  },
  // ... 其他内容 ...
] as const;
```

**Step 3: Commit**

```bash
git add packages/content/src/contents/circle/circle-formulas.tsx packages/content/src/index.ts
git commit -m "feat: add CircleFormulas content component"
```

---

## Phase 4: 集成测试

### Task 8: 创建单元测试

**Files:**
- Create: `packages/content/src/contents/circle/circle-basic.test.tsx`
- Create: `packages/content/src/contents/circle/circle-formulas.test.tsx`

**Step 1: 创建 CircleBasic 测试**

创建 `packages/content/src/contents/circle/circle-basic.test.tsx`:

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CircleBasic } from './circle-basic';

describe('CircleBasic', () => {
  it('renders without crashing', () => {
    const { container } = render(<CircleBasic />);
    expect(container.querySelector('.calculator-panel')).toBeTruthy();
  });

  it('has 4 tabs', () => {
    render(<CircleBasic />);
    expect(screen.getByText('圆的组成')).toBeTruthy();
    expect(screen.getByText('圆周率')).toBeTruthy();
    expect(screen.getByText('立体图形')).toBeTruthy();
    expect(screen.getByText('测量验证')).toBeTruthy();
  });

  it('switches tabs correctly', () => {
    render(<CircleBasic />);
    const piTab = screen.getByText('圆周率');
    fireEvent.click(piTab);
    // Should render polygon approximation controls
  });
});
```

**Step 2: 创建 CircleFormulas 测试**

创建 `packages/content/src/contents/circle/circle-formulas.test.tsx`:

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CircleFormulas } from './circle-formulas';

describe('CircleFormulas', () => {
  it('renders without crashing', () => {
    const { container } = render(<CircleFormulas />);
    expect(container).toBeTruthy();
  });

  it('has 4 tabs', () => {
    render(<CircleFormulas />);
    expect(screen.getByText('公式推导')).toBeTruthy();
    expect(screen.getByText('计算器')).toBeTruthy();
    expect(screen.getByText('逆向练习')).toBeTruthy();
    expect(screen.getByText('面积比较')).toBeTruthy();
  });
});
```

**Step 3: 运行测试**

```bash
cd packages/content && npm test
```

**Step 4: Commit**

```bash
git add packages/content/src/contents/circle/*.test.tsx
git commit -m "test: add unit tests for circle content components"
```

---

## Phase 5: 文档更新

### Task 9: 更新项目 README

**Files:**
- Modify: `README.md`

**Step 1: 更新 README 内容列表**

修改 `README.md` 中的 MVP 内容部分：

```markdown
## MVP 内容

当前版本聚焦几何图形模块，包含 7 个互动内容：

1. **认识三角形** - 拖动顶点观察三角形变化
2. **三角形内角和** - 验证内角和等于 180°
3. **面积可视化** - 数格子验证面积公式
4. **立体图形展开** - 观察 3D 图形如何展开成平面
5. **角度测量** - 使用虚拟量角器练习
6. **认识圆** - 圆的组成、圆周率可视化、圆与立体图形
7. **圆的公式与计算** - 面积公式推导、周长面积计算、逆向练习
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README with new circle content"
```

---

## 验收检查清单

- [ ] Circle3D 组件正确显示圆的各个部分
- [ ] 多边形逼近动画流畅，比值计算正确
- [ ] 三种立体图形正确显示并可切换
- [ ] 面积推导动画展示清晰
- [ ] 计算器计算结果正确
- [ ] 练习题可以正常作答并反馈
- [ ] 两个内容都出现在内容列表中
- [ ] iOS App 可以正常显示
- [ ] 微信小程序可以正常显示
- [ ] 所有测试通过

---

## 总结

实现完成后，FunnyMath 将新增 2 个关于圆的互动内容：

| 内容 ID | 标题 | 年级 | 难度 | 模块数 |
|---------|------|------|------|--------|
| circle-basic | 认识圆 | 5-6 | 2 | 4 |
| circle-formulas | 圆的公式与计算 | 6-7 | 3 | 4 |

这将使项目的几何内容覆盖更全面，为学生提供更丰富的学习体验。

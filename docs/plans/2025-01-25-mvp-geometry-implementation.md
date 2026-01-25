# FunnyMath MVP - Geometry Module Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimum viable product for FunnyMath focusing on interactive geometry content for elementary+middle school students, targeting WeChat Mini Program and iOS.

**Architecture:** Monorepo with shared React Native core + native platform shells (iOS App, WeChat Mini Program). Interactive content built with Three.js for 3D visualization.

**Tech Stack:**
- Frontend: React Native (iOS), Taro (WeChat Mini Program)
- 3D Graphics: Three.js / react-three-fiber
- State: Zustand
- Backend: Node.js + PostgreSQL (user data, progress tracking)
- Auth: WeChat OAuth

---

## Phase 1: Project Setup

### Task 1: Initialize Monorepo Structure

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `packages/` directory
- Create: `apps/` directory

**Step 1: Create root package.json**

```json
{
  "name": "funnymath",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

**Step 3: Create directory structure**

Run: `mkdir -p apps/ios apps/miniprogram packages/ui packages/content packages/api`

**Step 4: Commit**

```bash
git add package.json turbo.json
git commit -m "chore: initialize monorepo structure with Turbo"
```

---

### Task 2: Setup Shared UI Package

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`

**Step 1: Create packages/ui/package.json**

```json
{
  "name": "@funnymath/ui",
  "version": "0.1.0",
  "main": "src/index.ts",
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create packages/ui/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create shared state store**

Create `packages/ui/src/store/index.ts`:

```typescript
import create from 'zustand';

interface UserProgress {
  completedContent: string[];
  currentLevel: number;
  totalPoints: number;
}

interface AppState {
  userProgress: UserProgress;
  updateProgress: (contentId: string, points: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userProgress: {
    completedContent: [],
    currentLevel: 1,
    totalPoints: 0,
  },
  updateProgress: (contentId, points) =>
    set((state) => ({
      userProgress: {
        completedContent: [...state.userProgress.completedContent, contentId],
        currentLevel: Math.floor(state.userProgress.totalPoints / 100) + 1,
        totalPoints: state.userProgress.totalPoints + points,
      },
    })),
}));
```

**Step 4: Commit**

```bash
git add packages/ui/
git commit -m "feat: add shared UI package with Zustand store"
```

---

### Task 3: Setup Content Engine Package

**Files:**
- Create: `packages/content/package.json`
- Create: `packages/content/src/types.ts`
- Create: `packages/content/src/contents/triangle-basic.tsx`

**Step 1: Create packages/content/package.json**

```json
{
  "name": "@funnymath/content",
  "version": "0.1.0",
  "main": "src/index.ts",
  "dependencies": {
    "@funnymath/ui": "*",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.95.0",
    "three": "^0.160.0",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/three": "^0.160.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Define content type schema**

Create `packages/content/src/types.ts`:

```typescript
export interface InteractiveContent {
  id: string;
  title: string;
  grade: string; // "3-4" for 3rd-4th grade
  difficulty: 1 | 2 | 3;
  component: React.ComponentType<any>;
  learningObjectives: string[];
}

export interface GeometryContent extends InteractiveContent {
  category: 'plane' | 'solid' | 'transform';
}
```

**Step 3: Create first interactive content - Triangle Basics**

Create `packages/content/src/contents/triangle-basic.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Vertices } from '@react-three/drei';
import * as THREE from 'three';

export const TriangleBasic: React.FC = () => {
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
      </div>
    </div>
  );
};
```

**Step 4: Export content registry**

Create `packages/content/src/index.ts`:

```typescript
export { TriangleBasic } from './contents/triangle-basic';
export type { InteractiveContent, GeometryContent } from './types';

export const CONTENT_REGISTRY = [
  {
    id: 'triangle-basic',
    title: '认识三角形',
    grade: '3-4',
    difficulty: 1,
    component: TriangleBasic,
    category: 'plane',
    learningObjectives: [
      '认识三角形的基本特征',
      '通过拖拽顶点观察三角形变化',
      '理解三角形有三条边和三个角'
    ]
  }
] as const;
```

**Step 5: Commit**

```bash
git add packages/content/
git commit -m "feat: add content engine with first interactive triangle content"
```

---

## Phase 2: iOS App Setup

### Task 4: Initialize React Native iOS App

**Files:**
- Create: `apps/ios/package.json`
- Create: `apps/ios/App.tsx`

**Step 1: Create apps/ios/package.json**

```json
{
  "name": "@funnymath/ios",
  "version": "0.1.0",
  "scripts": {
    "start": "expo start",
    "ios": "expo run:ios",
    "android": "expo run:android"
  },
  "dependencies": {
    "@funnymath/ui": "*",
    "@funnymath/content": "*",
    "expo": "~50.0.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.6",
    "react-native-safe-area-context": "4.8.2",
    "react-native-gesture-handler": "~2.14.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  }
}
```

**Step 2: Create apps/ios/App.tsx**

```typescript
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { ContentScreen } from './src/screens/ContentScreen';
import { CONTENT_REGISTRY } from '@funnymath/content';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FunnyMath' }} />
          {CONTENT_REGISTRY.map((content) => (
            <Stack.Screen
              key={content.id}
              name={content.id}
              component={ContentScreen}
              initialParams={{ contentId: content.id }}
              options={{ title: content.title }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

**Step 3: Create HomeScreen**

Create `apps/ios/src/screens/HomeScreen.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CONTENT_REGISTRY } from '@funnymath/content';
import { useAppStore } from '@funnymath/ui';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { userProgress } = useAppStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FunnyMath</Text>
        <Text style={styles.subtitle}>让数学变有趣</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.points}>积分: {userProgress.totalPoints}</Text>
        <Text style={styles.level}>等级: {userProgress.currentLevel}</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>几何图形</Text>
        {CONTENT_REGISTRY.map((content) => {
          const isCompleted = userProgress.completedContent.includes(content.id);
          return (
            <TouchableOpacity
              key={content.id}
              style={[styles.contentCard, isCompleted && styles.completedCard]}
              onPress={() => navigation.navigate(content.id)}
            >
              <Text style={styles.contentTitle}>{content.title}</Text>
              <Text style={styles.contentGrade}>{content.grade}年级</Text>
              <View style={styles.difficulty}>
                {[1, 2, 3].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.difficultyDot,
                      level <= content.difficulty && styles.difficultyActive
                    ]}
                  />
                ))}
              </View>
              {isCompleted && <Text style={styles.completed}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, backgroundColor: '#4F46E5' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 16, color: '#E0E7FF', marginTop: 4 },
  progressCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  points: { fontSize: 18, fontWeight: '600', color: '#4F46E5' },
  level: { fontSize: 18, fontWeight: '600', color: '#059669' },
  contentSection: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
  contentCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  completedCard: { borderColor: '#10B981', borderWidth: 2 },
  contentTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  contentGrade: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  difficulty: { flexDirection: 'row', marginTop: 8 },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginRight: 4
  },
  difficultyActive: { backgroundColor: '#F59E0B' },
  completed: { position: 'absolute', right: 16, top: 16, fontSize: 24, color: '#10B981' }
});
```

**Step 4: Create ContentScreen**

Create `apps/ios/src/screens/ContentScreen.tsx`:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppStore } from '@funnymath/ui';
import { CONTENT_REGISTRY } from '@funnymath/content';

interface Props {
  route: { params: { contentId: string } };
}

export const ContentScreen: React.FC<Props> = ({ route }) => {
  const { contentId } = route.params;
  const content = CONTENT_REGISTRY.find((c) => c.id === contentId);
  const { updateProgress } = useAppStore();

  const handleComplete = () => {
    updateProgress(contentId, 10);
  };

  if (!content) {
    return <Text>内容未找到</Text>;
  }

  const ContentComponent = content.component;

  return (
    <View style={styles.container}>
      <View style={styles.objectives}>
        <Text style={styles.objectiveTitle}>学习目标</Text>
        {content.learningObjectives.map((obj, i) => (
          <Text key={i} style={styles.objective}>• {obj}</Text>
        ))}
      </View>
      <View style={styles.contentArea}>
        <ContentComponent onComplete={handleComplete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  objectives: { padding: 16, backgroundColor: '#EEF2FF' },
  objectiveTitle: { fontSize: 16, fontWeight: '600', color: '#4F46E5', marginBottom: 8 },
  objective: { fontSize: 14, color: '#4338CA', marginBottom: 4 },
  contentArea: { flex: 1 }
});
```

**Step 5: Commit**

```bash
git add apps/ios/
git commit -m "feat: add iOS app with navigation and content screens"
```

---

## Phase 3: WeChat Mini Program

### Task 5: Initialize WeChat Mini Program

**Files:**
- Create: `apps/miniprogram/package.json`
- Create: `apps/miniprogram/src/app.config.ts`
- Create: `apps/miniprogram/src/pages/index/index.tsx`

**Step 1: Create apps/miniprogram/package.json**

```json
{
  "name": "@funnymath/miniprogram",
  "version": "0.1.0",
  "scripts": {
    "dev:weapp": "npx taro build --type weapp --watch",
    "build:weapp": "npx taro build --type weapp"
  },
  "dependencies": {
    "@funnymath/ui": "*",
    "@funnymath/content": "*",
    "@tarojs/components": "^3.6.0",
    "@tarojs/react": "^3.6.0",
    "@tarojs/runtime": "^3.6.0",
    "@tarojs/taro": "^3.6.0",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@tarojs/cli": "^3.6.0",
    "@tarojs/webpack5-runner": "^3.6.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create Taro config**

Create `apps/miniprogram/src/app.config.ts`:

```typescript
export default {
  pages: [
    'pages/index/index',
    'pages/content/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4F46E5',
    navigationBarTitleText: 'FunnyMath',
    navigationBarTextStyle: 'white'
  }
};
```

**Step 3: Create mini program home page**

Create `apps/miniprogram/src/pages/index/index.tsx`:

```typescript
import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { CONTENT_REGISTRY } from '@funnymath/content';
import './index.scss';

export default function Index() {
  return (
    <View className="home">
      <View className="header">
        <Text className="title">FunnyMath</Text>
        <Text className="subtitle">让数学变有趣</Text>
      </View>

      <View className="content-list">
        {CONTENT_REGISTRY.map((content) => (
          <View key={content.id} className="content-card">
            <Text className="content-title">{content.title}</Text>
            <Text className="content-grade">{content.grade}年级</Text>
            <Button size="mini" onClick={() => {
              // Navigate to content page
            }}>开始学习</Button>
          </View>
        ))}
      </View>
    </View>
  );
}
```

**Step 4: Create styles**

Create `apps/miniprogram/src/pages/index/index.scss`:

```scss
.home {
  min-height: 100vh;
  background: #F9FAFB;
}

.header {
  padding: 48rpx 32rpx;
  background: #4F46E5;
  color: #fff;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
}

.subtitle {
  font-size: 28rpx;
  color: #E0E7FF;
  margin-top: 16rpx;
}

.content-list {
  padding: 32rpx;
}

.content-card {
  padding: 32rpx;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.1);
}

.content-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1F2937;
}

.content-grade {
  font-size: 28rpx;
  color: #6B7280;
  margin-top: 8rpx;
  display: block;
}
```

**Step 5: Commit**

```bash
git add apps/miniprogram/
git commit -m "feat: add WeChat mini program with Taro framework"
```

---

## Phase 4: Backend API

### Task 6: Setup Backend API

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/routes/progress.ts`

**Step 1: Create apps/api/package.json**

```json
{
  "name": "@funnymath/api",
  "version": "0.1.0",
  "scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.10.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create Express server**

Create `apps/api/src/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import progressRoutes from './routes/progress';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/progress', progressRoutes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
```

**Step 3: Create progress routes**

Create `apps/api/src/routes/progress.ts`:

```typescript
import { Router } from 'express';

const router = Router();

// In-memory storage for MVP (replace with PostgreSQL in production)
const progressStore = new Map<string, {
  completedContent: string[];
  totalPoints: number;
  currentLevel: number;
}>();

// Get user progress
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const progress = progressStore.get(userId) || {
    completedContent: [],
    totalPoints: 0,
    currentLevel: 1
  };
  res.json(progress);
});

// Update progress
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { contentId, points } = req.body;

  const current = progressStore.get(userId) || {
    completedContent: [],
    totalPoints: 0,
    currentLevel: 1
  };

  const updated = {
    completedContent: [...current.completedContent, contentId],
    totalPoints: current.totalPoints + points,
    currentLevel: Math.floor((current.totalPoints + points) / 100) + 1
  };

  progressStore.set(userId, updated);
  res.json(updated);
});

export default router;
```

**Step 4: Commit**

```bash
git add apps/api/
git commit -m "feat: add backend API for progress tracking"
```

---

## Phase 5: Additional Interactive Contents

### Task 7: Triangle Angle Sum Content

**Files:**
- Create: `packages/content/src/contents/triangle-angles.tsx`

**Step 1: Create triangle angle sum content**

Create `packages/content/src/contents/triangle-angles.tsx`:

```typescript
import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export const TriangleAngles: React.FC = () => {
  const [angle1, setAngle1] = useState(60);
  const [angle2, setAngle2] = useState(60);

  const angle3 = useMemo(() => 180 - angle1 - angle2, [angle1, angle2]);

  const vertices = useMemo(() => {
    const a = (angle1 * Math.PI) / 180;
    const b = (angle2 * Math.PI) / 180;
    // Simple triangle construction from angles
    return [
      [0, 1, 0],
      [-Math.sin(a), -Math.cos(a), 0],
      [Math.sin(b), -Math.cos(b), 0]
    ];
  }, [angle1, angle2]);

  return (
    <div className="triangle-angles">
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

      <div className="angle-display">
        <h3>三角形内角和 = 180°</h3>
        <div className="angles">
          <div>
            <label>角 A: {angle1}°</label>
            <input
              type="range"
              min="20"
              max="140"
              value={angle1}
              onChange={(e) => setAngle1(Number(e.target.value))}
            />
          </div>
          <div>
            <label>角 B: {angle2}°</label>
            <input
              type="range"
              min="20"
              max="140"
              value={angle2}
              onChange={(e) => setAngle2(Number(e.target.value))}
            />
          </div>
          <div>
            <label>角 C: {angle3.toFixed(0)}°</label>
            <div className="result">{angle3.toFixed(0)}°</div>
          </div>
        </div>
        <p className="hint">
          {angle1 + angle2 + angle3 === 180
            ? '✓ 内角和正好是 180°！'
            : `内角和: ${angle1 + angle2 + angle3.toFixed(0)}°`}
        </p>
      </div>
    </div>
  );
};
```

**Step 2: Update content registry**

Edit `packages/content/src/index.ts`, add to CONTENT_REGISTRY:

```typescript
{
  id: 'triangle-angles',
  title: '三角形内角和',
  grade: '4-5',
  difficulty: 2,
  component: TriangleAngles,
  category: 'plane',
  learningObjectives: [
    '验证三角形内角和等于180°',
    '通过调整角度观察变化',
    '理解角度与形状的关系'
  ]
}
```

**Step 3: Commit**

```bash
git add packages/content/
git commit -m "feat: add triangle angle sum interactive content"
```

---

### Task 8: Area Visualization Content

**Files:**
- Create: `packages/content/src/contents/area-visualization.tsx`

**Step 1: Create area visualization content**

Create `packages/content/src/contents/area-visualization.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

export const AreaVisualization: React.FC = () => {
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [showGrid, setShowGrid] = useState(true);

  const area = width * height;

  return (
    <div className="area-visualization">
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        {showGrid && (
          <Grid
            args={[10, 10]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#6366f1"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#4f46e5"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            color="#F59E0B"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        <OrbitControls enableDamping />
      </Canvas>

      <div className="area-controls">
        <h3>面积可视化</h3>
        <div className="formula">
          面积 = 底 × 高 = {width} × {height} = {area}
        </div>
        <div className="sliders">
          <div>
            <label>底: {width}</label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div>
            <label>高: {height}</label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
        </div>
        <button onClick={() => setShowGrid(!showGrid)}>
          {showGrid ? '隐藏' : '显示'}网格
        </button>
        <div className="grid-count">
          可以数一数：大约有 {Math.round(area)} 个单位格子
        </div>
      </div>
    </div>
  );
};
```

**Step 2: Update content registry**

Edit `packages/content/src/index.ts`, add to CONTENT_REGISTRY:

```typescript
{
  id: 'area-visualization',
  title: '面积可视化',
  grade: '4-5',
  difficulty: 2,
  component: AreaVisualization,
  category: 'plane',
  learningObjectives: [
    '理解面积的含义',
    '通过数格子验证面积公式',
    '观察底和高变化对面积的影响'
  ]
}
```

**Step 3: Commit**

```bash
git add packages/content/
git commit -m "feat: add area visualization interactive content"
```

---

### Task 9: Solid Figure Unfolding Content

**Files:**
- Create: `packages/content/src/contents/solid-unfolding.tsx`

**Step 1: Create solid unfolding content**

Create `packages/content/src/contents/solid-unfolding.tsx`:

```typescript
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export const SolidUnfolding: React.FC = () => {
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
```

**Step 2: Update content registry**

Edit `packages/content/src/index.ts`, add to CONTENT_REGISTRY:

```typescript
{
  id: 'solid-unfolding',
  title: '立体图形展开',
  grade: '5-6',
  difficulty: 3,
  component: SolidUnfolding,
  category: 'solid',
  learningObjectives: [
    '认识常见的立体图形',
    '理解立体图形与平面展开图的关系',
    '培养空间想象能力'
  ]
}
```

**Step 3: Commit**

```bash
git add packages/content/
git commit -m "feat: add solid figure unfolding interactive content"
```

---

### Task 10: Angle Measurement Content

**Files:**
- Create: `packages/content/src/contents/angle-measurement.tsx`

**Step 1: Create angle measurement content**

Create `packages/content/src/contents/angle-measurement.tsx`:

```typescript
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

export const AngleMeasurement: React.FC = () => {
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
```

**Step 2: Update content registry**

Edit `packages/content/src/index.ts`, add to CONTENT_REGISTRY:

```typescript
{
  id: 'angle-measurement',
  title: '角度测量',
  grade: '4-5',
  difficulty: 2,
  component: AngleMeasurement,
  category: 'plane',
  learningObjectives: [
    '学会使用量角器',
    '认识不同大小的角度',
    '提高目测角度的能力'
  ]
}
```

**Step 3: Commit**

```bash
git add packages/content/
git commit -m "feat: add angle measurement interactive content"
```

---

## Phase 6: Parent Dashboard (WeChat Mini Program)

### Task 11: Create Parent Dashboard Page

**Files:**
- Create: `apps/miniprogram/src/pages/parent/index.tsx`
- Create: `apps/miniprogram/src/pages/parent/index.scss`

**Step 1: Create parent dashboard page**

Create `apps/miniprogram/src/pages/parent/index.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface ProgressData {
  completedContent: string[];
  totalPoints: number;
  currentLevel: number;
  weeklyMinutes: number;
}

export default function Parent() {
  const [progress, setProgress] = useState<ProgressData>({
    completedContent: [],
    totalPoints: 0,
    currentLevel: 1,
    weeklyMinutes: 0
  });

  useEffect(() => {
    // Fetch child's progress from API
    // For MVP, use mock data
    setProgress({
      completedContent: ['triangle-basic'],
      totalPoints: 10,
      currentLevel: 1,
      weeklyMinutes: 25
    });
  }, []);

  return (
    <View className="parent-dashboard">
      <View className="header">
        <Text className="title">家长看板</Text>
        <Text className="subtitle}>了解孩子的学习情况</Text>
      </View>

      <View className="stats-grid">
        <View className="stat-card">
          <Text className="stat-value">{progress.totalPoints}</Text>
          <Text className="stat-label}>总积分</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.currentLevel}</Text>
          <Text className="stat-label}>当前等级</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.weeklyMinutes}</Text>
          <Text className="stat-label}>本周学习(分钟)</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.completedContent.length}</Text>
          <Text className="stat-label}>完成内容</Text>
        </View>
      </View>

      <View className="completed-list">
        <Text className="section-title}>已完成内容</Text>
        {progress.completedContent.length === 0 ? (
          <Text className="empty}>孩子还没有完成任何内容</Text>
        ) : (
          progress.completedContent.map((id) => (
            <View key={id} className="completed-item">
              <Text className="item-name}>{
                id === 'triangle-basic' ? '认识三角形' :
                id === 'triangle-angles' ? '三角形内角和' :
                id === 'area-visualization' ? '面积可视化' :
                id === 'solid-unfolding' ? '立体图形展开' :
                id === 'angle-measurement' ? '角度测量' : id
              }</Text>
              <Text className="item-status}>✓ 完成</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
```

**Step 2: Create styles**

Create `apps/miniprogram/src/pages/parent/index.scss`:

```scss
.parent-dashboard {
  min-height: 100vh;
  background: #F9FAFB;
}

.header {
  padding: 48rpx 32rpx;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  color: #fff;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
}

.subtitle {
  font-size: 24rpx;
  color: #E0E7FF;
  margin-top: 8rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  padding: 32rpx;
  margin-top: -32rpx;
}

.stat-card {
  background: #fff;
  padding: 32rpx;
  border-radius: 16rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #4F46E5;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: #6B7280;
  margin-top: 8rpx;
}

.completed-list {
  padding: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 24rpx;
}

.completed-item {
  background: #fff;
  padding: 24rpx;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 28rpx;
  color: #1F2937;
}

.item-status {
  font-size: 24rpx;
  color: #10B981;
}

.empty {
  text-align: center;
  color: #9CA3AF;
  padding: 48rpx 0;
}
```

**Step 3: Update app config to include parent page**

Edit `apps/miniprogram/src/app.config.ts`:

```typescript
export default {
  pages: [
    'pages/index/index',
    'pages/parent/index',
    'pages/content/index'
  ],
  // ... rest of config
};
```

**Step 4: Commit**

```bash
git add apps/miniprogram/
git commit -m "feat: add parent dashboard page to mini program"
```

---

## Phase 7: Testing & Polish

### Task 12: Add Tests

**Files:**
- Create: `packages/ui/src/store.test.ts`
- Create: `apps/api/src/routes/progress.test.ts`

**Step 1: Create store tests**

Create `packages/ui/src/store.test.ts`:

```typescript
import { useAppStore } from './store';

describe('App Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { setState } = useAppStore;
    setState({
      userProgress: {
        completedContent: [],
        currentLevel: 1,
        totalPoints: 0,
      },
      updateProgress: expect.any(Function),
    });
  });

  test('initial state should be empty', () => {
    const state = useAppStore.getState();
    expect(state.userProgress.completedContent).toEqual([]);
    expect(state.userProgress.totalPoints).toBe(0);
    expect(state.userProgress.currentLevel).toBe(1);
  });

  test('updateProgress should add content and points', () => {
    const { updateProgress } = useAppStore.getState();
    updateProgress('triangle-basic', 10);

    const state = useAppStore.getState();
    expect(state.userProgress.completedContent).toContain('triangle-basic');
    expect(state.userProgress.totalPoints).toBe(10);
  });

  test('level should increase every 100 points', () => {
    const { updateProgress } = useAppStore.getState();

    updateProgress('content1', 50);
    expect(useAppStore.getState().userProgress.currentLevel).toBe(1);

    updateProgress('content2', 50);
    expect(useAppStore.getState().userProgress.currentLevel).toBe(2);
  });
});
```

**Step 2: Create API tests**

Create `apps/api/src/routes/progress.test.ts`:

```typescript
import request from 'supertest';
import express from 'express';
import progressRoutes from './progress';

const app = express();
app.use(express.json());
app.use('/api/progress', progressRoutes);

describe('Progress API', () => {
  const testUserId = 'test-user-123';

  test('GET /api/progress/:userId should return empty progress for new user', async () => {
    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      completedContent: [],
      totalPoints: 0,
      currentLevel: 1
    });
  });

  test('POST /api/progress/:userId should update progress', async () => {
    const response = await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });

    expect(response.status).toBe(200);
    expect(response.body.completedContent).toContain('triangle-basic');
    expect(response.body.totalPoints).toBe(10);
  });

  test('GET after POST should return updated progress', async () => {
    await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });

    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.body.totalPoints).toBe(10);
  });
});
```

**Step 3: Add test scripts to package.json files**

Edit `packages/ui/package.json`, add:

```json
"scripts": {
  "test": "jest"
},
"devDependencies": {
  "jest": "^29.7.0",
  "@testing-library/react": "^14.0.0"
}
```

**Step 4: Commit**

```bash
git add packages/ui/ apps/api/
git commit -m "test: add unit tests for store and API"
```

---

### Task 13: Add README

**Files:**
- Create: `README.md`

**Step 1: Create project README**

Create `README.md`:

```markdown
# FunnyMath

让数学变有趣的互动可视化学习产品。

## 项目结构

```
funnymath/
├── apps/
│   ├── ios/           # iOS App (React Native)
│   ├── miniprogram/   # 微信小程序 (Taro)
│   └── api/           # 后端 API (Express + PostgreSQL)
├── packages/
│   ├── ui/            # 共享 UI 组件和状态管理
│   └── content/       # 互动内容引擎
└── docs/
    └── plans/         # 设计和实现计划
```

## MVP 内容

当前版本聚焦几何图形模块，包含 5 个互动内容：

1. **认识三角形** - 拖动顶点观察三角形变化
2. **三角形内角和** - 验证内角和等于 180°
3. **面积可视化** - 数格子验证面积公式
4. **立体图形展开** - 观察 3D 图形如何展开成平面
5. **角度测量** - 使用虚拟量角器练习

## 开发

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 运行开发服务器

\`\`\`bash
# iOS App
npm run dev --workspace=apps/ios

# 微信小程序
npm run dev --workspace=apps/miniprogram

# API
npm run dev --workspace=apps/api
\`\`\`

### 运行测试

\`\`\`bash
npm test
\`\`\`

## MVP 目标

- 1000 个注册用户
- 周留存 > 30%
- 家长查看报告比例 > 40%
- NPS > 40

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add project README"
```

---

## Summary

This implementation plan covers:

1. **Monorepo setup** with Turbo for efficient builds
2. **Shared packages** for UI components and content engine
3. **5 interactive geometry contents** covering triangle basics, angles, area, 3D shapes, and measurement
4. **iOS App** with React Native/Expo
5. **WeChat Mini Program** with Taro framework
6. **Backend API** for progress tracking
7. **Parent dashboard** for monitoring child's learning
8. **Tests** for critical components
9. **Documentation** for developers

**Estimated timeline**: 3-4 months

**Next steps after MVP**:
- Add more geometry contents
- Expand to other modules (数与符号、变化与关系、数据与概率、模式与推理)
- Add AI features
- Community UGC platform

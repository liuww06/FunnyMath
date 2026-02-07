import { TriangleBasic } from '@funnymath/content/src/contents/triangle-basic';
import { TriangleAngles } from '@funnymath/content/src/contents/triangle-angles';
import { AreaVisualization } from '@funnymath/content/src/contents/area-visualization';
import { SolidUnfolding } from '@funnymath/content/src/contents/solid-unfolding';
import { AngleMeasurement } from '@funnymath/content/src/contents/angle-measurement';
import { CircleBasic } from '@funnymath/content/src/contents/circle/circle-basic';
import { CircleFormulas } from '@funnymath/content/src/contents/circle/circle-formulas';

/**
 * 内容注册表
 * 
 * 这个数组包含所有可用的互动内容的元数据和组件引用。
 * 每个内容项包括：
 * - id: 唯一标识符，用于路由和状态管理
 * - title: 显示的标题
 * - grade: 适合的年级范围
 * - difficulty: 难度等级（1-3，1最简单）
 * - component: React 组件引用
 * - category: 分类（'plane' 平面图形 或 'solid' 立体图形）
 * - learningObjectives: 学习目标列表
 * 
 * 添加新内容时，只需在此数组中添加新的配置对象即可。
 */
export const CONTENT_REGISTRY = [
  {
    id: 'triangle-basic',
    title: '认识三角形',
    grade: '3-4',
    difficulty: 1,
    component: TriangleBasic,
    category: 'plane' as const,
    learningObjectives: [
      '认识三角形的基本特征',
      '通过拖拽顶点观察三角形变化',
      '理解三角形有三条边和三个角'
    ]
  },
  {
    id: 'triangle-angles',
    title: '三角形内角和',
    grade: '4-5',
    difficulty: 2,
    component: TriangleAngles,
    category: 'plane' as const,
    learningObjectives: [
      '验证三角形内角和等于180°',
      '通过调整角度观察变化',
      '理解角度与形状的关系'
    ]
  },
  {
    id: 'area-visualization',
    title: '面积可视化',
    grade: '4-5',
    difficulty: 2,
    component: AreaVisualization,
    category: 'plane' as const,
    learningObjectives: [
      '理解面积的含义',
      '通过数格子验证面积公式',
      '观察底和高变化对面积的影响'
    ]
  },
  {
    id: 'solid-unfolding',
    title: '立体图形展开',
    grade: '5-6',
    difficulty: 3,
    component: SolidUnfolding,
    category: 'solid' as const,
    learningObjectives: [
      '认识常见的立体图形',
      '理解立体图形与平面展开图的关系',
      '培养空间想象能力'
    ]
  },
  {
    id: 'angle-measurement',
    title: '角度测量',
    grade: '4-5',
    difficulty: 2,
    component: AngleMeasurement,
    category: 'plane' as const,
    learningObjectives: [
      '学会使用量角器',
      '认识不同大小的角度',
      '提高目测角度的能力'
    ]
  },
  {
    id: 'circle-basic',
    title: '认识圆',
    grade: '5-6',
    difficulty: 2,
    component: CircleBasic,
    category: 'plane' as const,
    learningObjectives: [
      '认识圆的组成（圆心、半径、直径）',
      '理解圆周率的意义',
      '了解圆与立体图形的关系',
      '通过测量验证圆周率'
    ]
  },
  {
    id: 'circle-formulas',
    title: '圆的公式与计算',
    grade: '6-7',
    difficulty: 3,
    component: CircleFormulas,
    category: 'plane' as const,
    learningObjectives: [
      '理解圆面积公式的推导过程',
      '掌握周长与面积的计算公式',
      '能够解决逆向计算问题',
      '应用圆的知识解决比较问题'
    ]
  }
] as const;

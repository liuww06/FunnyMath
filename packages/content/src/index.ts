export { TriangleBasic } from './contents/triangle-basic';
export { TriangleAngles } from './contents/triangle-angles';
export { AreaVisualization } from './contents/area-visualization';
export { SolidUnfolding } from './contents/solid-unfolding';
export { AngleMeasurement } from './contents/angle-measurement';
export { CircleBasic } from './contents/circle/circle-basic';
export { CircleFormulas } from './contents/circle/circle-formulas';
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
  },
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
  },
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
  },
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
  },
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
  },
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
  }
] as const;

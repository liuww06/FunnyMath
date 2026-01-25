export { TriangleBasic } from './contents/triangle-basic';
export { TriangleAngles } from './contents/triangle-angles';
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
  }
] as const;

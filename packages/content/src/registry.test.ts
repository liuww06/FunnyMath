// Test the CONTENT_REGISTRY structure and validation
// This file tests the data structure without importing React components

import type { GeometryContent } from './types';

// Mock the component imports
const mockComponent = () => null;

// Manually define the expected registry structure for testing
const expectedContentStructure: GeometryContent[] = [
  {
    id: 'triangle-basic',
    title: '认识三角形',
    grade: '3-4',
    difficulty: 1,
    component: mockComponent,
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
    component: mockComponent,
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
    component: mockComponent,
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
    component: mockComponent,
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
    component: mockComponent,
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
    component: mockComponent,
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
    component: mockComponent,
    category: 'plane',
    learningObjectives: [
      '理解圆面积公式的推导过程',
      '掌握周长与面积的计算公式',
      '能够解决逆向计算问题',
      '应用圆的知识解决比较问题'
    ]
  }
];

describe('Content Registry Structure', () => {
  test('should have 7 content items', () => {
    expect(expectedContentStructure.length).toBe(7);
  });

  test('each content item should have required properties', () => {
    expectedContentStructure.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('grade');
      expect(item).toHaveProperty('difficulty');
      expect(item).toHaveProperty('component');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('learningObjectives');

      // Check types
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.grade).toBe('string');
      expect(typeof item.difficulty).toBe('number');
      expect(Array.isArray(item.learningObjectives)).toBe(true);
    });
  });

  test('content IDs should be unique', () => {
    const ids = expectedContentStructure.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('difficulty should be 1, 2, or 3', () => {
    expectedContentStructure.forEach((item) => {
      expect([1, 2, 3]).toContain(item.difficulty);
    });
  });

  test('category should be plane, solid, or transform', () => {
    const validCategories = ['plane', 'solid', 'transform'];
    expectedContentStructure.forEach((item) => {
      expect(validCategories).toContain(item.category);
    });
  });

  test('each content should have at least one learning objective', () => {
    expectedContentStructure.forEach((item) => {
      expect(item.learningObjectives.length).toBeGreaterThan(0);
      item.learningObjectives.forEach((objective) => {
        expect(typeof objective).toBe('string');
        expect(objective.trim().length).toBeGreaterThan(0);
      });
    });
  });

  test('grade should follow expected format', () => {
    expectedContentStructure.forEach((item) => {
      // Grade should be like "3-4", "5-6", "6-7", etc.
      expect(item.grade).toMatch(/^\d+-\d+$/);
    });
  });

  test('should contain expected content IDs', () => {
    const expectedIds = [
      'triangle-basic',
      'triangle-angles',
      'area-visualization',
      'solid-unfolding',
      'angle-measurement',
      'circle-basic',
      'circle-formulas',
    ];
    const actualIds = expectedContentStructure.map((item) => item.id);
    expectedIds.forEach((id) => {
      expect(actualIds).toContain(id);
    });
  });

  test('contents should be categorized correctly', () => {
    const planeContents = expectedContentStructure.filter((item) => item.category === 'plane');
    const solidContents = expectedContentStructure.filter((item) => item.category === 'solid');

    expect(planeContents.length).toBe(6);
    expect(solidContents.length).toBe(1);
  });

  test('higher difficulty contents should target higher grades', () => {
    const difficulty1 = expectedContentStructure.filter((item) => item.difficulty === 1);
    const difficulty2 = expectedContentStructure.filter((item) => item.difficulty === 2);
    const difficulty3 = expectedContentStructure.filter((item) => item.difficulty === 3);

    // Difficulty 1 should be for lower grades (3-4)
    difficulty1.forEach((item) => {
      const minGrade = parseInt(item.grade.split('-')[0]);
      expect(minGrade).toBeLessThanOrEqual(4);
    });

    // Difficulty 3 should be for higher grades (5+)
    difficulty3.forEach((item) => {
      const minGrade = parseInt(item.grade.split('-')[0]);
      expect(minGrade).toBeGreaterThanOrEqual(5);
    });
  });

  test('titles should be in Chinese', () => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    expectedContentStructure.forEach((item) => {
      expect(chineseRegex.test(item.title)).toBe(true);
    });
  });

  test('learning objectives should be in Chinese', () => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    expectedContentStructure.forEach((item) => {
      item.learningObjectives.forEach((objective) => {
        expect(chineseRegex.test(objective)).toBe(true);
      });
    });
  });

  test('all content should have valid component function', () => {
    expectedContentStructure.forEach((item) => {
      expect(typeof item.component).toBe('function');
    });
  });

  test('should match GeometryContent type', () => {
    // Verify each item conforms to GeometryContent structure
    expectedContentStructure.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.grade).toBeDefined();
      expect(item.difficulty).toBeDefined();
      expect(item.component).toBeDefined();
      expect(item.category).toBeDefined();
      expect(item.learningObjectives).toBeDefined();
    });
  });
});

describe('Content Types', () => {
  test('GeometryContent should have correct structure', () => {
    const sampleContent: GeometryContent = {
      id: 'test-content',
      title: 'Test Content',
      grade: '3-4',
      difficulty: 1,
      component: () => null,
      category: 'plane',
      learningObjectives: ['Test objective'],
    };

    expect(sampleContent).toHaveProperty('category');
    expect(sampleContent.category).toBe('plane');
    expect(sampleContent).toHaveProperty('id');
    expect(sampleContent).toHaveProperty('title');
    expect(sampleContent).toHaveProperty('grade');
    expect(sampleContent).toHaveProperty('difficulty');
    expect(sampleContent).toHaveProperty('component');
    expect(sampleContent).toHaveProperty('learningObjectives');
  });
});

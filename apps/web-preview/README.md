# Web Preview App

这是一个用于预览和测试 FunnyMath 互动内容的 Web 应用程序。

## 功能特点

### 1. 内容浏览
- 展示所有可用的互动数学内容
- 支持查看每个内容的学习目标、年级和难度等级
- 提供直观的内容卡片界面

### 2. 搜索功能
- 实时搜索内容标题
- 搜索学习目标关键词
- 自动过滤并高亮匹配结果
- 支持一键清除搜索

### 3. 分类筛选
- **全部**：显示所有内容
- **平面图形**：只显示平面几何内容（三角形、圆等）
- **立体图形**：只显示立体几何内容（展开图等）
- 显示每个分类的内容数量

### 4. 响应式设计
- 支持桌面和移动设备
- 可折叠的侧边栏
- 自适应布局

### 5. 内容详情
- 显示完整的学习目标列表
- 实时渲染互动内容组件
- 面包屑导航
- 难度和分类标签

## 技术栈

- **React**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **CSS**: 样式（带过渡动画）

## 目录结构

```
web-preview/
├── src/
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 样式文件
│   ├── contentRegistry.ts   # 内容注册表
│   ├── index.tsx            # 应用入口
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── vite.config.ts           # Vite 配置
└── README.md                # 本文档
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev --filter web-preview
```

或从项目根目录：

```bash
npm run dev --workspace=apps/web-preview
```

### 构建生产版本

```bash
pnpm run build --filter web-preview
```

## 如何添加新内容

1. 在 `packages/content/src/contents/` 中创建新的内容组件
2. 在 `contentRegistry.ts` 中注册新内容：

```typescript
{
  id: 'unique-content-id',
  title: '内容标题',
  grade: '年级范围',
  difficulty: 1-3,
  component: YourComponent,
  category: 'plane' | 'solid',
  learningObjectives: [
    '学习目标1',
    '学习目标2'
  ]
}
```

3. 重启开发服务器即可看到新内容

## 核心组件说明

### App.tsx
主应用组件，包含：
- 状态管理（选中内容、搜索、筛选）
- 侧边栏布局
- 内容过滤逻辑
- 欢迎屏幕
- 内容详情展示

### contentRegistry.ts
内容注册表，定义：
- 所有可用内容的元数据
- 内容组件的引用
- 学习目标和分类信息

### Icons
内置 SVG 图标组件，包括：
- 三角形、角度、面积、立体图形、圆形
- 计算器、搜索、主页、筛选器
- 图标会根据内容 ID 自动匹配

## 使用场景

1. **内容开发**：开发新的互动内容时实时预览
2. **质量检查**：检查内容在不同设备上的表现
3. **演示展示**：向团队或用户展示内容库
4. **功能测试**：测试搜索、筛选等功能

## 注意事项

- 本应用仅用于开发和预览，不包含用户认证
- 不记录学习进度或用户数据
- 所有内容均从 `@funnymath/content` 包导入

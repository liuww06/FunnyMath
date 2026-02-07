# FunnyMath

让数学变有趣的互动可视化学习产品。

## 项目结构

```
funnymath/
├── apps/
│   ├── ios/           # iOS App (React Native)
│   ├── miniprogram/   # 微信小程序 (Taro)
│   ├── web-preview/   # Web 内容预览工具
│   └── api/           # 后端 API (Express + PostgreSQL)
├── packages/
│   ├── ui/            # 共享 UI 组件和状态管理
│   └── content/       # 互动内容引擎
└── docs/
    └── plans/         # 设计和实现计划
```

## MVP 内容

当前版本聚焦几何图形模块，包含 7 个互动内容：

1. **认识三角形** - 拖动顶点观察三角形变化
2. **三角形内角和** - 验证内角和等于 180°
3. **面积可视化** - 数格子验证面积公式
4. **立体图形展开** - 观察 3D 图形如何展开成平面
5. **角度测量** - 使用虚拟量角器练习
6. **认识圆** - 圆的组成、圆周率可视化、圆与立体图形
7. **圆的公式与计算** - 面积公式推导、周长面积计算、逆向练习

## 开发

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
# Web 内容预览（开发时推荐）
npm run dev --workspace=apps/web-preview

# iOS App
npm run dev --workspace=apps/ios

# 微信小程序
npm run dev --workspace=apps/miniprogram

# API
npm run dev --workspace=apps/api
```

### 运行测试

```bash
npm test
```

## MVP 目标

- 1000 个注册用户
- 周留存 > 30%
- 家长查看报告比例 > 40%
- NPS > 40

## License

MIT

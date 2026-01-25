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

```bash
npm install
```

### 运行开发服务器

```bash
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

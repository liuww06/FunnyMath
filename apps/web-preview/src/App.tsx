import React, { useState, useMemo } from 'react';
import { CONTENT_REGISTRY } from './contentRegistry';
import './App.css';

type CategoryFilter = 'all' | 'plane' | 'solid';

// 图标组件
const Icons = {
  triangle: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 3L17 17H3L10 3Z" />
    </svg>
  ),
  angle: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 16L16 4" />
      <path d="M4 16L10 16" />
      <path d="M4 16L4 10" />
    </svg>
  ),
  area: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="14" height="14" />
      <path d="M3 10H17" />
      <path d="M10 3V17" />
    </svg>
  ),
  solid: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 2L18 6V14L10 18L2 14V6L10 2Z" />
      <path d="M10 2V18" />
      <path d="M2 6L18 14" />
      <path d="M18 6L2 14" />
    </svg>
  ),
  circle: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3V10L15 12" />
    </svg>
  ),
  calculator: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="12" height="16" rx="2" />
      <path d="M4 6H16" />
      <path d="M8 10H8.01" />
      <path d="M12 10H12.01" />
      <path d="M8 14H8.01" />
      <path d="M12 14H12.01" />
    </svg>
  ),
  search: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="6" />
      <path d="M14 14L18 18" />
    </svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9L10 2L17 9V18C17 18.5 16.5 19 16 19H12V14H8V19H4C3.5 19 3 18.5 3 18V9Z" />
    </svg>
  ),
  filter: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 4h12v2H2z" />
      <path d="M4 7h8v2H4z" />
      <path d="M6 10h4v2H6z" />
    </svg>
  ),
};

// 根据内容ID获取图标
const getContentIcon = (id: string) => {
  if (id.includes('triangle')) return Icons.triangle;
  if (id.includes('angle')) return Icons.angle;
  if (id.includes('area')) return Icons.area;
  if (id.includes('solid')) return Icons.solid;
  if (id.includes('circle')) return Icons.circle;
  if (id.includes('formulas')) return Icons.calculator;
  return Icons.triangle;
};

// 分类标签映射
const categoryLabels: Record<string, string> = {
  all: '全部',
  plane: '平面图形',
  solid: '立体图形',
};

export default function App() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 过滤内容
  const filteredContent = useMemo(() => {
    return CONTENT_REGISTRY.filter((content) => {
      const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
      const matchesSearch = searchQuery === '' ||
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.learningObjectives.some(obj =>
          obj.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  const selectedContent = CONTENT_REGISTRY.find(c => c.id === selectedContentId);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div>
            <h1 className="app-title">
              <span className="title-icon">📐</span>
              FunnyMath
            </h1>
            <p className="app-subtitle">互动数学内容预览</p>
          </div>
          <button
            className="close-sidebar-btn"
            onClick={() => setSidebarOpen(false)}
            style={{ display: sidebarOpen ? 'block' : 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* 搜索框 */}
        <div className="sidebar-search">
          <div className="search-input-wrapper">
            <Icons.search />
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M10 4L4 10M4 4L10 10" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="category-filter">
          <div className="filter-header">
            <Icons.filter />
            <span>分类筛选</span>
          </div>
          <div className="filter-buttons">
            {(Object.keys(categoryLabels) as CategoryFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setCategoryFilter(filter)}
                className={`filter-btn ${categoryFilter === filter ? 'active' : ''}`}
              >
                {categoryLabels[filter]}
                <span className="count">
                  {filter === 'all'
                    ? CONTENT_REGISTRY.length
                    : CONTENT_REGISTRY.filter(c => c.category === filter).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 内容列表 */}
        <div className="content-list">
          <p className="list-header">
            {categoryLabels[categoryFilter]} ({filteredContent.length})
          </p>
          {filteredContent.length === 0 ? (
            <div className="empty-state">
              <p>没有找到匹配的内容</p>
            </div>
          ) : (
            filteredContent.map((content) => {
              const IconComponent = getContentIcon(content.id);
              return (
                <button
                  key={content.id}
                  onClick={() => setSelectedContentId(content.id)}
                  className={`content-card ${selectedContentId === content.id ? 'selected' : ''}`}
                >
                  <div className="card-icon">
                    <IconComponent />
                  </div>
                  <div className="card-content">
                    <div className="card-title">{content.title}</div>
                    <div className="card-meta">
                      <span className="grade">{content.grade}年级</span>
                      <span className="separator">·</span>
                      <span className={`difficulty difficulty-${content.difficulty}`}>
                        难度{content.difficulty}
                      </span>
                    </div>
                  </div>
                  {selectedContentId === content.id && (
                    <div className="selected-indicator">→</div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* 底部信息 */}
        <div className="sidebar-footer">
          <p>© 2025 FunnyMath</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </button>

            {selectedContent && (
              <div className="breadcrumb">
                <button onClick={() => setSelectedContentId(null)} className="breadcrumb-link">
                  <Icons.home />
                  <span>内容列表</span>
                </button>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{selectedContent.title}</span>
              </div>
            )}
          </div>

          <div className="header-right">
            {selectedContent ? (
              <>
                <div className={`difficulty-badge difficulty-${selectedContent.difficulty}`}>
                  难度 {selectedContent.difficulty}
                </div>
                <div className={`category-badge category-${selectedContent.category}`}>
                  {selectedContent.category === 'plane' ? '平面图形' : '立体图形'}
                </div>
              </>
            ) : (
              <h2 className="header-title">选择一个内容开始预览</h2>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {!selectedContent ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="40" cy="40" r="30" />
                  <path d="M40 10V40L55 50" />
                  <circle cx="20" cy="60" r="8" />
                  <circle cx="60" cy="60" r="8" />
                  <path d="M25 55L30 45M55 45L50 55" />
                </svg>
              </div>
              <h2 className="welcome-title">欢迎使用 FunnyMath 内容预览</h2>
              <p className="welcome-description">
                从左侧选择一个互动内容开始体验，或使用搜索功能查找特定主题
              </p>
              <div className="welcome-stats">
                <div className="stat-item">
                  <div className="stat-value">{CONTENT_REGISTRY.length}</div>
                  <div className="stat-label">互动内容</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-value">
                    {CONTENT_REGISTRY.filter(c => c.category === 'plane').length}
                  </div>
                  <div className="stat-label">平面图形</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-value">
                    {CONTENT_REGISTRY.filter(c => c.category === 'solid').length}
                  </div>
                  <div className="stat-label">立体图形</div>
                </div>
              </div>

              {/* 快速访问卡片 */}
              <div className="quick-access">
                <h3 className="quick-access-title">快速访问</h3>
                <div className="quick-access-grid">
                  {CONTENT_REGISTRY.slice(0, 4).map((content) => {
                    const IconComponent = getContentIcon(content.id);
                    return (
                      <button
                        key={content.id}
                        onClick={() => setSelectedContentId(content.id)}
                        className="quick-access-card"
                      >
                        <div className="quick-access-icon">
                          <IconComponent />
                        </div>
                        <div className="quick-access-info">
                          <div className="quick-access-title">{content.title}</div>
                          <div className="quick-access-meta">{content.grade}年级</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="content-detail">
              {/* 学习目标 */}
              <div className="learning-objectives">
                <h3 className="objectives-title">学习目标</h3>
                <div className="objectives-list">
                  {selectedContent.learningObjectives.map((objective, index) => (
                    <div key={index} className="objective-item">
                      <div className="objective-bullet">
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" fill="currentColor" />
                        </svg>
                      </div>
                      <span className="objective-text">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 内容组件 */}
              <div className="content-component-wrapper">
                <React.Suspense fallback={<div className="loading-state">加载中...</div>}>
                  <selectedContent.component />
                </React.Suspense>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

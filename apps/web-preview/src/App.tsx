import React, { useState } from 'react';
import { CONTENT_REGISTRY } from './contentRegistry';
import './App.css';

export default function App() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedContent = CONTENT_REGISTRY.find(c => c.id === selectedContentId);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? '280px' : '0',
          background: '#fff',
          borderRight: '1px solid #E5E7EB',
          transition: 'width 0.3s',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#4F46E5' }}>
            FunnyMath
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
            互动数学内容预览
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', marginBottom: '12px' }}>
            全部内容 ({CONTENT_REGISTRY.length})
          </p>
          {CONTENT_REGISTRY.map((content) => (
            <button
              key={content.id}
              onClick={() => setSelectedContentId(content.id)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '8px',
                border: 'none',
                background: selectedContentId === content.id ? '#EEF2FF' : '#F9FAFB',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (selectedContentId !== content.id) {
                  e.currentTarget.style.background = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedContentId !== content.id) {
                  e.currentTarget.style.background = '#F9FAFB';
                }
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                {content.title}
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                {content.grade}年级 · 难度{content.difficulty}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header
          style={{
            height: '60px',
            background: '#fff',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: '16px',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: '#F3F4F6',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {selectedContent ? (
            <>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
                  {selectedContent.title}
                </h2>
              </div>
              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background:
                    selectedContent.difficulty === 1
                      ? '#D1FAE5'
                      : selectedContent.difficulty === 2
                      ? '#FEF3C7'
                      : '#FEE2E2',
                  fontSize: '12px',
                  fontWeight: '600',
                  color:
                    selectedContent.difficulty === 1
                      ? '#059669'
                      : selectedContent.difficulty === 2
                      ? '#D97706'
                      : '#DC2626',
                }}
              >
                难度 {selectedContent.difficulty}
              </div>
            </>
          ) : (
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
              选择一个内容开始预览
            </h2>
          )}
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {!selectedContent ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="8" y="8" width="48" height="48" rx="8" />
                <circle cx="24" cy="24" r="6" />
                <path d="M40 40L48 48" />
                <path d="M48 40L40 48" />
              </svg>
              <p style={{ marginTop: '16px', fontSize: '16px' }}>从左侧选择内容预览</p>
            </div>
          ) : (
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
              {/* Learning Objectives */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  学习目标
                </h3>
                {selectedContent.learningObjectives.map((objective, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '3px',
                        background: '#4F46E5',
                        marginTop: '7px',
                        marginRight: '10px',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#4B5563' }}>{objective}</span>
                  </div>
                ))}
              </div>

              {/* Content Component */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ height: '600px', background: '#F9FAFB' }}>
                  <React.Suspense fallback={<div style={{ padding: '20px', textAlign: 'center', color: '#9CA3AF' }}>加载中...</div>}>
                    <selectedContent.component />
                  </React.Suspense>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

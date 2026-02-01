import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Circle3D } from './components/Circle3D';
import { PolygonApproximation } from './components/PolygonApproximation';
import { SolidFigures, SolidType } from './components/SolidFigures';

export type TabType = 'parts' | 'pi' | 'solid' | 'measure';

export const CircleBasic: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('parts');
  const [radius, setRadius] = useState(2);
  const [polygonSides, setPolygonSides] = useState(6);
  const [solidType, setSolidType] = useState<SolidType>('cylinder');
  const [showRadius, setShowRadius] = useState(true);
  const [showDiameter, setShowDiameter] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<TabType>>(new Set());

  const handleModuleComplete = (tab: TabType) => {
    setCompletedModules(prev => new Set([...prev, tab]));
    if (completedModules.size === 3 && !completedModules.has(tab)) {
      onComplete?.();
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标签页导航 */}
      <div style={{
        display: 'flex',
        background: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {[
          { id: 'parts' as TabType, label: '圆的组成' },
          { id: 'pi' as TabType, label: '圆周率' },
          { id: 'solid' as TabType, label: '立体图形' },
          { id: 'measure' as TabType, label: '测量验证' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === tab.id ? '#4F46E5' : '#6B7280',
              background: activeTab === tab.id ? '#EEF2FF' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #4F46E5' : 'none',
              cursor: 'pointer'
            }}
          >
            {tab.label}
            {completedModules.has(tab.id) && ' ✓'}
          </button>
        ))}
      </div>

      {/* 3D 场景 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <OrbitControls enableDamping />

          {activeTab === 'parts' && (
            <Circle3D
              radius={radius}
              showRadius={showRadius}
              showDiameter={showDiameter}
              showCenter={true}
            />
          )}

          {activeTab === 'pi' && (
            <PolygonApproximation
              radius={radius}
              sides={polygonSides}
              showCircle={true}
            />
          )}

          {activeTab === 'solid' && (
            <SolidFigures
              type={solidType}
              radius={radius}
              highlightBase={true}
            />
          )}

          {activeTab === 'measure' && (
            <Circle3D
              radius={radius}
              showRadius={true}
              showDiameter={true}
            />
          )}
        </Canvas>
      </div>

      {/* 控制面板 */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderTop: '1px solid #E5E7EB'
      }}>
        {activeTab === 'parts' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆的组成
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                半径: {radius.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowRadius(!showRadius)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '12px',
                  background: showRadius ? '#10B981' : '#E5E7EB',
                  color: showRadius ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                半径
              </button>
              <button
                onClick={() => setShowDiameter(!showDiameter)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '12px',
                  background: showDiameter ? '#F59E0B' : '#E5E7EB',
                  color: showDiameter ? 'white' : '#6B7280',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                直径
              </button>
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
              💡 拖动滑块改变圆的大小，观察半径和直径的关系
            </p>
          </div>
        )}

        {activeTab === 'pi' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆周率可视化
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                多边形边数: {polygonSides}
              </label>
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={polygonSides}
                onChange={(e) => setPolygonSides(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              💡 边数越多，多边形越接近圆，周长与直径的比值越接近 π
            </p>
            {polygonSides >= 30 && !completedModules.has('pi') && (
              <button
                onClick={() => handleModuleComplete('pi')}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                完成此模块
              </button>
            )}
          </div>
        )}

        {activeTab === 'solid' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              圆与立体图形
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['cylinder', 'cone', 'sphere'] as SolidType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSolidType(type)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '12px',
                    background: solidType === type ? '#4F46E5' : '#E5E7EB',
                    color: solidType === type ? 'white' : '#6B7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {type === 'cylinder' ? '圆柱' : type === 'cone' ? '圆锥' : '球体'}
                </button>
              ))}
            </div>
            <p style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
              💡 观察圆在不同立体图形中的作用，拖动旋转查看
            </p>
            {!completedModules.has('solid') && (
              <button
                onClick={() => handleModuleComplete('solid')}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                完成此模块
              </button>
            )}
          </div>
        )}

        {activeTab === 'measure' && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
              测量验证
            </h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                选择圆的大小
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{
              padding: '12px',
              background: '#EEF2FF',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                直径 d = {(radius * 2).toFixed(1)}
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                周长 C = {(2 * Math.PI * radius).toFixed(2)}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4F46E5', marginTop: '8px' }}>
                C ÷ d = {(2 * Math.PI * radius / (radius * 2)).toFixed(4)} ≈ π
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>
              💡 无论圆的大小如何，周长总是直径的 π 倍！
            </p>
            {!completedModules.has('measure') && (
              <button
                onClick={() => handleModuleComplete('measure')}
                style={{
                  marginTop: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                完成此模块
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

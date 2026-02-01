import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Circle3D } from './components/Circle3D';
import { AreaDerivation } from './components/AreaDerivation';
import { CalculatorPanel } from './components/CalculatorPanel';
import { QuizPanel, QuizType } from './components/QuizPanel';

export type FormulaTabType = 'derivation' | 'calculator' | 'reverse' | 'compare';

export const CircleFormulas: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<FormulaTabType>('derivation');
  const [radius, setRadius] = useState(2);
  const [segments, setSegments] = useState(8);
  const [unfolded, setUnfolded] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    onComplete?.();
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
          { id: 'derivation' as FormulaTabType, label: '公式推导' },
          { id: 'calculator' as FormulaTabType, label: '计算器' },
          { id: 'reverse' as FormulaTabType, label: '逆向练习' },
          { id: 'compare' as FormulaTabType, label: '面积比较' }
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
            {tab.id === 'reverse' && quizCompleted && ' ✓'}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* 3D 场景 */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />
            <OrbitControls enableDamping />

            {activeTab === 'derivation' && (
              <AreaDerivation
                radius={radius}
                segments={segments}
                unfolded={unfolded}
              />
            )}

            {activeTab === 'calculator' && (
              <Circle3D
                radius={radius}
                showRadius={false}
                showDiameter={false}
                showCenter={false}
              />
            )}

            {activeTab === 'reverse' && (
              <Circle3D
                radius={radius}
                showRadius={true}
                showDiameter={false}
              />
            )}

            {activeTab === 'compare' && (
              <group>
                {/* 大圆 */}
                <Circle3D radius={2} color="#4F46E5" showRadius={false} showDiameter={false} showCenter={false} />
                {/* 内切小圆 */}
                <Circle3D radius={1} color="#10B981" showRadius={false} showDiameter={false} showCenter={false} />
              </group>
            )}
          </Canvas>
        </div>

        {/* 控制面板 */}
        <div style={{
          width: '320px',
          padding: '16px',
          background: 'white',
          borderLeft: '1px solid #E5E7EB',
          overflowY: 'auto'
        }}>
          {activeTab === 'derivation' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                面积公式推导
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
                将圆切割成扇形，然后交错排列，可以拼成一个近似的长方形。
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  切割份数: {segments}
                </label>
                <select
                  value={segments}
                  onChange={(e) => { setSegments(parseInt(e.target.value)); setUnfolded(0); }}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                >
                  <option value={8}>8 份</option>
                  <option value={16}>16 份</option>
                  <option value={32}>32 份</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
                  展开程度: {Math.round(unfolded * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={unfolded}
                  onChange={(e) => setUnfolded(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              {unfolded > 0.8 && (
                <div style={{
                  padding: '12px',
                  background: '#ECFDF5',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px' }}>
                    长方形的长 ≈ 半圆周长 = πr = {(Math.PI * radius).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>
                    长方形的宽 = r = {radius}
                  </div>
                  <div style={{
                    marginTop: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#10B981'
                  }}>
                    面积 = πr × r = πr²
                  </div>
                </div>
              )}

              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                💡 切割份数越多，拼成的图形越接近长方形！
              </p>
            </div>
          )}

          {activeTab === 'calculator' && (
            <CalculatorPanel
              radius={radius}
              onRadiusChange={setRadius}
              showFormula={true}
            />
          )}

          {activeTab === 'reverse' && (
            <QuizPanel
              quizType="area-to-radius"
              onCorrect={() => {}}
              onComplete={handleQuizComplete}
            />
          )}

          {activeTab === 'compare' && (
            <div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
                面积比较
              </h3>

              <div style={{
                padding: '12px',
                background: '#EEF2FF',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1F2937' }}>
                  <strong>问题 1：</strong>大圆半径是小圆的 2 倍，大圆面积是小圆的几倍？
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['2 倍', '4 倍', '8 倍'].map(answer => (
                    <button
                      key={answer}
                      onClick={() => alert('4 倍！面积与半径的平方成正比。')}
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '12px',
                background: '#ECFDF5',
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1F2937' }}>
                  <strong>问题 2：</strong>圆的面积和它的外接正方形面积，谁更大？
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['圆更大', '正方形更大', '一样大'].map(answer => (
                    <button
                      key={answer}
                      onClick={() => alert('正方形更大！圆面积约为正方形的 78.5%。')}
                      style={{
                        padding: '8px',
                        fontSize: '14px',
                        background: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

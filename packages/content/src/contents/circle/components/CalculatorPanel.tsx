import React from 'react';

export interface CalculatorPanelProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  showFormula?: boolean;
}

export const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  radius,
  onRadiusChange,
  showFormula = true
}) => {
  const circumference = 2 * Math.PI * radius;
  const area = Math.PI * radius * radius;

  return (
    <div className="calculator-panel" style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>
        圆的计算器
      </h3>

      {/* 半径控制 */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>
          半径 r: {radius.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.1"
          value={radius}
          onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      {showFormula && (
        <div style={{ marginTop: '16px' }}>
          {/* 周长 */}
          <div style={{ marginBottom: '12px', padding: '12px', background: '#EEF2FF', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>周长 C = 2πr</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4F46E5' }}>
              C = 2 × π × {radius.toFixed(1)} = {circumference.toFixed(2)}
            </div>
          </div>

          {/* 面积 */}
          <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '8px' }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>面积 S = πr²</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10B981' }}>
              S = π × {radius.toFixed(1)}² = {area.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

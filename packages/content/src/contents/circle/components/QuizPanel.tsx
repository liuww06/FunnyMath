import React, { useState, useEffect } from 'react';

export type QuizType = 'area-to-radius' | 'circumference-to-radius' | 'area-to-diameter';

export interface QuizPanelProps {
  quizType: QuizType;
  onCorrect: () => void;
  onComplete: () => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  quizType,
  onCorrect,
  onComplete
}) => {
  const [question, setQuestion] = useState<{ radius: number; answer: number; prompt: string } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const totalQuestions = 5;

  const generateQuestion = () => {
    const r = Math.round((Math.random() * 4 + 1) * 10) / 10; // 1-5，保留一位小数

    if (quizType === 'area-to-radius') {
      const area = Math.round(Math.PI * r * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r,
        prompt: `已知圆的面积是 ${area}，求半径 r。（π 取 3.14）`
      });
    } else if (quizType === 'circumference-to-radius') {
      const c = Math.round(2 * Math.PI * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r,
        prompt: `已知圆的周长是 ${c}，求半径 r。（π 取 3.14）`
      });
    } else {
      const area = Math.round(Math.PI * r * r * 100) / 100;
      setQuestion({
        radius: r,
        answer: r * 2,
        prompt: `已知圆的面积是 ${area}，求直径 d。（π 取 3.14）`
      });
    }
    setUserAnswer('');
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, [quizType]);

  const checkAnswer = () => {
    if (!question) return;

    const userNum = parseFloat(userAnswer);
    const tolerance = 0.15; // 允许误差

    if (Math.abs(userNum - question.answer) < tolerance) {
      setFeedback('correct');
      setScore(score + 1);
      onCorrect();
      setTimeout(() => {
        setQuestionCount(questionCount + 1);
        if (questionCount + 1 >= totalQuestions) {
          onComplete();
        } else {
          generateQuestion();
        }
      }, 1000);
    } else {
      setFeedback('incorrect');
    }
  };

  if (!question) return null;

  if (questionCount >= totalQuestions) {
    return (
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937' }}>练习完成！</h3>
        <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#10B981' }}>
          {score} / {totalQuestions}
        </p>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>
          正确率: {Math.round((score / totalQuestions) * 100)}%
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#6B7280' }}>
          题目 {questionCount + 1} / {totalQuestions}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#4F46E5' }}>
          得分: {score}
        </span>
      </div>

      <p style={{ fontSize: '16px', color: '#1F2937', marginBottom: '16px' }}>
        {question.prompt}
      </p>

      <input
        type="number"
        step="0.1"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="输入你的答案"
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          border: '2px solid #E5E7EB',
          borderRadius: '8px',
          marginBottom: '12px'
        }}
      />

      <button
        onClick={checkAnswer}
        disabled={!userAnswer || feedback === 'correct'}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          background: feedback === 'incorrect' ? '#EF4444' : '#4F46E5',
          border: 'none',
          borderRadius: '8px',
          cursor: feedback === 'correct' ? 'default' : 'pointer'
        }}
      >
        {feedback === 'correct' ? '✓ 正确!' : feedback === 'incorrect' ? '✗ 再试试' : '提交答案'}
      </button>
    </div>
  );
};

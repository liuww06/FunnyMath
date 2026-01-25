import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

interface ProgressData {
  completedContent: string[];
  totalPoints: number;
  currentLevel: number;
  weeklyMinutes: number;
}

export default function Parent() {
  const [progress, setProgress] = useState<ProgressData>({
    completedContent: [],
    totalPoints: 0,
    currentLevel: 1,
    weeklyMinutes: 0
  });

  useEffect(() => {
    // Fetch child's progress from API
    // For MVP, use mock data
    setProgress({
      completedContent: ['triangle-basic'],
      totalPoints: 10,
      currentLevel: 1,
      weeklyMinutes: 25
    });
  }, []);

  const getContentName = (id: string): string => {
    switch (id) {
      case 'triangle-basic':
        return '认识三角形';
      case 'triangle-angles':
        return '三角形内角和';
      case 'area-visualization':
        return '面积可视化';
      case 'solid-unfolding':
        return '立体图形展开';
      case 'angle-measurement':
        return '角度测量';
      default:
        return id;
    }
  };

  return (
    <View className="parent-dashboard">
      <View className="header">
        <Text className="title">家长看板</Text>
        <Text className="subtitle">了解孩子的学习情况</Text>
      </View>

      <View className="stats-grid">
        <View className="stat-card">
          <Text className="stat-value">{progress.totalPoints}</Text>
          <Text className="stat-label">总积分</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.currentLevel}</Text>
          <Text className="stat-label">当前等级</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.weeklyMinutes}</Text>
          <Text className="stat-label">本周学习(分钟)</Text>
        </View>
        <View className="stat-card">
          <Text className="stat-value">{progress.completedContent.length}</Text>
          <Text className="stat-label">完成内容</Text>
        </View>
      </View>

      <View className="completed-list">
        <Text className="section-title">已完成内容</Text>
        {progress.completedContent.length === 0 ? (
          <Text className="empty">孩子还没有完成任何内容</Text>
        ) : (
          progress.completedContent.map((id) => (
            <View key={id} className="completed-item">
              <Text className="item-name">{getContentName(id)}</Text>
              <Text className="item-status">✓ 完成</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

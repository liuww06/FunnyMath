import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { CONTENT_REGISTRY } from '@funnymath/content';
import './index.scss';

export default function Index() {
  const handleStartLearning = (contentId: string) => {
    Taro.navigateTo({ url: `/pages/content/index?id=${contentId}` });
  };
  return (
    <View className="home">
      <View className="header">
        <Text className="title">FunnyMath</Text>
        <Text className="subtitle">让数学变有趣</Text>
      </View>

      <View className="content-list">
        {CONTENT_REGISTRY.map((content) => (
          <View key={content.id} className="content-card">
            <Text className="content-title">{content.title}</Text>
            <Text className="content-grade">年级: {content.grade}</Text>
            <Button className="start-button" onClick={() => handleStartLearning(content.id)}>开始学习</Button>
          </View>
        ))}
      </View>
    </View>
  );
}

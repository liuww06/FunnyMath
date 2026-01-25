import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { CONTENT_REGISTRY } from '@funnymath/content';
import './index.scss';

export default function Index() {
  const handleStartLearning = (id: string) => {
    console.log('Start learning:', id);
    // TODO: Navigate to content detail page
  };

  return (
    <View className="index">
      <View className="header">
        <Text className="title">FunnyMath</Text>
        <Text className="subtitle">让数学变有趣</Text>
      </View>

      <View className="content-list">
        {CONTENT_REGISTRY.map((content) => (
          <View key={content.id} className="content-item">
            <View className="content-info">
              <Text className="content-title">{content.title}</Text>
              <Text className="content-grade">年级: {content.grade}</Text>
              <View className="content-objectives">
                {content.learningObjectives.map((objective, index) => (
                  <Text key={index} className="objective-item">
                    {objective}
                  </Text>
                ))}
              </View>
            </View>
            <Button
              className="start-button"
              onClick={() => handleStartLearning(content.id)}
            >
              开始学习
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}

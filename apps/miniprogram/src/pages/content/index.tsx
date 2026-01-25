import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';

export default function Content() {
  const handleBack = () => {
    Taro.navigateBack();
  };

  return (
    <View className="content-page">
      <View className="content-header">
        <Text className="content-title">几何图形认知</Text>
      </View>

      <View className="content-body">
        <Text className="content-description">
          互动内容区域
        </Text>
      </View>

      <View className="content-footer">
        <Button className="back-button" onClick={handleBack}>
          返回首页
        </Button>
      </View>
    </View>
  );
}

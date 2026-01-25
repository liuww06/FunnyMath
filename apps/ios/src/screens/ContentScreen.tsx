import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import { CONTENT_REGISTRY } from '@funnymath/content';
import type { RootStackParamList } from '../../App';

type ContentScreenProps = NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>;

const ContentScreen: React.FC<ContentScreenProps> = ({ route }) => {
  const { contentId } = route.params;
  const content = CONTENT_REGISTRY.find((c) => c.id === contentId);
  const dimensions = useWindowDimensions();

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>内容未找到</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Since we're using React Three Fiber content that's web-based,
  // we'll render it in a WebView for the iOS app
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #F9FAFB;
            overflow: hidden;
          }
          #root {
            width: 100vw;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
        <script>
          // This is a placeholder for the actual content component
          // In production, this would load the bundled content component
          const root = document.getElementById('root');
          root.innerHTML = \`
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px;">
              <h2 style="color: #111827; margin-bottom: 20px;">\${encodeURIComponent(content.title)}</h2>
              <div style="background: white; border-radius: 16px; padding: 20px; width: 100%; max-width: 400px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <p style="color: #6B7280; text-align: center;">3D 互动内容区域</p>
                <div style="background: #EEF2FF; height: 200px; border-radius: 12px; margin: 20px 0; display: flex; align-items: center; justify-content: center;">
                  <span style="color: #6366F1;">Canvas 3D View</span>
                </div>
                <p style="color: #9CA3AF; font-size: 12px; text-align: center;">完整版本将集成 Three.js 交互组件</p>
              </div>
            </div>
          \`;
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Learning Objectives */}
        <View style={styles.objectivesCard}>
          <Text style={styles.objectivesTitle}>学习目标</Text>
          {content.learningObjectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>

        {/* Content Area - Using WebView for web-based 3D content */}
        <View style={styles.contentContainer}>
          <View style={[styles.webviewContainer, { height: dimensions.width * 0.8 }]}>
            <WebView
              source={{ html: htmlContent }}
              style={styles.webview}
              scrollEnabled={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
            />
          </View>
        </View>

        {/* Grade Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>适用年级</Text>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{content.grade}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>难度等级</Text>
            <View style={styles.difficultyDots}>
              {[1, 2, 3].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.difficultyDot,
                    {
                      backgroundColor:
                        level <= content.difficulty
                          ? content.difficulty === 1
                            ? '#10B981'
                            : content.difficulty === 2
                            ? '#F59E0B'
                            : '#EF4444'
                          : '#E5E7EB',
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>类别</Text>
            <Text style={styles.categoryText}>
              {content.category === 'plane'
                ? '平面几何'
                : content.category === 'solid'
                ? '立体几何'
                : '图形变换'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  objectivesCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  objectivesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginTop: 6,
    marginRight: 12,
  },
  objectiveText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  webviewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  webview: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  gradeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyDots: {
    flexDirection: 'row',
    gap: 6,
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});

export default ContentScreen;

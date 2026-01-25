import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppStore } from '@funnymath/ui';
import { CONTENT_REGISTRY } from '@funnymath/content';
import type { RootStackParamList } from '../../App';

type ContentScreenProps = NativeStackScreenProps<RootStackParamList, keyof RootStackParamList>;

export function ContentScreen({ route }: ContentScreenProps) {
  const { contentId } = route.params;
  const { userProgress, updateProgress } = useAppStore();
  const content = CONTENT_REGISTRY.find((c) => c.id === contentId);

  const handleComplete = () => {
    if (!userProgress.completedContent.includes(contentId)) {
      updateProgress(contentId, 10);
    }
  };

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>内容未找到</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ContentComponent = content.component;

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

        {/* Content Component */}
        <View style={styles.contentContainer}>
          <ContentComponent onComplete={handleComplete} />
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
}

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

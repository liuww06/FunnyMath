import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CONTENT_REGISTRY } from '@funnymath/content';
import { useAppStore } from '@funnymath/ui';
import type { RootStackParamList } from '../../App';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { userProgress } = useAppStore();

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return '#10B981'; // green
      case 2:
        return '#F59E0B'; // yellow
      case 3:
        return '#EF4444'; // red
      default:
        return '#9CA3AF';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return '简单';
      case 2:
        return '中等';
      case 3:
        return '困难';
      default:
        return '未知';
    }
  };

  const renderDifficultyDots = (difficulty: number) => {
    return (
      <View style={styles.difficultyDots}>
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            style={[
              styles.dot,
              {
                backgroundColor: level <= difficulty ? getDifficultyColor(difficulty) : '#E5E7EB',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderContentCard = (content: typeof CONTENT_REGISTRY[0]) => {
    const isCompleted = userProgress.completedContent.includes(content.id);

    return (
      <TouchableOpacity
        key={content.id}
        style={styles.contentCard}
        onPress={() => navigation.navigate(content.id as keyof RootStackParamList)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{content.title}</Text>
          {renderDifficultyDots(content.difficulty)}
        </View>
        <View style={styles.cardMeta}>
          <View style={[styles.gradeBadge, isCompleted && styles.completedBadge]}>
            <Text style={[styles.gradeText, isCompleted && styles.completedText]}>
              {isCompleted ? '已完成' : content.grade}
            </Text>
          </View>
          <Text style={styles.difficultyText}>{getDifficultyLabel(content.difficulty)}</Text>
        </View>
        <View style={styles.objectivesContainer}>
          <Text style={styles.objectivesLabel}>学习目标:</Text>
          {content.learningObjectives.map((objective, index) => (
            <View key={index} style={styles.objectiveItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.objectiveText}>{objective}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with user info */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>你好, 同学!</Text>
            <Text style={styles.subtitle}>继续你的数学探索之旅</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>我</Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>学习进度</Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgress.totalPoints}</Text>
              <Text style={styles.statLabel}>积分</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userProgress.completedContent.length}</Text>
              <Text style={styles.statLabel}>已完成</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{CONTENT_REGISTRY.length}</Text>
              <Text style={styles.statLabel}>总课程</Text>
            </View>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>等级 {userProgress.currentLevel}</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>互动课程</Text>
          {CONTENT_REGISTRY.map(renderContentCard)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  levelBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  levelText: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  difficultyDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  gradeText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    color: '#059669',
  },
  difficultyText: {
    fontSize: 12,
    color: '#6B7280',
  },
  objectivesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  objectivesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366F1',
    marginTop: 6,
    marginRight: 8,
  },
  objectiveText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
    lineHeight: 18,
  },
});

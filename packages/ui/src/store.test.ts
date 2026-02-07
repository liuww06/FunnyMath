import { useAppStore } from './store';

describe('App Store', () => {
  // Reset state before each test
  beforeEach(() => {
    useAppStore.setState({
      userProgress: {
        completedContent: [],
        currentLevel: 1,
        totalPoints: 0,
      },
    });
  });

  describe('Initial State', () => {
    test('initial state should be empty', () => {
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toEqual([]);
      expect(state.userProgress.totalPoints).toBe(0);
      expect(state.userProgress.currentLevel).toBe(1);
    });

    test('should have updateProgress function', () => {
      const { updateProgress } = useAppStore.getState();
      expect(typeof updateProgress).toBe('function');
    });
  });

  describe('updateProgress', () => {
    test('should add content and points', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('triangle-basic', 10);
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toContain('triangle-basic');
      expect(state.userProgress.totalPoints).toBe(10);
    });

    test('should accumulate points across multiple updates', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content1', 10);
      updateProgress('content2', 20);
      updateProgress('content3', 30);
      expect(useAppStore.getState().userProgress.totalPoints).toBe(60);
    });

    test('should not duplicate completed content', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('triangle-basic', 10);
      updateProgress('triangle-basic', 20);
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toEqual(['triangle-basic']);
      // Points should still accumulate
      expect(state.userProgress.totalPoints).toBe(30);
    });

    test('should handle multiple different content items', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('triangle-basic', 10);
      updateProgress('triangle-angles', 15);
      updateProgress('area-visualization', 20);
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toHaveLength(3);
      expect(state.userProgress.completedContent).toContain('triangle-basic');
      expect(state.userProgress.completedContent).toContain('triangle-angles');
      expect(state.userProgress.completedContent).toContain('area-visualization');
    });
  });

  describe('Level Calculation', () => {
    test('level should be 1 for less than 100 points', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content1', 50);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(1);
      updateProgress('content2', 49);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(1);
    });

    test('level should increase to 2 at 100 points', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content1', 50);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(1);
      updateProgress('content2', 50);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(2);
    });

    test('level should increase to 3 at 200 points', () => {
      const { updateProgress } = useAppStore.getState();
      for (let i = 0; i < 20; i++) {
        updateProgress(`content${i}`, 10);
      }
      expect(useAppStore.getState().userProgress.totalPoints).toBe(200);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(3);
    });

    test('level should increase to 10 at 900 points', () => {
      const { updateProgress } = useAppStore.getState();
      for (let i = 0; i < 90; i++) {
        updateProgress(`content${i}`, 10);
      }
      expect(useAppStore.getState().userProgress.totalPoints).toBe(900);
      expect(useAppStore.getState().userProgress.currentLevel).toBe(10);
    });

    test('level calculation: Level = Math.floor(points / 100) + 1', () => {
      const { updateProgress } = useAppStore.getState();

      // Test various point values - by adding points through updateProgress
      const testCases = [
        { points: 0, expectedLevel: 1 },
        { points: 1, expectedLevel: 1 },
        { points: 99, expectedLevel: 1 },
        { points: 100, expectedLevel: 2 },
        { points: 150, expectedLevel: 2 },
        { points: 199, expectedLevel: 2 },
        { points: 200, expectedLevel: 3 },
        { points: 500, expectedLevel: 6 },
        { points: 1000, expectedLevel: 11 },
      ];

      // Test through updateProgress which calculates level
      let accumulatedPoints = 0;
      testCases.forEach(({ points, expectedLevel }) => {
        // Add the difference in points
        const pointsToAdd = points - accumulatedPoints;
        if (pointsToAdd > 0) {
          updateProgress(`content-test-${points}`, pointsToAdd);
          accumulatedPoints = points;
        }
        expect(useAppStore.getState().userProgress.totalPoints).toBe(points);
        expect(useAppStore.getState().userProgress.currentLevel).toBe(expectedLevel);
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero points', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content-zero', 0);
      const state = useAppStore.getState();
      expect(state.userProgress.totalPoints).toBe(0);
      expect(state.userProgress.completedContent).toContain('content-zero');
    });

    test('should handle negative points', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content1', 50);
      updateProgress('content-negative', -10);
      const state = useAppStore.getState();
      expect(state.userProgress.totalPoints).toBe(40);
    });

    test('should handle very large point values', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('bonus-content', 10000);
      const state = useAppStore.getState();
      expect(state.userProgress.totalPoints).toBe(10000);
      expect(state.userProgress.currentLevel).toBe(101);
    });

    test('should handle empty content ID', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('', 10);
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toContain('');
    });

    test('should handle special characters in content ID', () => {
      const { updateProgress } = useAppStore.getState();
      const specialId = 'content-with-特殊字符-🎯';
      updateProgress(specialId, 10);
      const state = useAppStore.getState();
      expect(state.userProgress.completedContent).toContain(specialId);
    });
  });

  describe('State Immutability', () => {
    test('should maintain state integrity across updates', () => {
      const { updateProgress } = useAppStore.getState();

      updateProgress('content1', 10);
      const totalPoints1 = useAppStore.getState().userProgress.totalPoints;
      const completedContent1 = [...useAppStore.getState().userProgress.completedContent];

      updateProgress('content2', 20);
      const totalPoints2 = useAppStore.getState().userProgress.totalPoints;
      const completedContent2 = [...useAppStore.getState().userProgress.completedContent];

      // State should have updated
      expect(totalPoints2).toBe(30);
      expect(completedContent2).toHaveLength(2);
      expect(completedContent2).toContain('content1');
      expect(completedContent2).toContain('content2');

      // Verify points accumulated correctly
      expect(totalPoints2).toBeGreaterThan(totalPoints1);
    });
  });

  describe('User Progress Object', () => {
    test('userProgress should have all required properties', () => {
      const state = useAppStore.getState();
      expect(state.userProgress).toHaveProperty('completedContent');
      expect(state.userProgress).toHaveProperty('currentLevel');
      expect(state.userProgress).toHaveProperty('totalPoints');
    });

    test('completedContent should be an array', () => {
      const { updateProgress } = useAppStore.getState();
      updateProgress('content1', 10);
      expect(Array.isArray(useAppStore.getState().userProgress.completedContent)).toBe(true);
    });

    test('currentLevel should be a number', () => {
      expect(typeof useAppStore.getState().userProgress.currentLevel).toBe('number');
    });

    test('totalPoints should be a number', () => {
      expect(typeof useAppStore.getState().userProgress.totalPoints).toBe('number');
    });
  });
});

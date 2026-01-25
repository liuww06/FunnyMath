import { useAppStore } from './store';

describe('App Store', () => {
  beforeEach(() => {
    const { setState } = useAppStore;
    setState({
      userProgress: {
        completedContent: [],
        currentLevel: 1,
        totalPoints: 0,
      },
      updateProgress: expect.any(Function),
    });
  });

  test('initial state should be empty', () => {
    const state = useAppStore.getState();
    expect(state.userProgress.completedContent).toEqual([]);
    expect(state.userProgress.totalPoints).toBe(0);
    expect(state.userProgress.currentLevel).toBe(1);
  });

  test('updateProgress should add content and points', () => {
    const { updateProgress } = useAppStore.getState();
    updateProgress('triangle-basic', 10);
    const state = useAppStore.getState();
    expect(state.userProgress.completedContent).toContain('triangle-basic');
    expect(state.userProgress.totalPoints).toBe(10);
  });

  test('level should increase every 100 points', () => {
    const { updateProgress } = useAppStore.getState();
    updateProgress('content1', 50);
    expect(useAppStore.getState().userProgress.currentLevel).toBe(1);
    updateProgress('content2', 50);
    expect(useAppStore.getState().userProgress.currentLevel).toBe(2);
  });
});

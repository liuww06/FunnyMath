import create from 'zustand';

interface UserProgress {
  completedContent: string[];
  currentLevel: number;
  totalPoints: number;
}

interface AppState {
  userProgress: UserProgress;
  updateProgress: (contentId: string, points: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userProgress: {
    completedContent: [],
    currentLevel: 1,
    totalPoints: 0,
  },
  updateProgress: (contentId, points) =>
    set((state) => ({
      userProgress: {
        completedContent: [...state.userProgress.completedContent, contentId],
        currentLevel: Math.floor(state.userProgress.totalPoints / 100) + 1,
        totalPoints: state.userProgress.totalPoints + points,
      },
    })),
}));

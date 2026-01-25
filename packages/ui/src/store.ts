import { create } from 'zustand';

interface UserProgress {
  completedContent: string[];
  currentLevel: number;
  totalPoints: number;
}

interface AppState {
  userProgress: UserProgress;
  updateProgress: (contentId: string, points: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  userProgress: {
    completedContent: [],
    currentLevel: 1,
    totalPoints: 0,
  },
  updateProgress: (contentId, points) => {
    const { userProgress } = get();
    const alreadyCompleted = userProgress.completedContent.includes(contentId);

    set({
      userProgress: {
        completedContent: alreadyCompleted
          ? userProgress.completedContent
          : [...userProgress.completedContent, contentId],
        currentLevel: Math.floor((userProgress.totalPoints + points) / 100) + 1,
        totalPoints: userProgress.totalPoints + points,
      },
    });
  },
}));

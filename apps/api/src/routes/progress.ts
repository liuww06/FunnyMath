import { Router } from 'express';

const router = Router();

// In-memory storage for MVP
interface UserProgress {
  userId: string;
  totalPoints: number;
  level: number;
  completedContent: string[];
}

const progressStore = new Map<string, UserProgress>();

// Initialize a user if not exists
const getOrCreateUser = (userId: string): UserProgress => {
  if (!progressStore.has(userId)) {
    progressStore.set(userId, {
      userId,
      totalPoints: 0,
      level: 1,
      completedContent: []
    });
  }
  return progressStore.get(userId)!;
};

// GET /api/progress/:userId - Get user progress
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const progress = getOrCreateUser(userId);
  res.json(progress);
});

// POST /api/progress/:userId - Update user progress
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { contentId, points } = req.body;

  if (!contentId || typeof points !== 'number') {
    return res.status(400).json({ error: 'contentId and points are required' });
  }

  const progress = getOrCreateUser(userId);

  // Update total points
  progress.totalPoints += points;

  // Calculate new level: Math.floor((totalPoints + points) / 100) + 1
  progress.level = Math.floor(progress.totalPoints / 100) + 1;

  // Add to completed content if not already there
  if (!progress.completedContent.includes(contentId)) {
    progress.completedContent.push(contentId);
  }

  // Save to store
  progressStore.set(userId, progress);

  res.json(progress);
});

export default router;

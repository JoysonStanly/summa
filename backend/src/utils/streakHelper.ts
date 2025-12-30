import User from '../models/User';

/**
 * Calculate and update user streak
 */
export const updateUserStreak = async (userId: string): Promise<void> => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = user.streakData.lastActiveDate
      ? new Date(user.streakData.lastActiveDate)
      : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
    }

    // If already active today, no update needed
    if (lastActive && lastActive.getTime() === today.getTime()) {
      return;
    }

    // Calculate days difference
    const diffTime = lastActive ? today.getTime() - lastActive.getTime() : 0;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (!lastActive || diffDays === 1) {
      // Consecutive day - increment streak
      user.streakData.currentStreak += 1;
      user.streakData.maxStreak = Math.max(
        user.streakData.currentStreak,
        user.streakData.maxStreak
      );
    } else if (diffDays > 1) {
      // Missed days - reset streak
      user.streakData.currentStreak = 1;
    }

    user.streakData.lastActiveDate = today;
    await user.save();
  } catch (error) {
    console.error('Error updating streak:', error);
  }
};

/**
 * Award coins to user
 */
export const awardCoins = async (
  userId: string,
  amount: number
): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: { coins: amount },
    });
  } catch (error) {
    console.error('Error awarding coins:', error);
  }
};

/**
 * Get user's daily activity for heatmap
 */
export const getDailyActivity = async (
  _userId: string,
  days: number = 365
): Promise<Array<{ date: string; count: number }>> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // This would typically aggregate from submissions/progress
    // For now, returning empty array as placeholder
    // TODO: Implement actual aggregation from submissions
    return [];
  } catch (error) {
    console.error('Error getting daily activity:', error);
    return [];
  }
};

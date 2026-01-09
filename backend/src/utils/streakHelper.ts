import User from '../models/User';

/**
 * Calculate and update user streak
 */
export const updateUserStreak = async (userId: string): Promise<void> => {
  try {
    console.log('updateUserStreak called for userId:', userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return;
    }

    // Ensure maxStreak is never less than currentStreak (fix database inconsistency)
    if (user.streakData.maxStreak < user.streakData.currentStreak) {
      console.log('Fixing inconsistent maxStreak:', {
        currentStreak: user.streakData.currentStreak,
        oldMaxStreak: user.streakData.maxStreak
      });
      user.streakData.maxStreak = user.streakData.currentStreak;
      await user.save();
    }

    // Use IST (Indian Standard Time = UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const today = new Date(now.getTime() + istOffset);
    today.setUTCHours(0, 0, 0, 0);

    const lastActive = user.streakData.lastActiveDate
      ? new Date(new Date(user.streakData.lastActiveDate).getTime() + istOffset)
      : null;

    if (lastActive) {
      lastActive.setUTCHours(0, 0, 0, 0);
    }

    console.log('Current streak data:', {
      currentStreak: user.streakData.currentStreak,
      maxStreak: user.streakData.maxStreak,
      lastActiveDate: lastActive?.toISOString(),
      today: today.toISOString(),
      rawLastActive: user.streakData.lastActiveDate
    });

    // If already active today, no update needed
    if (lastActive && lastActive.getTime() === today.getTime()) {
      console.log('Already active today (IST), skipping update');
      return;
    }

    // Calculate days difference
    const diffTime = lastActive ? today.getTime() - lastActive.getTime() : 0;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    console.log('Days difference:', diffDays);

    if (!lastActive || diffDays === 1) {
      // Consecutive day - increment streak
      user.streakData.currentStreak += 1;
      user.streakData.maxStreak = Math.max(
        user.streakData.currentStreak,
        user.streakData.maxStreak
      );
      console.log('Streak incremented:', {
        newCurrentStreak: user.streakData.currentStreak,
        newMaxStreak: user.streakData.maxStreak
      });
    } else if (diffDays > 1) {
      // Missed days - reset streak
      user.streakData.currentStreak = 1;
      user.streakData.maxStreak = Math.max(1, user.streakData.maxStreak);
      console.log('Streak reset to 1 due to missed days');
    }

    // Ensure maxStreak is never less than currentStreak
    if (user.streakData.maxStreak < user.streakData.currentStreak) {
      user.streakData.maxStreak = user.streakData.currentStreak;
    }

    // Store date in UTC but it represents IST midnight
    user.streakData.lastActiveDate = new Date(today.getTime() - istOffset);
    await user.save();
    console.log('Streak saved successfully');
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

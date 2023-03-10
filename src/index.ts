import { formattedDate, buildStreak, updateStreak, KEY } from "./utils";

import type { Streak } from "./utils";

function shouldIncrementOrResetStreakCount(
  currentDate: Date,
  lastLoginDate: string
): "increment" | "reset" | "none" {
  const difference =
    currentDate.getDate() - parseInt(lastLoginDate.split("/")[1]);
  if (difference === 0) {
    return "none";
  }

  if (difference === 1) {
    return "increment";
  }

  return "reset";
}

export function streakCounter(storage: Storage, date: Date): Streak {
  const streakInLocalStorage = storage.getItem(KEY);
  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage) as Streak;
      const state = shouldIncrementOrResetStreakCount(
        date,
        streak.lastLoginDate
      );
      const SHOULD_INCREMENT = state === "increment";
      const SHOULD_RESET = state === "reset";

      if (SHOULD_INCREMENT) {
        const updatedStreak = buildStreak(date, {
          startDate: streak.startDate,
          currentCount: streak.currentCount + 1,
          lastLoginDate: formattedDate(date),
        });
        updateStreak(storage, updatedStreak);

        return updatedStreak;
      }

      if (SHOULD_RESET) {
        const updatedStreak = buildStreak(date);
        updateStreak(storage, updatedStreak);

        return updatedStreak;
      }

      return streak;
    } catch (error) {
      console.log("Error parsing streak from localStorage", error);
    }
  }

  const streak = buildStreak(date);

  updateStreak(storage, streak);

  return streak;
}

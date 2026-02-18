<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Streak</h2>
      <div class="text-3xl">🔥</div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20">
        <div class="text-4xl font-bold text-teal-600 dark:text-teal-400">
          {{ currentStreak }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Current Streak
        </div>
      </div>

      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
        <div class="text-4xl font-bold text-amber-600 dark:text-amber-400">
          {{ bestStreak }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Best Streak
        </div>
      </div>
    </div>

    <div class="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
      <p class="text-xs text-gray-600 dark:text-gray-400 text-center">
        Complete at least 1 Pomodoro session daily to maintain your streak
      </p>
    </div>
  </div>
</template>

<script setup>
const { currentStreak, bestStreak } = useStreak();
</script>

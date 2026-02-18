<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Achievements</h2>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div
        v-for="badge in badges"
        :key="badge.id"
        class="text-center p-4 rounded-xl transition-all duration-300"
        :class="badge.unlocked
          ? 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 scale-100'
          : 'bg-gray-100 dark:bg-gray-700/30 opacity-40 grayscale'"
      >
        <div class="text-4xl mb-2 transition-transform duration-300" :class="{ 'scale-110': badge.unlocked }">
          {{ badge.icon }}
        </div>
        <div class="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {{ badge.name }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {{ badge.description }}
        </div>
      </div>
    </div>

    <div v-if="unlockedBadges.length > 0" class="mt-4 p-3 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
      <p class="text-sm text-center text-gray-700 dark:text-gray-300">
        <span class="font-semibold">{{ unlockedBadges.length }}</span> / {{ badges.length }} badges unlocked
      </p>
    </div>
  </div>
</template>

<script setup>
const { badges, unlockedBadges } = useBadges();
</script>

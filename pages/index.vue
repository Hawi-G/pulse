<template>
  <div class="min-h-screen transition-colors duration-200">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <header class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-3">
          <div class="text-4xl">💓</div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Pulse
          </h1>
        </div>

        <button
          @click="toggleDarkMode"
          class="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          <svg v-if="isDark" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <PomodoroTimer />
          <TodoList />
        </div>

        <div class="space-y-6">
          <StreakCard />
          <BadgeDisplay />
        </div>
      </div>

      <footer class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Stay focused, stay consistent</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
};

onMounted(() => {
  if (process.client) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }

    const { currentStreak, bestStreak } = useStreak();
    const { totalSessions } = usePomodoro();
    const { checkAndUnlockBadges } = useBadges();

    watch([currentStreak, totalSessions], () => {
      checkAndUnlockBadges(currentStreak.value, totalSessions.value);
    });
  }
});

useHead({
  htmlAttrs: {
    lang: 'en'
  }
});
</script>

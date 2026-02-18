export const useStreak = () => {
  const currentStreak = ref(0);
  const bestStreak = ref(0);
  const lastSessionDate = ref(null);

  const loadStreak = () => {
    if (process.client) {
      const saved = localStorage.getItem('streak');
      if (saved) {
        const data = JSON.parse(saved);
        currentStreak.value = data.currentStreak || 0;
        bestStreak.value = data.bestStreak || 0;
        lastSessionDate.value = data.lastSessionDate || null;

        checkAndResetStreak();
      }
    }
  };

  const saveStreak = () => {
    if (process.client) {
      localStorage.setItem('streak', JSON.stringify({
        currentStreak: currentStreak.value,
        bestStreak: bestStreak.value,
        lastSessionDate: lastSessionDate.value
      }));
    }
  };

  const getDateKey = (date = new Date()) => {
    return date.toISOString().split('T')[0];
  };

  const checkAndResetStreak = () => {
    if (!lastSessionDate.value) return;

    const today = getDateKey();
    const lastDate = getDateKey(new Date(lastSessionDate.value));
    const yesterday = getDateKey(new Date(Date.now() - 86400000));

    if (lastDate !== today && lastDate !== yesterday) {
      currentStreak.value = 0;
      saveStreak();
    }
  };

  const recordPomodoroSession = () => {
    const today = getDateKey();
    const lastDate = lastSessionDate.value ? getDateKey(new Date(lastSessionDate.value)) : null;

    if (lastDate !== today) {
      const yesterday = getDateKey(new Date(Date.now() - 86400000));

      if (lastDate === yesterday || lastDate === null) {
        currentStreak.value++;
      } else {
        currentStreak.value = 1;
      }

      if (currentStreak.value > bestStreak.value) {
        bestStreak.value = currentStreak.value;
      }

      lastSessionDate.value = new Date().toISOString();
      saveStreak();
    }
  };

  onMounted(() => {
    loadStreak();
  });

  return {
    currentStreak: computed(() => currentStreak.value),
    bestStreak: computed(() => bestStreak.value),
    recordPomodoroSession,
    loadStreak
  };
};

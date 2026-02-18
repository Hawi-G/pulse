import { ref, computed, watch, onMounted } from 'vue';

export function usePomodoro() {
  // Timer settings
  const focusMinutes = ref(25);
  const breakMinutes = ref(5);

  // Timer state
  const timeLeft = ref(focusMinutes.value * 60);
  const isRunning = ref(false);
  const isBreak = ref(false);

  // Session stats
  const completedSessions = ref(0);
  const totalSessions = ref(0);

  // Daily goal
  const dailyGoal = ref(4);
  const goalReached = ref(false);

  let timer = null;

  // Format time
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeLeft.value % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  // Play sound
  const playSound = (file) => {
    const audio = new Audio(`/${file}`);
    audio.play();
  };

  // Start timer
  const start = () => {
    if (isRunning.value) return;
    isRunning.value = true;

    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(timer);
        isRunning.value = false;

        // Switch session
        if (!isBreak.value) {
          completedSessions.value++;
          totalSessions.value++;

          if (completedSessions.value >= dailyGoal.value) {
            goalReached.value = true;
          }

          isBreak.value = true;
          timeLeft.value = breakMinutes.value * 60;
          playSound('bell.mp3'); // break start
        } else {
          isBreak.value = false;
          timeLeft.value = focusMinutes.value * 60;
          playSound('belll.mp3'); // focus start
        }
      }
    }, 1000);
  };

  const pause = () => {
    clearInterval(timer);
    isRunning.value = false;
  };

  const reset = () => {
    clearInterval(timer);
    isRunning.value = false;
    isBreak.value = false;
    timeLeft.value = focusMinutes.value * 60;
  };

  const updateDurations = (focus, brk) => {
    focusMinutes.value = focus;
    breakMinutes.value = brk;
    reset();
  };

  const updateGoal = (goal) => {
    dailyGoal.value = goal;
    goalReached.value = completedSessions.value >= goal;
  };

  // -----------------------------
  // ✅ LOCAL STORAGE
  // -----------------------------
  onMounted(() => {
    if (localStorage.getItem('pomodoro')) {
      const data = JSON.parse(localStorage.getItem('pomodoro'));
      focusMinutes.value = data.focusMinutes ?? focusMinutes.value;
      breakMinutes.value = data.breakMinutes ?? breakMinutes.value;
      completedSessions.value = data.completedSessions ?? 0;
      totalSessions.value = data.totalSessions ?? 0;
      dailyGoal.value = data.dailyGoal ?? dailyGoal.value;
      isBreak.value = data.isBreak ?? false;
      timeLeft.value = data.timeLeft ?? (isBreak.value ? breakMinutes.value * 60 : focusMinutes.value * 60);
    }
  });

  // Watch all relevant state and save
  watch(
    [focusMinutes, breakMinutes, completedSessions, totalSessions, dailyGoal, isBreak, timeLeft],
    () => {
      localStorage.setItem(
        'pomodoro',
        JSON.stringify({
          focusMinutes: focusMinutes.value,
          breakMinutes: breakMinutes.value,
          completedSessions: completedSessions.value,
          totalSessions: totalSessions.value,
          dailyGoal: dailyGoal.value,
          isBreak: isBreak.value,
          timeLeft: timeLeft.value
        })
      );
    },
    { deep: true }
  );

  return {
    formattedTime,
    isRunning,
    isBreak,
    timeLeft,
    completedSessions,
    totalSessions,
    focusMinutes,
    breakMinutes,
    dailyGoal,
    goalReached,
    start,
    pause,
    reset,
    updateDurations,
    updateGoal
  };
}

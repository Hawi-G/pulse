import { ref, computed, watch, onMounted } from 'vue'
import { useStreak } from '~/composables/useStreak'

export function usePomodoro() {
  const focusMinutes = ref(25)
  const breakMinutes = ref(5)

  const timeLeft = ref(focusMinutes.value * 60)
  const isRunning = ref(false)
  const isBreak = ref(false)

  const completedSessions = ref(0)
  const totalSessions = ref(0)
  const dailyGoal = ref(4)
  const goalReached = ref(false)

  const autoStart = ref(true) // auto-start break

  // Track sessions today
  const todayKey = ref(new Date().toISOString().split('T')[0])
  const completedSessionsToday = ref(0)

  const { recordPomodoroSession } = useStreak()

  let timer = null

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (timeLeft.value % 60)
      .toString()
      .padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  const playSound = (file) => {
    try {
      const audio = new Audio(`/sounds/${file}`)
      audio.play().catch(() => {})
    } catch (err) {
      console.error('Error playing sound', err)
    }
  }

  const start = () => {
    if (isRunning.value) return
    isRunning.value = true

    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        // Session ended
        if (!isBreak.value) {
          // Focus ended → break
          completedSessions.value++
          totalSessions.value++
          completedSessionsToday.value++
          if (completedSessions.value >= dailyGoal.value) goalReached.value = true

          recordPomodoroSession() // update streak

          isBreak.value = true
          timeLeft.value = breakMinutes.value * 60
          playSound('bell.mp3')

          // Auto-continue break
          if (!autoStart.value) {
            clearInterval(timer)
            isRunning.value = false
            timer = null
          }
        } else {
          // Break ended → focus
          isBreak.value = false
          timeLeft.value = focusMinutes.value * 60
          playSound('belll.mp3')

          // Pause until user starts next focus
          clearInterval(timer)
          isRunning.value = false
          timer = null
        }

        saveTodaySession()
      }
    }, 1000)
  }

  const pause = () => {
    clearInterval(timer)
    timer = null
    isRunning.value = false
  }

  const reset = () => {
    clearInterval(timer)
    timer = null
    isRunning.value = false
    isBreak.value = false
    timeLeft.value = focusMinutes.value * 60
  }

  const updateDurations = (focus, brk) => {
    focusMinutes.value = focus
    breakMinutes.value = brk
    reset()
  }

  const updateGoal = (goal) => {
    dailyGoal.value = goal
    goalReached.value = completedSessions.value >= goal
  }

  const saveTodaySession = () => {
    const data = {
      focusMinutes: focusMinutes.value,
      breakMinutes: breakMinutes.value,
      completedSessions: completedSessions.value,
      totalSessions: totalSessions.value,
      dailyGoal: dailyGoal.value,
      isBreak: isBreak.value,
      timeLeft: timeLeft.value,
      todayKey: todayKey.value,
      completedSessionsToday: completedSessionsToday.value
    }
    localStorage.setItem('pomodoro', JSON.stringify(data))
  }

  onMounted(() => {
    if (localStorage.getItem('pomodoro')) {
      const data = JSON.parse(localStorage.getItem('pomodoro'))

      focusMinutes.value = data.focusMinutes ?? focusMinutes.value
      breakMinutes.value = data.breakMinutes ?? breakMinutes.value
      completedSessions.value = data.completedSessions ?? 0
      totalSessions.value = data.totalSessions ?? 0
      dailyGoal.value = data.dailyGoal ?? dailyGoal.value
      isBreak.value = data.isBreak ?? false
      timeLeft.value = data.timeLeft ?? (isBreak.value ? breakMinutes.value * 60 : focusMinutes.value * 60)

      const savedDate = data.todayKey
      const today = new Date().toISOString().split('T')[0]

      if (savedDate === today) {
        completedSessionsToday.value = data.completedSessionsToday ?? 0
      } else {
        completedSessionsToday.value = 0
      }

      todayKey.value = today
    }
  })

  watch(
    [focusMinutes, breakMinutes, completedSessions, totalSessions, dailyGoal, isBreak, timeLeft, completedSessionsToday],
    () => {
      saveTodaySession()
    },
    { deep: true }
  )

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
    autoStart,
    completedSessionsToday,
    start,
    pause,
    reset,
    updateDurations,
    updateGoal
  }
}

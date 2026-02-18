<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePomodoro } from '~/composables/usePomodoro'
import confetti from 'canvas-confetti'

const {
  formattedTime,
  isRunning,
  isBreak,
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
} = usePomodoro()

const focusMinutesInput = ref(focusMinutes.value)
const breakMinutesInput = ref(breakMinutes.value)
const dailyGoalInput = ref(dailyGoal.value)

// Apply durations
const applySettings = () => {
  updateDurations(focusMinutesInput.value, breakMinutesInput.value)
}

// Apply daily goal
const applyGoal = () => {
  updateGoal(dailyGoalInput.value)
}

// Request notifications
onMounted(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  }
})

// 🎆 CONFETTI TRIGGER
watch(goalReached, (newVal) => {
  if (newVal) {
    // Firework/confetti for 2 seconds
    const duration = 2 * 1000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }
})
</script>

<template>
  <div class="card p-6">
    <div class="flex flex-col items-center space-y-6">
      <!-- Timer Icon -->
      <div class="flex items-center space-x-3">
        <div
          class="text-6xl transition-transform duration-300"
          :class="{ 'animate-heartbeat': isRunning }"
        >
          {{ isBreak ? '☕' : '💓' }}
        </div>
      </div>

      <!-- Timer Display -->
      <div class="text-center">
        <div class="text-6xl font-bold text-teal-600 dark:text-teal-400 font-mono">
          {{ formattedTime }}
        </div>
        <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ isBreak ? 'Break Time' : 'Focus Time' }}
        </div>
      </div>

      <!-- Controls -->
      <div class="flex space-x-3 w-full justify-center">
        <button v-if="!isRunning" @click="start" class="btn-primary flex-1 max-w-[120px]">Start</button>
        <button v-else @click="pause" class="btn-secondary flex-1 max-w-[120px]">Pause</button>
        <button
          @click="reset"
          class="btn-secondary flex-1 max-w-[120px]"
          :disabled="!isRunning && formattedTime === (isBreak ? breakMinutes.value * 60 : focusMinutes.value * 60)"
        >
          Reset
        </button>
      </div>

      <!-- Stats -->
      <div class="w-full pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <div class="flex justify-between text-sm">
          <span>Today's Sessions</span>
          <span class="font-semibold text-teal-600 dark:text-teal-400">{{ completedSessions }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>Total Sessions</span>
          <span class="font-semibold text-teal-600 dark:text-teal-400">{{ totalSessions }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span>Daily Goal</span>
          <span class="font-semibold text-teal-600 dark:text-teal-400">{{ completedSessions }} / {{ dailyGoal }}</span>
        </div>
      </div>

      <!-- Timer Settings -->
      <div class="w-full pt-4 border-t border-gray-200 dark:border-gray-700 mt-4 space-y-2">
        <label class="text-gray-600 dark:text-gray-400 text-sm">Focus Minutes</label>
        <input v-model.number="focusMinutesInput" type="number" min="1" class="input w-full" />

        <label class="text-gray-600 dark:text-gray-400 text-sm mt-2">Break Minutes</label>
        <input v-model.number="breakMinutesInput" type="number" min="1" class="input w-full" />

        <button @click="applySettings" class="btn-primary mt-2 w-full">Apply Durations</button>

        <label class="text-gray-600 dark:text-gray-400 text-sm mt-4">Daily Session Goal</label>
        <input v-model.number="dailyGoalInput" type="number" min="1" class="input w-full" />

        <button @click="applyGoal" class="btn-primary mt-2 w-full">Set Goal</button>
      </div>
    </div>
  </div>
</template>

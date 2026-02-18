<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Tasks</h2>

    <form @submit.prevent="handleAddTodo" class="mb-4">
      <div class="flex space-x-2">
        <input
          v-model="newTodoText"
          type="text"
          placeholder="Add a new task..."
          class="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />
        <button
          type="submit"
          class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>
    </form>

    <div v-if="todos.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      No tasks yet. Add one above!
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
          class="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-500 cursor-pointer"
        />
        <span
          class="flex-1 transition-all"
          :class="{ 'line-through text-gray-400 dark:text-gray-500': todo.completed }"
        >
          {{ todo.text }}
        </span>
        <button
          @click="deleteTodo(todo.id)"
          class="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="todos.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{{ completedCount }} / {{ todos.length }} completed</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
const newTodoText = ref('');

const completedCount = computed(() => {
  return todos.value.filter(t => t.completed).length;
});

const handleAddTodo = () => {
  if (newTodoText.value.trim()) {
    addTodo(newTodoText.value);
    newTodoText.value = '';
  }
};
</script>

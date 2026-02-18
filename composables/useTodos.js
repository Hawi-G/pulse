export const useTodos = () => {
  const todos = ref([]);

  const loadTodos = () => {
    if (process.client) {
      const saved = localStorage.getItem('todos');
      if (saved) {
        todos.value = JSON.parse(saved);
      }
    }
  };

  const saveTodos = () => {
    if (process.client) {
      localStorage.setItem('todos', JSON.stringify(todos.value));
    }
  };

  const addTodo = (text) => {
    if (!text.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.value.push(newTodo);
    saveTodos();
  };

  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
    }
  };

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id);
    saveTodos();
  };

  onMounted(() => {
    loadTodos();
  });

  return {
    todos: computed(() => todos.value),
    addTodo,
    toggleTodo,
    deleteTodo
  };
};

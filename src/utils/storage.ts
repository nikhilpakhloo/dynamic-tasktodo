import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Todo } from '../types/todo';

export const TODOS_STORAGE_KEY = '@dynamic_todo_app/todos';

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    todo.title.trim().length > 0 &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number' &&
    Number.isFinite(todo.createdAt) &&
    typeof todo.updatedAt === 'number' &&
    Number.isFinite(todo.updatedAt)
  );
};

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const storedTodos = await AsyncStorage.getItem(TODOS_STORAGE_KEY);

    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);
    return Array.isArray(parsedTodos) ? parsedTodos.filter(isTodo) : [];
  } catch {
    return [];
  }
};

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Persistence should never make the app unusable.
  }
};

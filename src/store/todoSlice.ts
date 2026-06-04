import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../types/todo';

type TodoState = {
  items: Todo[];
  lastDeletedTodo: Todo | null;
  hydrated: boolean;
};

const initialState: TodoState = {
  items: [],
  lastDeletedTodo: null,
  hydrated: false,
};

const createTodo = (title: string): Todo => {
  const now = Date.now();

  return {
    id: `${now}-${Math.random().toString(36).slice(2, 10)}`,
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
};

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const title = action.payload.trim();

      if (!title) {
        return;
      }

      state.items.unshift(createTodo(title));
    },
    editTodo: (
      state,
      action: PayloadAction<{ id: string; title: string }>,
    ) => {
      const title = action.payload.title.trim();

      if (!title) {
        return;
      }

      const todo = state.items.find(item => item.id === action.payload.id);

      if (todo && !todo.completed) {
        todo.title = title;
        todo.updatedAt = Date.now();
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      const todoIndex = state.items.findIndex(item => item.id === action.payload);

      if (todoIndex >= 0) {
        const [deletedTodo] = state.items.splice(todoIndex, 1);
        state.lastDeletedTodo = deletedTodo;
      }
    },
    undoDelete: state => {
      if (state.lastDeletedTodo) {
        state.items.unshift({
          ...state.lastDeletedTodo,
          updatedAt: Date.now(),
        });
        state.lastDeletedTodo = null;
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);

      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = Date.now();
      }
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
      state.lastDeletedTodo = null;
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hydrated = action.payload;
    },
  },
});

export const {
  addTodo,
  editTodo,
  deleteTodo,
  undoDelete,
  toggleTodo,
  setTodos,
  setHydrated,
} = todoSlice.actions;

export default todoSlice.reducer;

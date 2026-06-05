import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ProgressSummary from './src/components/ProgressSummary';
import TodoInput from './src/components/TodoInput';
import TodoItem from './src/components/TodoItem';
import { STRINGS } from './src/constants/strings';
import { store, useAppDispatch, useAppSelector } from './src/store';
import {
  addTodo,
  deleteTodo,
  editTodo,
  setHydrated,
  setTodos,
  toggleTodo,
  undoDelete,
} from './src/store/todoSlice';
import type { Todo } from './src/types/todo';
import { loadTodos, saveTodos } from './src/utils/storage';
import { ThemeProvider, useTheme, type AppTheme } from './src/theme/theme';

function App() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider colorScheme={colorScheme}>
          <AppStatusBar />
          <TodoApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

function AppStatusBar() {
  const theme = useTheme();

  return (
    <StatusBar
      barStyle={theme.statusBarStyle}
      backgroundColor={theme.colors.background}
    />
  );
}

function TodoApp() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useAppDispatch();
  const todos = useAppSelector(state => state.todos.items);
  const lastDeletedTodo = useAppSelector(state => state.todos.lastDeletedTodo);
  const hydrated = useAppSelector(state => state.todos.hydrated);

  useEffect(() => {
    let isMounted = true;

    const hydrateTodos = async () => {
      const storedTodos = await loadTodos();

      if (isMounted) {
        dispatch(setTodos(storedTodos));
        dispatch(setHydrated(true));
      }
    };

    hydrateTodos();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (hydrated) {
      const saveTimer = setTimeout(() => {
        saveTodos(todos);
      }, 300);

      return () => clearTimeout(saveTimer);
    }
  }, [hydrated, todos]);

  useEffect(() => {
    if (hydrated) {
      BootSplash.hide({ fade: true });
    }
  }, [hydrated]);

  const handleAddTodo = useCallback(
    (title: string) => {
      dispatch(addTodo(title));
    },
    [dispatch],
  );

  const handleEditTodo = useCallback(
    (id: string, title: string) => {
      dispatch(editTodo({ id, title }));
    },
    [dispatch],
  );

  const handleDeleteTodo = useCallback(
    (id: string) => {
      dispatch(deleteTodo(id));
    },
    [dispatch],
  );

  const handleToggleTodo = useCallback(
    (id: string) => {
      dispatch(toggleTodo(id));
    },
    [dispatch],
  );

  const handleUndoDelete = useCallback(() => {
    dispatch(undoDelete());
  }, [dispatch]);

  const renderTodo = useCallback(
    ({ item }: { item: Todo }) => (
      <TodoItem
        todo={item}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
        onToggle={handleToggleTodo}
      />
    ),
    [handleDeleteTodo, handleEditTodo, handleToggleTodo],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{STRINGS.appTitle}</Text>
          <Text style={styles.subtitle}>{STRINGS.appSubtitle}</Text>

          <TodoInput onAddTodo={handleAddTodo} />
          {todos.length > 0 ? <ProgressSummary todos={todos} /> : null}

          {lastDeletedTodo ? (
            <View style={styles.undoBar}>
              <Text numberOfLines={1} style={styles.undoText}>
                {STRINGS.deletedTodo(lastDeletedTodo.title)}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleUndoDelete}
                style={styles.undoButton}
              >
                <Text style={styles.undoButtonText}>{STRINGS.undoButton}</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <FlatList
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="automatic"
            data={todos}
            renderItem={renderTodo}
            keyExtractor={item => item.id}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>{STRINGS.emptyTitle}</Text>
                <Text style={styles.emptyText}>
                  {STRINGS.emptyDescription}
                </Text>
              </View>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.mutedText,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 22,
  },
  undoBar: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: theme.colors.snackbarBackground,
  },
  undoText: {
    flex: 1,
    color: theme.colors.snackbarText,
    fontSize: 14,
  },
  undoButton: {
    minHeight: 34,
    minWidth: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.snackbarButtonBackground,
  },
  undoButtonText: {
    color: theme.colors.snackbarButtonText,
    fontSize: 13,
    fontWeight: '800',
  },
  list: {
    flex: 1,
    minHeight: 0,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    maxWidth: 260,
    marginTop: 8,
    color: theme.colors.mutedText,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 21,
  },
});

export default App;

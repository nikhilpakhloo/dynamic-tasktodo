import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutLeft,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { STRINGS } from '../constants/strings';
import { useTheme, type AppTheme } from '../theme/theme';
import type { Todo } from '../types/todo';

type TodoItemProps = {
  todo: Todo;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onToggle: (id: string) => void;
};

function TodoItem({ todo, onDelete, onEdit, onToggle }: TodoItemProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const completionScale = useSharedValue(todo.completed ? 1 : 0);

  useEffect(() => {
    completionScale.value = withSpring(todo.completed ? 1 : 0, {
      damping: 14,
      stiffness: 180,
    });
  }, [completionScale, todo.completed]);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 + completionScale.value * 0.08,
      },
    ],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - completionScale.value * 0.28,
  }));

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  const handleStartEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(true);
  }, [todo.title]);

  const handleCancelEdit = useCallback(() => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  }, [todo.title]);

  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = draftTitle.trim();

    if (!trimmedTitle) {
      return;
    }

    onEdit(todo.id, trimmedTitle);
    setIsEditing(false);
  }, [draftTitle, onEdit, todo.id]);

  return (
    <Animated.View
      entering={FadeInDown.duration(220).springify()}
      exiting={FadeOutLeft.duration(180)}
      layout={LinearTransition.springify().damping(18).stiffness(180)}
      style={styles.container}
    >
      <Animated.View style={checkAnimatedStyle}>
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: todo.completed }}
          onPress={handleToggle}
          style={[styles.check, todo.completed && styles.checkComplete]}
        >
          <Text style={styles.checkText}>
            {todo.completed ? STRINGS.checkMark : ''}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.content}>
        {isEditing ? (
          <TextInput
            accessibilityLabel={STRINGS.editTodoAccessibilityLabel}
            autoFocus
            value={draftTitle}
            onChangeText={setDraftTitle}
            onSubmitEditing={handleSaveEdit}
            returnKeyType="done"
            style={styles.editInput}
          />
        ) : (
          <Animated.Text
            numberOfLines={2}
            style={[
              styles.title,
              titleAnimatedStyle,
              todo.completed && styles.titleComplete,
            ]}
          >
            {todo.title}
          </Animated.Text>
        )}
      </View>

      {isEditing ? (
        <View style={styles.actions}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={!draftTitle.trim()}
            onPress={handleSaveEdit}
            style={[
              styles.actionButton,
              styles.saveButton,
              !draftTitle.trim() && styles.actionDisabled,
            ]}
          >
            <Text style={styles.saveText}>{STRINGS.saveButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleCancelEdit}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>{STRINGS.cancelButton}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          {!todo.completed ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleStartEdit}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>{STRINGS.editButton}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleDelete}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Text style={styles.deleteText}>{STRINGS.deleteButton}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
      backgroundColor: theme.colors.surface,
    },
    check: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.softText,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkComplete: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    checkText: {
      color: theme.colors.primaryText,
      fontSize: 16,
      fontWeight: '900',
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      lineHeight: 22,
    },
    titleComplete: {
      color: theme.colors.softText,
      textDecorationLine: 'line-through',
    },
    editInput: {
      minHeight: 42,
      borderWidth: 1,
      borderColor: theme.colors.focusBorder,
      borderRadius: 8,
      paddingHorizontal: 10,
      color: theme.colors.text,
      fontSize: 16,
      backgroundColor: theme.colors.surfaceRaised,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      minHeight: 36,
      minWidth: 58,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      backgroundColor: theme.colors.subtleSurface,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    deleteButton: {
      backgroundColor: theme.colors.dangerSurface,
    },
    actionDisabled: {
      backgroundColor: theme.colors.primaryDisabled,
    },
    actionText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '700',
    },
    saveText: {
      color: theme.colors.primaryText,
      fontSize: 13,
      fontWeight: '700',
    },
    deleteText: {
      color: theme.colors.danger,
      fontSize: 13,
      fontWeight: '700',
    },
  });

export default memo(TodoItem);

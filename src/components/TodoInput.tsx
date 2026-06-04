import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { STRINGS } from '../constants/strings';
import { useTheme, type AppTheme } from '../theme/theme';

type TodoInputProps = {
  onAddTodo: (title: string) => void;
};

function TodoInput({ onAddTodo }: TodoInputProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [title, setTitle] = useState('');

  const handleAddTodo = useCallback(() => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    onAddTodo(trimmedTitle);
    setTitle('');
  }, [onAddTodo, title]);

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel={STRINGS.addTodoAccessibilityLabel}
        placeholder={STRINGS.addTodoPlaceholder}
        placeholderTextColor={theme.colors.placeholder}
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleAddTodo}
        returnKeyType="done"
        style={styles.input}
      />
      <TouchableOpacity
        accessibilityRole="button"
        disabled={!title.trim()}
        onPress={handleAddTodo}
        style={[styles.button, !title.trim() && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>{STRINGS.addButton}</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontSize: 16,
  },
  button: {
    minWidth: 76,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.primaryDisabled,
  },
  buttonText: {
    color: theme.colors.primaryText,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default memo(TodoInput);

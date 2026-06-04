import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { STRINGS } from '../constants/strings';
import { useTheme, type AppTheme } from '../theme/theme';
import type { Todo } from '../types/todo';

type ProgressSummaryProps = {
  todos: Todo[];
};

function ProgressSummary({ todos }: ProgressSummaryProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const progress = todos.length === 0 ? 0 : completedCount / todos.length;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{STRINGS.progressTitle}</Text>
        <Text style={styles.percentage}>
          {STRINGS.progressPercentage(percentage)}
        </Text>
      </View>
      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        borderRadius={5}
        borderWidth={0}
        color={theme.colors.primary}
        unfilledColor={theme.colors.progressTrack}
      />
      <Text style={styles.count}>
        {STRINGS.progressCount(completedCount, todos.length)}
      </Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  percentage: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  count: {
    marginTop: 10,
    color: theme.colors.mutedText,
    fontSize: 14,
  },
});

export default memo(ProgressSummary);

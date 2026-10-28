import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: AppButtonProps) {
  const inactive = disabled || loading;
  const outline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.outline : styles.primary,
        inactive && styles.inactive,
        pressed && !inactive && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? theme.colors.primary : '#FFFFFF'} />
      ) : (
        <Text style={[styles.title, outline ? styles.outlineTitle : styles.primaryTitle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primary: { backgroundColor: theme.colors.primary },
  outline: { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, borderWidth: 1 },
  inactive: { opacity: 0.6 },
  pressed: { opacity: 0.85 },
  title: { fontWeight: '700', fontSize: 16 },
  primaryTitle: { color: '#FFFFFF' },
  outlineTitle: { color: theme.colors.primary },
});

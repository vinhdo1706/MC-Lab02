import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { TrainingSession } from '../../auth/types';

interface TrainingSessionItemProps {
  session: TrainingSession;
}

export function TrainingSessionItem({ session }: TrainingSessionItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>●</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.day}>{session.day}</Text>
      </View>
      <Text style={styles.duration}>{session.durationMinutes} min</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderColor: theme.colors.border },
  icon: { width: 39, height: 39, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primarySoft },
  iconText: { color: theme.colors.primary, fontSize: 15 },
  info: { flex: 1, marginHorizontal: 12 },
  title: { fontSize: 15, fontWeight: '700', color: theme.colors.ink },
  day: { fontSize: 13, color: theme.colors.muted, marginTop: 4 },
  duration: { fontSize: 12, color: theme.colors.primary, fontWeight: '700' },
});

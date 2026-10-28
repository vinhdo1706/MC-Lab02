import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { theme } from '../../constants/theme';
import { useAuth } from '../auth/AuthContext';
import { TrainingSessionItem } from './components/TrainingSessionItem';

export function FitnessScreen() {
  const { user, logout } = useAuth();

  // The route itself redirects guests before rendering this screen.
  if (!user) return null;

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topLine}>
          <Text style={styles.appName}>FITNESS POCKET</Text>
          <Text style={styles.greeting}>MY DASHBOARD</Text>
        </View>

        <Text style={styles.heading}>Welcome back!</Text>
        <Text style={styles.subtitle}>Here is your membership and training plan.</Text>

        <View style={styles.memberCard}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>MA</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.memberName}>{user.fullName}</Text>
            <Text style={styles.memberCode}>Member ID: {user.memberCode}</Text>
          </View>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>ACTIVE</Text>
          </View>
          <View style={styles.separator} />
          <Text style={styles.infoLabel}>MEMBERSHIP PLAN</Text>
          <Text style={styles.planName}>{user.planName}</Text>
        </View>

        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            <Text style={styles.count}>{user.sessions.length} sessions</Text>
          </View>
          {user.sessions.map((session) => (
            <TrainingSessionItem key={session.id} session={session} />
          ))}
        </View>

        <View style={styles.logout}>
          <AppButton title="Log Out" onPress={handleLogout} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  content: { flexGrow: 1, padding: 22, paddingBottom: 36 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginBottom: 26 },
  appName: { color: theme.colors.primary, fontSize: 12, letterSpacing: 1.5, fontWeight: '800' },
  greeting: { color: theme.colors.muted, fontSize: 11, fontWeight: '700' },
  heading: { fontSize: 28, fontWeight: '800', color: theme.colors.ink },
  subtitle: { fontSize: 14, marginTop: 6, marginBottom: 24, color: theme.colors.muted },
  memberCard: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: 18,
    borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center', alignItems: 'center' },
  initials: { fontSize: 20, fontWeight: '800', color: theme.colors.primary },
  profileText: { flex: 1, marginLeft: 13 },
  memberName: { fontSize: 17, fontWeight: '800', color: theme.colors.ink },
  memberCode: { fontSize: 12, color: theme.colors.muted, marginTop: 5 },
  planBadge: { backgroundColor: theme.colors.primarySoft, paddingVertical: 6,
    paddingHorizontal: 8, borderRadius: 8 },
  planBadgeText: { fontSize: 9, fontWeight: '800', color: theme.colors.primary },
  separator: { height: 1, backgroundColor: theme.colors.border, width: '100%', marginVertical: 19 },
  infoLabel: { width: '100%', color: theme.colors.muted, fontSize: 11, letterSpacing: 0.7, fontWeight: '700' },
  planName: { width: '100%', color: theme.colors.ink, fontSize: 18, fontWeight: '800', marginTop: 7 },
  listCard: { backgroundColor: theme.colors.surface, borderRadius: 18,
    paddingHorizontal: 20, paddingTop: 20, marginTop: 20, borderWidth: 1, borderColor: theme.colors.border },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: theme.colors.ink },
  count: { color: theme.colors.primary, fontWeight: '700', fontSize: 12 },
  logout: { marginTop: 23 },
});

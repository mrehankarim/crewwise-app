import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <LogOut size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.profileCard, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user?.name || 'John Smith')}</Text>
          </View>
          <Text style={[styles.nameText, { color: theme.text }]}>{user?.name || 'John Smith'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{(user?.role || 'TECHNICIAN').toUpperCase()}</Text>
          </View>
          <Text style={styles.idText}>ID: {user?._id?.substring(0, 8) || '23788'}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#f3e5f5' }]}>
            <Text style={[styles.statValue, { color: '#8e24aa' }]}>4.7</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#fff3e0' }]}>
            <Text style={[styles.statValue, { color: '#e65100' }]}>37</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#e8f5e9' }]}>
            <Text style={[styles.statValue, { color: '#2e7d32' }]}>4</Text>
            <Text style={styles.statLabel}>Jobs completed</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#e3f2fd' }]}>
            <Text style={[styles.statValue, { color: '#1565c0' }]}>99.7</Text>
            <Text style={styles.statLabel}>On Time %</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Professional Summary</Text>
          <Text style={[styles.summaryText, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0066FF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutBtn: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 60 : 40,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -40,
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  idText: {
    fontSize: 12,
    color: '#999',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statBox: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
  }
});

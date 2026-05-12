import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { api } from '@/api/axios';
import { Bell } from 'lucide-react-native';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (error) {
      console.log('Error fetching notifications', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = ({ item }: { item: any }) => (
    <View style={[styles.notificationCard, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.isRead ? '#f5f5f5' : '#e3f2fd' }]}>
        <Bell size={20} color={item.isRead ? '#999' : '#0066FF'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text, fontWeight: item.isRead ? 'normal' : 'bold' }]}>
          {item.title || 'Notification'}
        </Text>
        <Text style={[styles.message, { color: colorScheme === 'dark' ? '#ccc' : '#666' }]}>
          {item.message || 'You have a new update.'}
        </Text>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={40} color="#ccc" style={{ marginBottom: 15 }} />
            <Text style={[styles.emptyText, { color: theme.text }]}>No notifications right now.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20 },
  notificationCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, marginBottom: 5 },
  message: { fontSize: 14, lineHeight: 20, marginBottom: 5 },
  timeText: { fontSize: 12, color: '#999' },
  emptyContainer: { padding: 50, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Calendar, Clock, CheckCircle } from 'lucide-react-native';

export default function AttendanceScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [refreshing, setRefreshing] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  // Mock data
  const todayDate = "26-03-2025";
  const checkInTime = "8:30 AM";
  const checkOutTime = "--:-- AM";

  const onRefresh = async () => {
    setRefreshing(true);
    // Add real API logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleToggleAttendance = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSub}>Track your progress</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Today's Attendance Card */}
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={16} color="#0066FF" style={{ marginRight: 5 }} />
              <Text style={[styles.cardDate, { color: theme.text }]}>Today: {todayDate}</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{isCheckedIn ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>

          <View style={styles.timeBlocks}>
            <View style={styles.timeBlock}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <CheckCircle size={12} color="#14B8A6" style={{ marginRight: 5 }} />
                <Text style={styles.timeLabel}>check In</Text>
              </View>
              <Text style={[styles.timeValue, { color: theme.text }]}>{isCheckedIn ? checkInTime : '--:--'}</Text>
            </View>
            <View style={[styles.timeBlock, { backgroundColor: '#ffebee' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Clock size={12} color="#D14343" style={{ marginRight: 5 }} />
                <Text style={[styles.timeLabel, { color: '#D14343' }]}>check out</Text>
              </View>
              <Text style={[styles.timeValue, { color: '#D14343' }]}>{!isCheckedIn && checkOutTime !== "--:-- AM" ? checkOutTime : '--:--'}</Text>
            </View>
          </View>

          <Text style={styles.locationText}>📍 Queens, NY 11367</Text>

          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: isCheckedIn ? '#D14343' : '#14B8A6' }]}
            onPress={handleToggleAttendance}
          >
            <Text style={styles.actionBtnText}>{isCheckedIn ? 'check out' : 'check in'}</Text>
          </TouchableOpacity>
        </View>

        {/* This Week Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>This week Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryBox, { backgroundColor: '#f3e5f5' }]}>
              <Text style={styles.summaryLabel}>Total Hours</Text>
              <Text style={[styles.summaryValue, { color: '#8e24aa' }]}>37</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#fff3e0' }]}>
              <Text style={styles.summaryLabel}>Days present</Text>
              <Text style={[styles.summaryValue, { color: '#e65100' }]}>5</Text>
            </View>
          </View>
        </View>

        {/* Recent History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent History</Text>
          <View style={[styles.historyCard, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <View style={styles.historyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={14} color="#666" style={{ marginRight: 5 }} />
                <Text style={[styles.historyDate, { color: theme.text }]}>27-02-2025</Text>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: '#0066FF' }]}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
            <View style={styles.historyTimes}>
              <View>
                <Text style={styles.historyLabel}>IN</Text>
                <Text style={[styles.historyTime, { color: theme.text }]}>08:30 AM</Text>
              </View>
              <View style={styles.historySeparator} />
              <View>
                <Text style={styles.historyLabel}>OUT</Text>
                <Text style={[styles.historyTime, { color: theme.text }]}>05:30 PM</Text>
              </View>
            </View>
          </View>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBadge: {
    backgroundColor: '#0066FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeBlock: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  actionBtn: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyCard: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  historySeparator: {
    width: 20,
    height: 1,
    backgroundColor: '#eee',
  }
});

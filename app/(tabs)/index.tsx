import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { api } from '@/api/axios';
import { Clock, CheckCircle, AlertCircle, Calendar, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  const [urgentJobs, setUrgentJobs] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch user's work orders
      const { data } = await api.get('/work-orders/my');
      const workOrders = data.data || [];
      
      let pending = 0, inProgress = 0, completed = 0;
      const urgent: any = [];
      const today: any = [];
      
      const now = new Date();

      workOrders.forEach((wo: any) => {
        if (wo.status === 'Pending') pending++;
        if (wo.status === 'In Progress') inProgress++;
        if (wo.status === 'Completed') completed++;
        if (wo.priority === 'High' && wo.status !== 'Completed') urgent.push(wo);
        
        // Mock schedule check
        today.push(wo);
      });

      setStats({ pending, inProgress, completed, total: workOrders.length });
      setUrgentJobs(urgent.slice(0, 3));
      setTodaySchedule(today.slice(0, 5));
    } catch (error) {
      console.log('Error fetching data', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.nameText}>{user?.name || 'User'}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{(user?.role || 'Technician').toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginLeft: 15 }}>
              <Bell color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Clock size={20} color="#fff" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.statusTitle}>Today's Status</Text>
              <Text style={styles.statusValue}>Checked In: 8:30 AM</Text>
            </View>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <View style={styles.statIconContainer}>
               <Clock size={24} color="#FFB020" />
            </View>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <View style={styles.statIconContainer}>
               <Calendar size={24} color="#0066FF" />
            </View>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <View style={styles.statIconContainer}>
               <CheckCircle size={24} color="#14B8A6" />
            </View>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
            <View style={styles.statIconContainer}>
               <AlertCircle size={24} color="#D14343" />
            </View>
            <Text style={[styles.statNumber, { color: theme.text }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total Order</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: '#D14343' }]}>
            <AlertCircle size={16} color="#D14343" style={{ marginRight: 5 }} /> Urgent Jobs ({urgentJobs.length})
          </Text>
        </View>
        
        {urgentJobs.length > 0 ? urgentJobs.map((job: any) => (
          <TouchableOpacity 
            key={job._id} 
            style={[styles.jobCard, { borderColor: '#ffebee' }]}
            onPress={() => router.push(`/job/${job._id}`)}
          >
            <View style={styles.jobCardHeader}>
              <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title || 'Urgent Repair'}</Text>
              <View style={[styles.jobBadge, { backgroundColor: '#ffebee' }]}>
                <Text style={[styles.jobBadgeText, { color: '#D14343' }]}>Active</Text>
              </View>
            </View>
            <Text style={styles.jobAddress}>{job.location || 'Client Location'}</Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobDate}><Calendar size={12} color="#666" /> {new Date(job.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.jobEst}>Est {job.estimatedHours || 1} Hour</Text>
            </View>
          </TouchableOpacity>
        )) : (
          <Text style={[styles.noJobsText, { color: theme.text }]}>No urgent jobs today.</Text>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Today's Schedule</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {todaySchedule.length > 0 ? todaySchedule.map((job: any) => (
          <TouchableOpacity 
            key={job._id} 
            style={[styles.jobCard, { borderColor: colorScheme === 'dark' ? '#333' : '#eee' }]}
            onPress={() => router.push(`/job/${job._id}`)}
          >
            <View style={styles.jobCardHeader}>
              <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title || 'Scheduled Maintenance'}</Text>
              <View style={[styles.jobBadge, { backgroundColor: '#e3f2fd' }]}>
                <Text style={[styles.jobBadgeText, { color: '#0066FF' }]}>{job.status || 'Pending'}</Text>
              </View>
            </View>
            <Text style={styles.jobAddress}>{job.location || 'Client Location'}</Text>
            <View style={styles.jobFooter}>
              <Text style={styles.jobDate}><Calendar size={12} color="#666" /> {new Date(job.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.jobEst}>Est {job.estimatedHours || 1} Hour</Text>
            </View>
          </TouchableOpacity>
        )) : (
          <Text style={[styles.noJobsText, { color: theme.text }]}>No scheduled jobs today.</Text>
        )}

        {/* Add bottom padding for tabs */}
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  nameText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  statusValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeBadge: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -40,
  },
  statBox: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 12,
    color: '#0066FF',
    fontWeight: '600',
  },
  jobCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  jobBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  jobBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  jobAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobDate: {
    fontSize: 12,
    color: '#666',
  },
  jobEst: {
    fontSize: 12,
    color: '#666',
  },
  noJobsText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  }
});

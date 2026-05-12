import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { api } from '@/api/axios';
import { Search, Calendar, MapPin, User as UserIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function JobsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/work-orders/my');
      setJobs(data.data || []);
    } catch (error) {
      console.log('Error fetching jobs', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job: any) => 
    job.title?.toLowerCase().includes(search.toLowerCase()) || 
    job.location?.toLowerCase().includes(search.toLowerCase())
  );

  const renderJobCard = ({ item }: { item: any }) => {
    const getStatusColor = (status: string) => {
      switch(status) {
        case 'Pending': return '#FFB020';
        case 'In Progress': return '#0066FF';
        case 'Completed': return '#14B8A6';
        default: return '#666';
      }
    };

    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={[styles.jobCard, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff', borderColor: colorScheme === 'dark' ? '#333' : '#eee' }]}
        onPress={() => router.push(`/job/${item._id}`)}
      >
        <View style={styles.jobHeader}>
          <Text style={[styles.jobTitle, { color: theme.text }]} numberOfLines={1}>{item.title || 'Work Order'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{item.status || 'Pending'}</Text>
          </View>
        </View>
        
        <View style={styles.jobDetails}>
          <Text style={styles.detailText} numberOfLines={2}>{item.description || 'No description provided.'}</Text>
          <View style={styles.detailRow}>
            <MapPin size={12} color="#666" />
            <Text style={styles.detailValue}>{item.location || 'Client Location'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={12} color="#666" />
            <Text style={styles.detailValue}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.jobFooter}>
          <Text style={styles.jobId}>WO: {item.workOrderNumber || item._id.substring(0,8)}</Text>
          <Text style={styles.jobEst}>Est: {item.estimatedHours || 1} Hour</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff' }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Work Orders</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text, backgroundColor: colorScheme === 'dark' ? '#333' : '#F5F5F5' }]}
            placeholder="search work orders"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item._id}
        renderItem={renderJobCard}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.text }]}>No work orders found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 25,
    paddingLeft: 45,
    paddingRight: 15,
    fontSize: 14,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  jobCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  jobDetails: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  jobId: {
    fontSize: 10,
    color: '#999',
  },
  jobEst: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});

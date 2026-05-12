import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { api } from '@/api/axios';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/work-orders/${id}`);
        setJob(data.data);
      } catch (error) {
        console.log('Error fetching job details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Job not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#0066FF' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{job.title || 'Work Order Detail'}</Text>
        <Text style={styles.headerSub}>WO:{job.workOrderNumber || job._id.substring(0,8)}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
          <Text style={[styles.detailLabel, { color: theme.text }]}>Category: {job.category || 'Maintenance'}</Text>
          <Text style={styles.detailText}>Date: {new Date(job.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.detailText}>Time: {new Date(job.createdAt).toLocaleTimeString()}</Text>

          <Text style={[styles.detailTitle, { color: theme.text, marginTop: 20 }]}>Description:</Text>
          <Text style={styles.descriptionText}>
            {job.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies risus non ullamcorper congue. Sed a elementum quam.'}
          </Text>

          <Text style={[styles.detailTitle, { color: theme.text, marginTop: 20 }]}>Assignee Name:</Text>
          <Text style={styles.detailText}>
            {job.assignedTo && job.assignedTo.length > 0 ? job.assignedTo.map((a:any) => a.name).join(', ') : 'Lorem Ipsum'}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#111' }]}
              onPress={() => router.push(`/job/reject/${id}`)}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: '#0066FF' }]}
              onPress={() => {
                // Mock Accept or Check in action
                alert('Job Accepted/Checked In');
              }}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#0066FF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20 },
  card: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  detailLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  detailText: { fontSize: 14, color: '#666', marginBottom: 5 },
  detailTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  btn: { flex: 1, paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { api } from '@/api/axios';

export default function JobRejectScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason) {
      alert('Please enter a reason for rejection.');
      return;
    }
    setLoading(true);
    try {
      // Mock API call to reject job
      await api.patch(`/work-orders/${id}/status`, { status: 'Cancelled', reason });
      alert('Job Rejected');
      router.back();
      router.back(); // Go back to list
    } catch (error) {
      console.log('Error rejecting job', error);
      alert('Failed to reject job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Work Order Reject</Text>
        <Text style={styles.headerSub}>Reject work order</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#222' : '#fff' }]}>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: colorScheme === 'dark' ? '#333' : '#F5F5F5' }]}
            placeholder="Reason For Rejection"
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={reason}
            onChangeText={setReason}
            textAlignVertical="top"
          />
          <TouchableOpacity 
            style={[styles.rejectBtn, { opacity: loading ? 0.7 : 1 }]}
            onPress={handleReject}
            disabled={loading}
          >
            <Text style={styles.rejectBtnText}>{loading ? 'Rejecting...' : 'Reject'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#0066FF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
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
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    height: 150,
    marginBottom: 20,
  },
  rejectBtn: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

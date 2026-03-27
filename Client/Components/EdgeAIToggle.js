import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useEdgeAI } from '../hooks/useEdgeAI';
import { Ionicons } from '@expo/vector-icons';

const EdgeAIToggle = () => {
  const { modelStatus, enableEdgeAI, downloadProgress } = useEdgeAI();

  if (modelStatus === 'idle') {
    return (
      <TouchableOpacity style={styles.button} onPress={enableEdgeAI}>
         <Ionicons name="hardware-chip-outline" size={20} color="#fff" />
         <Text style={styles.buttonText}>Enable Edge AI</Text>
      </TouchableOpacity>
    );
  }

  if (modelStatus === 'downloading') {
    const pct = downloadProgress ? Math.round(downloadProgress * 100) : 0;
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="small" color="#D97385" />
        <Text style={styles.statusText}>Downloading AI model... {pct ? `${pct}%` : ''}</Text>
      </View>
    );
  }

  if (modelStatus === 'ready') {
    return (
      <View style={[styles.statusContainer, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
        <Text style={[styles.statusText, { color: '#4CAF50' }]}>Edge AI Ready ✓</Text>
      </View>
    );
  }

  if (modelStatus === 'failed') {
    return (
      <View style={styles.failedContainer}>
         <Text style={styles.failedText}>Download failed</Text>
         <TouchableOpacity style={styles.retryButton} onPress={enableEdgeAI}>
           <Text style={styles.retryText}>Retry</Text>
         </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97385',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(217, 115, 133, 0.1)',
    gap: 8,
  },
  statusText: {
    color: '#D97385',
    fontWeight: '600',
    fontSize: 14,
  },
  failedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  failedText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  }
});

export default EdgeAIToggle;

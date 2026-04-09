import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Card, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const historyData = [
  { id: '1', date: 'Apr 02, 2026', time: '14:30 PM', type: 'SOS Triggered', status: 'Resolved' },
  { id: '2', date: 'Mar 28, 2026', time: '21:15 PM', type: 'Timer Warning', status: 'Cancelled' },
  { id: '3', date: 'Mar 15, 2026', time: '10:05 AM', type: 'SOS Triggered', status: 'Resolved' },
];

const HistoryItem = ({ item }) => {
  const theme = useTheme();
  const isSOS = item.type === 'SOS Triggered';
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={[styles.timeColumn, { borderRightColor: theme.colors.outline + '20' }]}>
          <Text variant="titleMedium" style={styles.date}>{item.date.split(',')[0]}</Text>
          <Text variant="bodySmall" style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.detailsColumn}>
          <View style={styles.typeRow}>
            <MaterialCommunityIcons name={isSOS ? 'alert-circle' : 'timer-sand'} size={20} color={isSOS ? theme.colors.primary : theme.colors.secondary} />
            <Text variant="titleMedium" style={styles.typeText}>{item.type}</Text>
          </View>
          <Text variant="bodyMedium" style={[styles.status, { color: item.status === 'Resolved' ? theme.colors.tertiary : theme.colors.outline }]}>{item.status}</Text>
        </View>
        <IconButton icon="chevron-right" size={20} />
      </Card.Content>
    </Card>
  );
};

export default function HistoryScreen({ navigation }) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={styles.title}>Alert History</Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HistoryItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={80} color={theme.colors.outline} />
            <Text variant="bodyLarge">No alert history yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listContent: {
    padding: 20,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#E5393520',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  timeColumn: {
    width: 80,
    borderRightWidth: 1,
    paddingRight: 10,
  },
  date: {
    fontWeight: 'bold',
  },
  time: {
    color: '#757575',
  },
  detailsColumn: {
    flex: 1,
    paddingLeft: 15,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  status: {
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
});

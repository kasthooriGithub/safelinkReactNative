import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, FAB, Card, IconButton, Searchbar, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialContacts = [
  { id: '1', name: 'John Doe', relationship: 'Father', phone: '+1 234 567 890', priority: 'High' },
  { id: '2', name: 'Jane Smith', relationship: 'Wife', phone: '+1 987 654 321', priority: 'High' },
  { id: '3', name: 'Mike Johnson', relationship: 'Brother', phone: '+1 555 444 333', priority: 'Normal' },
];

const ContactCard = ({ item, onDelete, onEdit }) => {
  const theme = useTheme();
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Avatar.Text size={48} label={getInitials(item.name)} style={{ backgroundColor: theme.colors.primary + '20' }} labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }} />
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={styles.name}>{item.name}</Text>
          <Text variant="bodySmall" style={styles.relationship}>{item.relationship} • {item.priority} Priority</Text>
          <Text variant="bodyMedium" style={styles.phone}>{item.phone}</Text>
        </View>
        <IconButton icon="dots-vertical" size={24} onPress={() => {}} />
      </Card.Content>
    </Card>
  );
};

export default function ContactsScreen({ navigation }) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(initialContacts);

  const onChangeSearch = query => setSearchQuery(query);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.relationship.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Trusted Contacts</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>People who will be notified in emergency</Text>
      </View>

      <Searchbar
        placeholder="Search contacts..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surfaceVariant || '#F5F5F5' }]}
        elevation={0}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ContactCard item={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="account-search-outline" size={80} color={theme.colors.outline} />
            <Text variant="bodyLarge" style={{ color: theme.colors.outline, marginTop: 20 }}>No contacts found.</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color="#FFF"
        onPress={() => navigation.navigate('AddContact')}
        label="Add Contact"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#757575',
    marginTop: 4,
  },
  searchBar: {
    margin: 20,
    borderRadius: 12,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontWeight: 'bold',
  },
  relationship: {
    color: '#757575',
    marginBottom: 4,
  },
  phone: {
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
});

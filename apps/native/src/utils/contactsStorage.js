import AsyncStorage from '@react-native-async-storage/async-storage';

// Contact object structure
// {
//   id: number,
//   name: string,
//   number: string,
//   email?: string,
//   occupation?: string,
//   notes?: string,
//   avatar?: string | null
// }

const CONTACTS_STORAGE_KEY = '@contacts';

export const contactsStorage = {
  // Get all contacts
  async getContacts() {
    try {
      const contactsJson = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
      const contacts = contactsJson ? JSON.parse(contactsJson) : [];
      
      // Sort contacts alphabetically by name
      const sortedContacts = contacts.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      // If the order changed, update storage to maintain consistency
      if (JSON.stringify(contacts) !== JSON.stringify(sortedContacts)) {
        await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(sortedContacts));
      }
      
      return sortedContacts;
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  },

  // Save a new contact
  async saveContact(contact) {
    try {
      const contacts = await this.getContacts();
      const newContact = {
        ...contact,
        id: Date.now(),
      };
      
      // Add new contact and sort alphabetically by name
      const updatedContacts = [...contacts, newContact].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
      
      return newContact;
    } catch (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
  },

  // Update an existing contact
  async updateContact(contact) {
    try {
      const contacts = await this.getContacts();
      const updatedContacts = contacts.map(c => 
        c.id === contact.id ? contact : c
      );
      
      // Sort alphabetically by name after updating
      const sortedContacts = updatedContacts.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(sortedContacts));
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete a contact
  async deleteContact(contactId) {
    try {
      const contacts = await this.getContacts();
      const updatedContacts = contacts.filter(c => c.id !== contactId);
      
      // Sort alphabetically by name after deletion
      const sortedContacts = updatedContacts.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(sortedContacts));
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Clear all contacts
  async clearContacts() {
    try {
      await AsyncStorage.removeItem(CONTACTS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing contacts:', error);
      throw error;
    }
  },

  // Sort all existing contacts alphabetically
  async sortContacts() {
    try {
      const contacts = await this.getContacts();
      const sortedContacts = contacts.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      
      await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(sortedContacts));
      return sortedContacts;
    } catch (error) {
      console.error('Error sorting contacts:', error);
      throw error;
    }
  },

  // Search contacts
  async searchContacts(query) {
    try {
      const contacts = await this.getContacts();
      const lowercaseQuery = query.toLowerCase();
      
      // Remove dashes from query for better search matching
      const cleanedQuery = query.replace(/-/g, '');
      
      const filteredContacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(lowercaseQuery) ||
        contact.number.includes(query) ||
        contact.number.replace(/-/g, '').includes(cleanedQuery) ||
        (contact.email && contact.email.toLowerCase().includes(lowercaseQuery)) ||
        (contact.occupation && contact.occupation.toLowerCase().includes(lowercaseQuery))
      );
      
      // Return search results in alphabetical order
      return filteredContacts.sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }
}; 
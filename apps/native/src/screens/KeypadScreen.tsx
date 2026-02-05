import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { contactsStorage } from "../utils/contactsStorage.js";
import { callHistoryStorage } from "../utils/callHistoryStorage.js";
import AIPromptModal from "../components/AIPromptModal";

const { width, height } = Dimensions.get("window");

export default function KeypadScreen({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [activeTab, setActiveTab] = useState(route?.params?.activeTab || "keypad"); // "keypad" or "contacts"
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Function to load contacts from storage
  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const storedContacts = await contactsStorage.getContacts();
      setContacts(storedContacts);
      setFilteredContacts(storedContacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
      Alert.alert("Error", "Failed to load contacts");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to search contacts
  const searchContacts = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.number.includes(query)
      );
      setFilteredContacts(filtered);
    }
  };

  // Function to delete a contact
  const deleteContact = async (contactId) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await contactsStorage.deleteContact(contactId);
              // Refresh contacts after deletion
              loadContacts();
            } catch (error) {
              console.error("Error deleting contact:", error);
              Alert.alert("Error", "Failed to delete contact");
            }
          },
        },
      ]
    );
  };

  // Function to show AI prompt modal for a contact
  const showPromptModal = (contact) => {
    setSelectedContact(contact);
    setShowAIPromptModal(true);
  };

  // Function to handle AI prompt selection
  const handlePromptSelect = async (prompt) => {
    if (selectedContact) {
      try {
        // Record the call with the selected prompt
        await callHistoryStorage.addCall({
          name: selectedContact.name,
          number: formatPhoneNumber(selectedContact.number),
          type: "outgoing",
          timestamp: Date.now(),
          aiPrompt: prompt, // Store the AI prompt used
        });
        
        // Navigate to phone home screen
        navigation.navigate("PhoneHomeScreen");
        
        // Show call alert with the selected prompt
        Alert.alert(
          "AI Call Initiated", 
          `Calling ${selectedContact.name} with prompt: "${prompt}"`,
          [
            {
              text: "OK",
              onPress: () => console.log("Call initiated with AI prompt")
            }
          ]
        );
      } catch (error) {
        console.error("Error recording call:", error);
        Alert.alert("Call", `Calling ${selectedContact.name} with prompt: "${prompt}"`);
      }
    }
  };

  // Load contacts when component mounts and when screen comes into focus
  useEffect(() => {
    loadContacts();
    
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh contacts when screen comes into focus (e.g., after creating a new contact)
      loadContacts();
    });

    return unsubscribe;
  }, [navigation]);

  const keypadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["*", "0", "#"],
  ];

  const addNumber = (num) => {
    const currentNumber = phoneNumber.replace(/\D/g, ''); // Remove existing dashes
    const newNumber = currentNumber + num;
    
    if (newNumber.length <= 10) {
      let formatted = newNumber;
      
      // Add dashes automatically as user types
      if (newNumber.length >= 3) {
        formatted = newNumber.slice(0, 3) + '-';
        if (newNumber.length >= 6) {
          formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3, 6) + '-';
          if (newNumber.length >= 7) {
            formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3, 6) + '-' + newNumber.slice(6);
          }
        } else if (newNumber.length > 3) {
          formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3);
        }
      }
      
      setPhoneNumber(formatted);
    }
  };

  const deleteNumber = () => {
    const currentNumber = phoneNumber.replace(/\D/g, ''); // Remove existing dashes
    if (currentNumber.length > 0) {
      const newNumber = currentNumber.slice(0, -1);
      let formatted = newNumber;
      
      // Reformat with dashes after deletion
      if (newNumber.length >= 3) {
        formatted = newNumber.slice(0, 3) + '-';
        if (newNumber.length >= 6) {
          formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3, 6) + '-';
          if (newNumber.length >= 7) {
            formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3, 6) + '-' + newNumber.slice(6);
          }
        } else if (newNumber.length > 3) {
          formatted = newNumber.slice(0, 3) + '-' + newNumber.slice(3);
        }
      }
      
      setPhoneNumber(formatted);
    }
  };

  const clearNumber = () => {
    setPhoneNumber("");
  };

  // Function to format phone number as xxx-xxx-xxxx
  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const makeCall = async () => {
    if (phoneNumber.trim()) {
      try {
        const formattedNumber = formatPhoneNumber(phoneNumber);
        
        // Record the call
        await callHistoryStorage.addCall({
          name: formattedNumber,
          number: formattedNumber,
          type: "outgoing",
        });
        
        // Here you would implement the actual call functionality
        console.log("Making call to:", phoneNumber);
        // For now, just show an alert
        Alert.alert("Call", `Calling ${formattedNumber}...`);
      } catch (error) {
        console.error("Error recording call:", error);
        Alert.alert("Call", `Calling ${phoneNumber}...`);
      }
    }
  };

  const renderKeypadButton = (num) => (
    <TouchableOpacity
      key={num}
      style={styles.keypadButton}
      onPress={() => addNumber(num)}
    >
      <Text style={styles.keypadButtonText}>{num}</Text>
    </TouchableOpacity>
  );

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={styles.contactMain}
        onPress={() => navigation.navigate("ContactDetailsScreen", { contact: item })}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.contactAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactNumber}>{formatPhoneNumber(item.number)}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Call Button */}
      <TouchableOpacity 
        style={styles.contactPhoneButton}
        onPress={() => showPromptModal(item)}
      >
        <Ionicons name="call" size={20} color="#34C759" />
      </TouchableOpacity>
      
      {/* Delete Button */}
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteContact(item.id)}
      >
        <AntDesign name="delete" size={18} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("PhoneHomeScreen")}>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/arrow-back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Make a Call</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "keypad" && styles.activeTab]}
          onPress={() => setActiveTab("keypad")}
        >
          <Text style={[styles.tabText, activeTab === "keypad" && styles.activeTabText]}>
            Keypad
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "contacts" && styles.activeTab]}
          onPress={() => setActiveTab("contacts")}
        >
          <Text style={[styles.tabText, activeTab === "contacts" && styles.activeTabText]}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phone Number Display */}
      <View style={styles.phoneNumberContainer}>
        <Text style={styles.phoneNumber}>
          {phoneNumber ? formatPhoneNumber(phoneNumber) : "Enter phone number"}
        </Text>
        {phoneNumber.length > 0 && (
          <TouchableOpacity onPress={clearNumber} style={styles.clearButton}>
            <AntDesign name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content based on active tab */}
      {activeTab === "keypad" ? (
        <View style={styles.keypadContainer}>
          {/* Keypad Grid */}
          <View style={styles.keypadGrid}>
            {keypadNumbers.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((num) => renderKeypadButton(num))}
              </View>
            ))}
          </View>

          {/* Call Button */}
          <TouchableOpacity
            style={[styles.callButtonLarge, phoneNumber.length === 0 && styles.callButtonDisabled]}
            onPress={makeCall}
            disabled={phoneNumber.length === 0}
          >
            <Ionicons name="call" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contactsContainer}>
          <TouchableOpacity
            style={styles.createContactButton}
            onPress={() => navigation.navigate("CreateContactScreen")}
          >
            <AntDesign name="plus" size={20} color="#fff" />
            <Text style={styles.createContactButtonText}>Create New Contact</Text>
          </TouchableOpacity>
          
          {/* Search Input */}
          <View style={styles.searchContainer}>
            <AntDesign name="search1" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#A9A9A9"
              value={searchQuery}
              onChangeText={searchContacts}
            />
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
          ) : filteredContacts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No contacts found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? `No contacts match "${searchQuery}"` : "Create your first contact to get started"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              style={styles.contactsList}
              refreshing={isLoading}
              onRefresh={loadContacts}
            />
          )}
        </View>
      )}

      {/* AI Prompt Modal */}
      <AIPromptModal
        visible={showAIPromptModal}
        onClose={() => setShowAIPromptModal(false)}
        onSelectPrompt={handlePromptSelect}
        contactName={selectedContact?.name || ""}
        occupation={selectedContact?.occupation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0D87E1",
    height: 67,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    resizeMode: "contain",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  arrowBack: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  placeholder: {
    width: 20,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0D87E1",
  },
  tabText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#666",
  },
  activeTabText: {
    color: "#0D87E1",
    fontFamily: "MMedium",
  },
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  phoneNumber: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    textAlign: "center",
    flex: 1,
  },
  clearButton: {
    padding: 8,
  },
  keypadContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  keypadGrid: {
    flex: 1,
    justifyContent: "center",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  keypadButtonText: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  callButtonLarge: {
    backgroundColor: "#0D87E1",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callButtonDisabled: {
    backgroundColor: "#CCC",
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  contactMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactAvatarText: {
    color: "#fff",
    fontSize: RFValue(18),
    fontFamily: "MMedium",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
  },
  callButton: {
    padding: 10,
  },
  createContactButton: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createContactButtonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  contactsList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#2D2D2D",
    paddingVertical: 8,
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    padding: 10,
    marginLeft: 5,
  },
  contactPhoneButton: {
    padding: 10,
    marginLeft: 10,
  },
}); 
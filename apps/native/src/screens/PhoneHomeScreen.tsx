import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { contactsStorage } from "../utils/contactsStorage.js";
import { callHistoryStorage } from "../utils/callHistoryStorage.js";
import AIPromptModal from "../components/AIPromptModal";

const { width } = Dimensions.get("window");

export default function PhoneHomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("recents"); // "favorites", "recents", "contacts", "keypad"
  const [phoneNumber, setPhoneNumber] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Load favorites and recent calls when component mounts
  useEffect(() => {
    loadFavorites();
    loadRecentCalls();
  }, []);

  // Refresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
      loadRecentCalls();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    try {
      const contacts = await contactsStorage.getContacts();
      // For now, show first 4 contacts as favorites
      // In a real app, you'd have a separate favorites system
      setFavorites(contacts.slice(0, 4));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const loadRecentCalls = async () => {
    try {
      const calls = await callHistoryStorage.getRecentCalls();
      
      // Clean up any existing "Unknown" entries and format phone numbers
      const cleanedCalls = calls.map(call => {
        let updatedCall = { ...call };
        
        // Replace "Unknown" with the actual number
        if (call.name === "Unknown") {
          updatedCall.name = call.number;
        }
        
        // Format phone numbers to xxx-xxx-xxxx format
        if (call.number && !call.number.includes('-')) {
          updatedCall.number = formatPhoneNumber(call.number);
        }
        
        return updatedCall;
      });
      
      // Update the call history if any changes were made
      if (JSON.stringify(calls) !== JSON.stringify(cleanedCalls)) {
        await callHistoryStorage.clearCallHistory();
        for (const call of cleanedCalls) {
          await callHistoryStorage.addCall(call);
        }
      }
      
      setRecentCalls(cleanedCalls);
    } catch (error) {
      console.error("Error loading recent calls:", error);
      setRecentCalls([]);
    }
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigation.navigate("KeypadScreen")}
    >
      <View style={styles.favoriteAvatar}>
        <Text style={styles.favoriteAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.favoriteName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentCall = ({ item }) => (
    <TouchableOpacity
      style={styles.recentCallItem}
      onPress={() => navigation.navigate("KeypadScreen")}
    >
      <View style={[
        styles.recentCallAvatar,
        item.name !== item.number && { backgroundColor: "#1e3a8a" }
      ]}>
        {item.name !== item.number ? (
          // Show first letter of contact name
          <Text style={styles.recentCallAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        ) : (
          // Show person icon for direct dialed numbers
          <Ionicons name="person" size={24} color="#8E8E93" />
        )}
      </View>
      <View style={styles.recentCallInfo}>
        <Text style={styles.recentCallName}>
          {item.name === "Unknown" ? formatPhoneNumber(item.number) : (item.name === item.number ? formatPhoneNumber(item.number) : item.name)}
        </Text>
        <Text style={styles.recentCallTime}>{callHistoryStorage.formatTimestamp(item.timestamp)}</Text>
        {item.duration && (
          <Text style={styles.recentCallDuration}>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</Text>
        )}
      </View>
      <View style={styles.recentCallType}>
        {item.type === "outgoing" && (
          <Ionicons name="call-outline" size={20} color="#34C759" />
        )}
        {item.type === "incoming" && (
          <Ionicons name="call" size={20} color="#1e3a8a" />
        )}
        {item.type === "missed" && (
          <Ionicons name="call" size={20} color="#FF3B30" />
        )}
      </View>
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
          {item.occupation && (
            <Text style={styles.contactOccupation}>{item.occupation}</Text>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Call Button */}
      <TouchableOpacity 
        style={styles.contactPhoneButton}
        onPress={() => showPromptModal(item)}
      >
        <Ionicons name="call" size={20} color="#34C759" />
      </TouchableOpacity>
    </View>
  );

  // Function to format phone number as xxx-xxx-xxxx
  const formatPhoneNumber = (number) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format as xxx-xxx-xxxx for 10-digit numbers
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    // For other lengths, return as is
    return number;
  };

  // Function to add a digit with automatic dash insertion
  const addDigit = (digit) => {
    const currentNumber = phoneNumber.replace(/\D/g, ''); // Remove existing dashes
    const newNumber = currentNumber + digit;
    
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

  // Function to delete the last digit with proper dash handling
  const deleteDigit = () => {
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

  // Function to record a call
  const recordCall = async (name, number, type = "outgoing") => {
    try {
      // Ensure phone number is formatted before saving
      const formattedNumber = formatPhoneNumber(number);
      
      await callHistoryStorage.addCall({
        name,
        number: formattedNumber,
        type,
      });
      // Refresh recent calls after recording
      loadRecentCalls();
    } catch (error) {
      console.error("Error recording call:", error);
    }
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
        
        // Refresh recent calls
        loadRecentCalls();
        
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


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Phone</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={async () => {
            try {
              await callHistoryStorage.clearCallHistory();
              loadRecentCalls();
              Alert.alert("Success", "Call history cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear call history");
            }
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Content based on active tab */}
        {activeTab === "favorites" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            {favorites.length > 0 ? (
              <View style={styles.favoritesGrid}>
                {favorites.map((favorite, index) => (
                  <View key={favorite.id} style={styles.favoriteItem}>
                    <TouchableOpacity
                      style={styles.favoriteAvatar}
                      onPress={() => navigation.navigate("KeypadScreen")}
                    >
                      <Text style={styles.favoriteAvatarText}>
                        {favorite.name.charAt(0).toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.favoriteName}>{favorite.name}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No favorites yet</Text>
            )}
          </View>
        )}

        {activeTab === "recents" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            {recentCalls.length > 0 ? (
              <FlatList
                data={recentCalls}
                renderItem={renderRecentCall}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No recent calls</Text>
            )}
          </View>
        )}

        {activeTab === "contacts" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            <TouchableOpacity
              style={styles.addContactButton}
              onPress={() => navigation.navigate("CreateContactScreen")}
            >
              <Ionicons name="add-circle" size={24} color="#1e3a8a" />
              <Text style={styles.addContactButtonText}>Add Contact</Text>
            </TouchableOpacity>
            {favorites.length > 0 ? (
              <FlatList
                data={favorites}
                renderItem={renderContact}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No contacts yet</Text>
            )}
          </View>
        )}

        {activeTab === "keypad" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Keypad</Text>
            
                      {/* Phone Number Display */}
          <View style={styles.phoneNumberContainer}>
            <Text style={styles.phoneNumber}>
              {phoneNumber ? formatPhoneNumber(phoneNumber) : "Enter phone number"}
            </Text>
            {phoneNumber.length > 0 && (
              <TouchableOpacity onPress={deleteDigit} style={styles.clearButton}>
                <Ionicons name="backspace" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>

            {/* Full Keypad */}
            <View style={styles.fullKeypad}>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("1")}>
                  <Text style={styles.keypadButtonText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("2")}>
                  <Text style={styles.keypadButtonText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("3")}>
                  <Text style={styles.keypadButtonText}>3</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("4")}>
                  <Text style={styles.keypadButtonText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("5")}>
                  <Text style={styles.keypadButtonText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("6")}>
                  <Text style={styles.keypadButtonText}>6</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("7")}>
                  <Text style={styles.keypadButtonText}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("8")}>
                  <Text style={styles.keypadButtonText}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("9")}>
                  <Text style={styles.keypadButtonText}>9</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.keypadRow}>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("*")}>
                  <Text style={styles.keypadButtonText}>*</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("0")}>
                  <Text style={styles.keypadButtonText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.keypadButton} onPress={() => addDigit("#")}>
                  <Text style={styles.keypadButtonText}>#</Text>
                </TouchableOpacity>
              </View>
              
              {/* Call Button */}
              <TouchableOpacity 
                style={[styles.callButton, phoneNumber.length === 0 && styles.callButtonDisabled]}
                onPress={() => {
                  if (phoneNumber.length > 0) {
                    // Format the number as xxx-xxx-xxxx
                    const formattedNumber = formatPhoneNumber(phoneNumber);
                    // Record the call with the formatted number as name
                    recordCall(formattedNumber, formattedNumber, "outgoing");
                    Alert.alert("Call", `Calling ${formattedNumber}...`);
                  }
                }}
                disabled={phoneNumber.length === 0}
              >
                <Ionicons name="call" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => setActiveTab("favorites")}
        >
          <Ionicons 
            name="star" 
            size={24} 
            color={activeTab === "favorites" ? "#1e3a8a" : "#8E8E93"} 
          />
          <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "recents" && styles.activeTab]}
          onPress={() => setActiveTab("recents")}
        >
          <Ionicons 
            name="time" 
            size={24} 
            color={activeTab === "recents" ? "#1e3a8a" : "#8E8E93"} 
          />
          <Text style={[styles.tabText, activeTab === "recents" && styles.activeTabText]}>
            Recents
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "contacts" && styles.activeTab]}
          onPress={() => setActiveTab("contacts")}
        >
          <Ionicons 
            name="people" 
            size={24} 
            color={activeTab === "contacts" ? "#1e3a8a" : "#8E8E93"} 
          />
          <Text style={[styles.tabText, activeTab === "contacts" && styles.activeTabText]}>
            Contacts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "keypad" && styles.activeTab]}
          onPress={() => setActiveTab("keypad")}
        >
          <Ionicons 
            name="keypad" 
            size={24} 
            color={activeTab === "keypad" ? "#1e3a8a" : "#8E8E93"} 
          />
          <Text style={[styles.tabText, activeTab === "keypad" && styles.activeTabText]}>
            Keypad
          </Text>
        </TouchableOpacity>
      </View>

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
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#1e3a8a",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: "contain",
  },
  headerTitle: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#fff",
    fontWeight: "600",
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: RFValue(22),
    fontFamily: "MMedium",
    color: "#000",
    fontWeight: "600",
    marginBottom: 20,
  },
  favoritesGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  favoriteItem: {
    alignItems: "center",
    marginBottom: 15,
    width: width / 4 - 20,
  },
  favoriteAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  favoriteAvatarText: {
    color: "#fff",
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    fontWeight: "600",
  },
  favoriteName: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#000",
    textAlign: "center",
  },

  recentCallItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  recentCallAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  recentCallAvatarText: {
    color: "#1e3a8a",
    fontSize: RFValue(20),
    fontFamily: "MMedium",
    fontWeight: "600",
  },
  recentCallInfo: {
    flex: 1,
  },
  recentCallName: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#000",
    marginBottom: 4,
  },
  recentCallNumber: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
    marginBottom: 4,
  },
  recentCallTime: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#8E8E93",
  },
  recentCallDuration: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#8E8E93",
    marginTop: 2,
  },
  recentCallType: {
    padding: 10,
  },
  emptyText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#8E8E93",
    textAlign: "center",
    fontStyle: "italic",
  },
  // Contact styles
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  contactMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  contactPhoneButton: {
    padding: 8,
    marginLeft: 16,
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
    fontSize: RFValue(20),
    fontFamily: "MMedium",
    fontWeight: "600",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#000",
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
  },
  contactOccupation: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#8E8E93",
    marginTop: 2,
  },
  // Add contact button styles
  addContactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 20,
  },
  addContactButtonText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#1e3a8a",
    marginLeft: 8,
  },
  // Phone number display styles
  phoneNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 20,
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
  // Full keypad styles
  fullKeypad: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  keypadRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  keypadButtonText: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#2D2D2D",
  },
  callButton: {
    backgroundColor: "#1e3a8a",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
  // Bottom tabs styles
  bottomTabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activeTab: {
    // Active tab styling
  },
  tabText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#8E8E93",
    marginTop: 4,
  },
  activeTabText: {
    color: "#1e3a8a",
    fontFamily: "MMedium",
  },
}); 
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { callHistoryStorage } from '../utils/callHistoryStorage';
import AIPromptModal from '../components/AIPromptModal';

const ContactDetailsScreen = ({ route, navigation }) => {
  const { contact } = route.params;
  const [showAIPromptModal, setShowAIPromptModal] = useState(false);

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return number;
  };

  const showPromptModal = () => {
    setShowAIPromptModal(true);
  };

  const handlePromptSelect = async (prompt) => {
    try {
      // Record the call with the selected prompt
      await callHistoryStorage.addCall({
        name: contact.name,
        number: formatPhoneNumber(contact.number),
        type: "outgoing",
        timestamp: Date.now(),
        aiPrompt: prompt, // Store the AI prompt used
      });
      
      // Navigate back to phone home screen
      navigation.navigate("PhoneHomeScreen");
      
      // Show call alert with the selected prompt
      Alert.alert(
        "AI Call Initiated", 
        `Calling ${contact.name} with prompt: "${prompt}"`,
        [
          {
            text: "OK",
            onPress: () => console.log("Call initiated with AI prompt")
          }
        ]
      );
    } catch (error) {
      console.error("Error recording call:", error);
      Alert.alert("Call", `Calling ${contact.name} with prompt: "${prompt}"`);
    }
  };

  const makeCall = async () => {
    try {
      // Record the call
      await callHistoryStorage.addCall({
        name: contact.name,
        number: formatPhoneNumber(contact.number),
        type: "outgoing",
        timestamp: Date.now(),
      });
      
      // Navigate back to phone home screen
      navigation.navigate("PhoneHomeScreen");
      
      // Show call alert
      Alert.alert("Call", `Calling ${contact.name}...`);
    } catch (error) {
      console.error("Error recording call:", error);
      Alert.alert("Call", `Calling ${contact.name}...`);
    }
  };

  const sendMessage = () => {
    Alert.alert("Message", `Opening message to ${contact.name}...`);
  };

  const editContact = () => {
    // Navigate to edit contact screen (you can implement this later)
    Alert.alert("Edit Contact", `Edit ${contact.name}...`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Info</Text>
        <TouchableOpacity style={styles.editButton} onPress={editContact}>
          <Feather name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Avatar and Name */}
        <View style={styles.contactHeader}>
          <View style={styles.contactAvatar}>
            <Text style={styles.contactAvatarText}>
              {contact.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.contactName}>{contact.name}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={showPromptModal}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="call" size={24} color="#34C759" />
            </View>
            <Text style={styles.actionButtonText}>Call with AI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={sendMessage}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="chatbubble" size={24} color="#007AFF" />
            </View>
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          
          {/* Phone Number */}
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons name="call" size={20} color="#1e3a8a" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{formatPhoneNumber(contact.number)}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={showPromptModal}>
              <Ionicons name="call" size={20} color="#34C759" />
            </TouchableOpacity>
          </View>

          {/* Email */}
          {contact.email && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="mail" size={20} color="#1e3a8a" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{contact.email}</Text>
              </View>
            </View>
          )}

          {/* Occupation */}
          {contact.occupation && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="briefcase" size={20} color="#1e3a8a" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Occupation</Text>
                <Text style={styles.detailValue}>{contact.occupation}</Text>
              </View>
            </View>
          )}

          {/* Notes */}
          {contact.notes && (
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="document-text" size={20} color="#1e3a8a" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{contact.notes}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* AI Prompt Modal */}
      <AIPromptModal
        visible={showAIPromptModal}
        onClose={() => setShowAIPromptModal(false)}
        onSelectPrompt={handlePromptSelect}
        contactName={contact.name}
        occupation={contact.occupation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#1e3a8a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(18),
    fontFamily: "MMedium",
  },
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contactHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  contactAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  contactAvatarText: {
    color: "#fff",
    fontSize: RFValue(32),
    fontFamily: "MMedium",
    fontWeight: "600",
  },
  contactName: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#000",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
  },
  detailsSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontFamily: "MMedium",
    color: "#000",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  detailIcon: {
    width: 40,
    alignItems: "center",
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#8E8E93",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#000",
  },
  callButton: {
    padding: 8,
  },
});

export default ContactDetailsScreen; 
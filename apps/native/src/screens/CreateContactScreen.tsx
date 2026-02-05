import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign } from "@expo/vector-icons";
import { contactsStorage } from "../utils/contactsStorage.js";

export default function CreateContactScreen({ navigation }) {
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [notes, setNotes] = useState("");

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

  // Function to handle phone number input with automatic dash insertion
  const handlePhoneNumberChange = (text) => {
    // Remove all non-digit characters for processing
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (cleaned.length <= 10) {
      let formatted = cleaned;
      
      // Add dashes automatically as user types
      if (cleaned.length >= 3) {
        formatted = cleaned.slice(0, 3) + '-';
        if (cleaned.length >= 6) {
          formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-';
          if (cleaned.length >= 7) {
            formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
          }
        } else if (cleaned.length > 3) {
          formatted = cleaned.slice(0, 3) + '-' + cleaned.slice(3);
        }
      }
      
      setPhoneNumber(formatted);
    }
  };

  const saveContact = async () => {
    // Validation
    if (!contactName.trim()) {
      Alert.alert("Error", "Please enter a contact name");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    try {
      // Ensure phone number is formatted before saving
      const formattedPhoneNumber = phoneNumber.includes('-') ? phoneNumber : formatPhoneNumber(phoneNumber);
      
      // Save the contact using the storage utility
      await contactsStorage.saveContact({
        name: contactName.trim(),
        number: formattedPhoneNumber,
        email: email.trim() || undefined,
        occupation: occupation.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        "Success",
        "Contact saved successfully!",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error saving contact:", error);
      Alert.alert("Error", "Failed to save contact. Please try again.");
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
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("PhoneHomeScreen")}>
          <Image
            style={styles.arrowBack}
            source={require("../assets/icons/arrow-back.png")}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Contact</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Contact Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Name *</Text>
            <TextInput
              value={contactName}
              onChangeText={setContactName}
              style={styles.inputField}
              placeholder="Enter full name"
              placeholderTextColor="#A9A9A9"
            />
          </View>

          {/* Occupation */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Occupation (Optional)</Text>
            <TextInput
              value={occupation}
              onChangeText={setOccupation}
              style={styles.inputField}
              placeholder="Enter occupation"
              placeholderTextColor="#A9A9A9"
              autoCapitalize="words"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              style={styles.inputField}
              placeholder="Enter phone number (e.g., 832-234-5354)"
              placeholderTextColor="#A9A9A9"
              keyboardType="phone-pad"
              maxLength={12}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email (Optional)</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.inputField}
              placeholder="Enter email address"
              placeholderTextColor="#A9A9A9"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              style={[styles.inputField, styles.notesInput]}
              placeholder="Add any additional notes"
              placeholderTextColor="#A9A9A9"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (!contactName.trim() || !phoneNumber.trim()) && styles.saveButtonDisabled]}
          onPress={saveContact}
          disabled={!contactName.trim() || !phoneNumber.trim()}
        >
          <AntDesign name="save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1e3a8a",
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
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: "#FFF",
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#2D2D2D",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  notesInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#0D87E1",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCC",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
}); 
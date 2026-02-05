import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface ICloudSyncPromptProps {
  visible: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ICloudSyncPrompt({ visible, onAccept, onDecline }: ICloudSyncPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      // Here you would implement the actual iCloud contact sync
      // This could involve requesting permissions and syncing contacts
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate async operation
      onAccept();
    } catch (error) {
      console.error("Failed to sync contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="cloud-upload" size={40} color="#0D87E1" />
            </View>
            <Text style={styles.title}>Sync Your Contacts</Text>
            <Text style={styles.subtitle}>
              Connect your phone contacts to make calling easier
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <AntDesign name="checkcircle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Access all your phone contacts</Text>
            </View>
            <View style={styles.benefitItem}>
              <AntDesign name="checkcircle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Quick dial from your contact list</Text>
            </View>
            <View style={styles.benefitItem}>
              <AntDesign name="checkcircle" size={20} color="#4CAF50" />
              <Text style={styles.benefitText}>Keep contacts in sync across devices</Text>
            </View>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyContainer}>
            <Ionicons name="shield-checkmark" size={16} color="#666" />
            <Text style={styles.privacyText}>
              Your contacts are stored securely and never shared with third parties
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton, isLoading && styles.buttonDisabled]}
              onPress={handleAccept}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.buttonText}>Syncing...</Text>
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Sync Contacts</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.declineButton]}
              onPress={onDecline}
            >
              <Text style={[styles.buttonText, styles.declineButtonText]}>
                Maybe Later
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip Option */}
          <TouchableOpacity style={styles.skipButton} onPress={onDecline}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: RFValue(24),
    fontFamily: "MMedium",
    color: "#2D2D2D",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#2D2D2D",
    marginLeft: 12,
    flex: 1,
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#666",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  acceptButton: {
    backgroundColor: "#0D87E1",
  },
  declineButton: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: RFValue(16),
    fontFamily: "MMedium",
    color: "#fff",
    marginLeft: 8,
  },
  declineButtonText: {
    color: "#666",
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  skipText: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#999",
    textDecorationLine: "underline",
  },
}); 
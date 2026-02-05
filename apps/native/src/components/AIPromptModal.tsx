import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface AIPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  contactName: string;
  occupation?: string;
}

const AIPromptModal: React.FC<AIPromptModalProps> = ({
  visible,
  onClose,
  onSelectPrompt,
  contactName,
  occupation,
}) => {
  // Generate AI prompts based on contact occupation or general conversation starters
  const generatePrompts = () => {
    const generalPrompts = [
      "Hello, how are you today?",
      "I hope you're having a great day",
      "I wanted to check in with you",
      "Do you have a moment to talk?",
    ];

    if (occupation) {
      const occupationLower = occupation.toLowerCase();
      
      if (occupationLower.includes('dentist') || occupationLower.includes('doctor') || occupationLower.includes('physician')) {
        return [
          "I'd like to schedule an appointment",
          "I need to reschedule my appointment",
          "I have a question about my treatment plan",
          "I need to update my insurance information",
          "I'd like to discuss my recent visit",
          ...generalPrompts,
        ];
      } else if (occupationLower.includes('lawyer') || occupationLower.includes('attorney')) {
        return [
          "I need legal advice about a matter",
          "I'd like to schedule a consultation",
          "I have questions about my case",
          "I need to discuss contract terms",
          "I'd like to update you on recent developments",
          ...generalPrompts,
        ];
      } else if (occupationLower.includes('accountant') || occupationLower.includes('cpa')) {
        return [
          "I need help with my tax preparation",
          "I have questions about my financial statements",
          "I'd like to discuss business planning",
          "I need help with bookkeeping",
          "I'd like to schedule a financial review",
          ...generalPrompts,
        ];
      } else if (occupationLower.includes('real estate') || occupationLower.includes('realtor')) {
        return [
          "I'm interested in buying a property",
          "I'd like to list my property for sale",
          "I have questions about the market",
          "I need help with property management",
          "I'd like to schedule a property viewing",
          ...generalPrompts,
        ];
      } else if (occupationLower.includes('teacher') || occupationLower.includes('professor')) {
        return [
          "I have questions about the course material",
          "I'd like to discuss my progress",
          "I need help with an assignment",
          "I'd like to schedule office hours",
          "I have feedback about the class",
          ...generalPrompts,
        ];
      } else if (occupationLower.includes('consultant') || occupationLower.includes('advisor')) {
        return [
          "I need advice on a business decision",
          "I'd like to discuss strategy options",
          "I need help with project planning",
          "I'd like to schedule a consultation",
          "I have questions about implementation",
          ...generalPrompts,
        ];
      }
    }

    // Default prompts for any occupation
    return [
      "I'd like to discuss business matters",
      "I have a question for you",
      "I wanted to follow up on our last conversation",
      "I need your expertise on something",
      "I'd like to schedule a meeting",
      ...generalPrompts,
    ];
  };

  const prompts = generatePrompts();

  const handlePromptSelect = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Conversation Starters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Choose a prompt to help your AI assistant start the conversation with {contactName}
          </Text>

          {/* Prompts List */}
          <ScrollView style={styles.promptsContainer} showsVerticalScrollIndicator={false}>
            {prompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.promptItem}
                onPress={() => handlePromptSelect(prompt)}
              >
                <View style={styles.promptContent}>
                  <Text style={styles.promptText}>{prompt}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#1e3a8a" />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Custom Prompt Input */}
          <View style={styles.customPromptSection}>
            <Text style={styles.customPromptLabel}>Or use your own prompt:</Text>
            <TouchableOpacity
              style={styles.customPromptButton}
              onPress={() => handlePromptSelect("Custom prompt")}
            >
              <Text style={styles.customPromptButtonText}>Enter Custom Prompt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: RFValue(20),
    fontFamily: 'MMedium',
    color: '#000',
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: RFValue(16),
    fontFamily: 'MRegular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  promptsContainer: {
    maxHeight: 400,
  },
  promptItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  promptContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  promptText: {
    fontSize: RFValue(16),
    fontFamily: 'MRegular',
    color: '#000',
    flex: 1,
    marginRight: 16,
  },
  customPromptSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  customPromptLabel: {
    fontSize: RFValue(14),
    fontFamily: 'MRegular',
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  customPromptButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  customPromptButtonText: {
    color: '#fff',
    fontSize: RFValue(16),
    fontFamily: 'MMedium',
    fontWeight: '500',
  },
});

export default AIPromptModal; 
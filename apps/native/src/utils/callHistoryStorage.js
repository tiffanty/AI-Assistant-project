import AsyncStorage from '@react-native-async-storage/async-storage';

// Call object structure
// {
//   id: number,
//   name: string,
//   number: string,
//   timestamp: number,
//   type: "outgoing" | "incoming" | "missed",
//   duration?: number (in seconds)
// }

const CALL_HISTORY_STORAGE_KEY = '@call_history';

export const callHistoryStorage = {
  // Get all call history
  async getCallHistory() {
    try {
      const callsJson = await AsyncStorage.getItem(CALL_HISTORY_STORAGE_KEY);
      return callsJson ? JSON.parse(callsJson) : [];
    } catch (error) {
      console.error('Error getting call history:', error);
      return [];
    }
  },

  // Add a new call to history
  async addCall(call) {
    try {
      const calls = await this.getCallHistory();
      const newCall = {
        ...call,
        id: Date.now(),
        timestamp: Date.now(),
      };
      
      const updatedCalls = [newCall, ...calls]; // Add new call at the beginning
      await AsyncStorage.setItem(CALL_HISTORY_STORAGE_KEY, JSON.stringify(updatedCalls));
      
      return newCall;
    } catch (error) {
      console.error('Error adding call to history:', error);
      throw error;
    }
  },

  // Update call duration (for when call ends)
  async updateCallDuration(callId, duration) {
    try {
      const calls = await this.getCallHistory();
      const updatedCalls = calls.map(call => 
        call.id === callId ? { ...call, duration } : call
      );
      await AsyncStorage.setItem(CALL_HISTORY_STORAGE_KEY, JSON.stringify(updatedCalls));
    } catch (error) {
      console.error('Error updating call duration:', error);
      throw error;
    }
  },

  // Clear all call history
  async clearCallHistory() {
    try {
      await AsyncStorage.removeItem(CALL_HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing call history:', error);
      throw error;
    }
  },

  // Delete a specific call
  async deleteCall(callId) {
    try {
      const calls = await this.getCallHistory();
      const updatedCalls = calls.filter(call => call.id !== callId);
      await AsyncStorage.setItem(CALL_HISTORY_STORAGE_KEY, JSON.stringify(updatedCalls));
    } catch (error) {
      console.error('Error deleting call:', error);
      throw error;
    }
  },

  // Get recent calls (last 50 calls)
  async getRecentCalls(limit = 50) {
    try {
      const calls = await this.getCallHistory();
      return calls.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent calls:', error);
      return [];
    }
  },

  // Format timestamp to readable time
  formatTimestamp(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return new Date(timestamp).toLocaleDateString();
  }
}; 
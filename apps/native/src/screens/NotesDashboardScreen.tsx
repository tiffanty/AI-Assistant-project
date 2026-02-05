import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import ICloudSyncPrompt from "../components/ICloudSyncPrompt";

const NotesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allNotes = useQuery(api.notes.getNotes);
  const [search, setSearch] = useState("");
  const [showICloudPrompt, setShowICloudPrompt] = useState(false);

  // Show iCloud sync prompt when component mounts (first time user opens app)
  useEffect(() => {
    // Check if user has seen the prompt before (you could store this in AsyncStorage)
    // For now, we'll show it every time the component mounts
    const timer = setTimeout(() => {
      setShowICloudPrompt(true);
    }, 1000); // Show after 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleICloudSyncAccept = () => {
    setShowICloudPrompt(false);
    // Here you would implement the actual iCloud contact sync
    // Store the user's preference to not show the prompt again
  };

  const handleICloudSyncDecline = () => {
    setShowICloudPrompt(false);
    // Store the user's preference to not show the prompt again
  };

  const finalNotes = search
    ? allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : allNotes;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InsideNoteScreen", {
          item: item,
        })
      }
      activeOpacity={0.5}
      style={styles.noteItem}
    >
      <Text style={styles.noteText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>n</Text>
        </View>
        <TouchableOpacity 
          style={styles.phoneButton}
          onPress={() => navigation.navigate("PhoneHomeScreen")}
        >
          <Feather name="phone" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.yourNotesContainer}>
        {/* @ts-ignore, for css purposes */}
        <Image style={styles.avatarSmall} />
        <Text style={styles.title}>Call Log</Text>
        {imageUrl ? (
          <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
        ) : (
          <Text>{firstName ? firstName : ""}</Text>
        )}
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color="grey"
          style={styles.searchIcon}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>
      {!finalNotes || finalNotes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Make your first call to{"\n"}get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={finalNotes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          style={styles.notesList}
          contentContainerStyle={{
            marginTop: 19,
            borderTopWidth: 0.5,
            borderTopColor: "rgba(0, 0, 0, 0.59)",
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate("KeypadScreen")}
        style={styles.newNoteButton}
      >
        <AntDesign name="pluscircle" size={20} color="#fff" />
        <Text style={styles.newNoteButtonText}>Make a Call</Text>
      </TouchableOpacity>

      {/* iCloud Sync Prompt */}
      <ICloudSyncPrompt
        visible={showICloudPrompt}
        onAccept={handleICloudSyncAccept}
        onDecline={handleICloudSyncDecline}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#1e3a8a",
    height: 67,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    backgroundColor: "#1e3a8a",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "white",
    fontSize: RFValue(24),
    fontFamily: "Bold",
    fontWeight: "bold",
  },
  phoneButton: {
    padding: 8,
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    alignSelf: "center",
  },
  yourNotesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 19,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: "#2D2D2D",
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.59)",

    backgroundColor: "#F9FAFB",
  },
  noteText: {
    fontSize: 16,
    fontFamily: "MLight",
    color: "#2D2D2D",
  },

  newNoteButton: {
    flexDirection: "row",
    backgroundColor: "#1e3a8a",
    borderRadius: 7,
    width: Dimensions.get("window").width / 1.6,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    position: "absolute",
    bottom: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  newNoteButtonText: {
    color: "white",
    fontSize: RFValue(15),
    fontFamily: "MMedium",
    marginLeft: 10,
  },
  switchContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  emptyStateText: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: RFValue(15),
    color: "grey",
    fontFamily: "MLight",
  },
  emptyState: {
    width: "100%",
    height: "35%",
    marginTop: 19,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.59)",
  },
});

export default NotesDashboardScreen;

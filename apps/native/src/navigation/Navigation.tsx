import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PhoneHomeScreen from "../screens/PhoneHomeScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import KeypadScreen from "../screens/KeypadScreen";
import CreateContactScreen from "../screens/CreateContactScreen";
import ContactDetailsScreen from "../screens/ContactDetailsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="PhoneHomeScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="PhoneHomeScreen" component={PhoneHomeScreen} />
        <Stack.Screen
          name="NotesDashboardScreen"
          component={NotesDashboardScreen}
        />
        <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
        <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
        <Stack.Screen name="KeypadScreen" component={KeypadScreen} />
        <Stack.Screen name="CreateContactScreen" component={CreateContactScreen} />
        <Stack.Screen name="ContactDetailsScreen" component={ContactDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "react-native-vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const UpdateInfoScreen = ({ route }) => {
  const { heading, value } = route.params;
  const navigation = useNavigation();
  const [updateValue, setUpdateValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef?.current.focus();
    }

    return () => {
      if (inputRef.current) {
        inputRef?.current.blur();
      }
    };
  }, []);

  const handleUpdate = useCallback(() => {
    navigation.goBack();
  }, [updateValue]);
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.heading}>{heading}</Text>
        </View>
        <View style={styles.infoContainer}>
          <TextInput
            value={updateValue}
            ref={inputRef}
            onChangeText={(text) => setUpdateValue(text)}
            style={styles.inputContainer}
          />
        </View>
        <TouchableOpacity
          style={styles.updateButtonContainer}
          onPress={handleUpdate}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default UpdateInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2", //"white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  innerContainer: {
    flex: 1,
    padding: 10,
  },
  infoContainer: {
    gap: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: "black",
  },
  inputContainer: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  updateButtonContainer: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d05b19", //"#cdb2f5",
    marginTop: "auto",
  },
  updateButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
});

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import WheelPickerComponent from "../../components/Picker/WheelPickerComponent";
import { useNavigation } from "@react-navigation/native";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = 100;

const AgeUpdateScreen = () => {
  const { userDetail, updateAge } = userAuthUseContext();
  const [value, setValue] = useState(userDetail?.age);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

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

  const data = useMemo(
    () =>
      [...Array(200)].map((_, index) => ({
        value: index + 3,
        label: `${index + 3}`,
      })),
    []
  );

  const handleNext = () => {
    InteractionManager.runAfterInteractions(async () => {
      console.log("age of the user", value);

      //   setUserInfo("age", value);
      setLoading(true);
      await updateAge(value);
      setLoading(false);
      navigation.goBack();
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f7f8f9",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color="#d05b19" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Ionicons
          name="chevron-back"
          color="black"
          size={30}
          onPress={() => navigation.goBack()}
        />

        <View style={styles.header}>
          <Text style={styles.headerHeading}>What's your age?</Text>
        </View>

        <View style={styles.picker}>
          <WheelPickerComponent
            items={data}
            onIndexChange={setValue}
            defaultValue={value}
          />
        </View>
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Update</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default AgeUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8f9",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    marginTop: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  headerHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
  },
  unitSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "white",
    alignSelf: "center",
    marginBottom: 20,
  },
  unitName: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  unitSelected: {
    backgroundColor: "black",
    color: "white",
  },
  nextButtonContainer: {
    padding: 15,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#d05b19",
  },
  nextButtonText: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
  },
  picker: {
    alignItems: "center",
    justifyContent: "center",
  },
});

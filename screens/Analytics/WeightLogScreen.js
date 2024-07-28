import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";
import { parseISO, format } from "date-fns";
import { userAuthUseContext } from "../../Context/UserAuthContext";

const WeightLogScreen = () => {
  const { fetchUserLoggedWeight, userLoggedWeight, weightLog, userUid } =
    userAuthUseContext();
  const navigation = useNavigation();
  const [weight, setWeight] = useState();
  const [loading, setLoading] = useState(false);
  const weightInputRef = useRef(null);

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
    if (userLoggedWeight.length && userUid) {
      fetchUserLoggedWeight(userUid);
    }
  }, []);

  useEffect(() => {
    if (weightInputRef) {
      weightInputRef?.current.focus();
    }

    // return () => {
    //   if (weightInputRef) {
    //     weightInputRef?.current.blur();
    //   }
    // };
  }, []);

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

  const handleWeightLog = async () => {
    weightInputRef?.current?.blur();
    setLoading(true);
    await weightLog(userUid, weight);
    setWeight("");
    setLoading(false);
  };

  const RenderLoggedWeight = React.memo(({ item, index }) => {
    const parsedDate = parseISO(item?.date);
    const formattedDate = format(parsedDate, "EEEE, dd MMM, yyyy");
    return (
      <View style={styles.weightLoggedItemContainer}>
        <Text style={styles.weightLoggedItemDate}>{formattedDate}</Text>
        <Text style={styles.weightLoggedItemWeight}>{item?.weight}kg</Text>
      </View>
    );
  });

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
        </View>
        <View style={styles.weightInputContainer}>
          <TextInput
            ref={weightInputRef}
            value={weight}
            keyboardType="numeric"
            onChangeText={(text) => setWeight(text)}
            placeholder="weight in Kg"
            placeholderTextColor={"lightgrey"}
            style={styles.weightInput}
          />
          <TouchableOpacity
            style={styles.logButtonContainer}
            onPress={() => handleWeightLog()}
          >
            <Text style={styles.logButtonText}>Log</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loggedWeightList}>
          <FlatList
            data={userLoggedWeight}
            keyExtractor={(item) => String(item.date)}
            renderItem={({ item, index }) => (
              <RenderLoggedWeight item={item} index={index} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WeightLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    marginBottom: 15,
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 2,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    gap: 15,
    padding: 15,
  },
  weightInput: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  logButtonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#d05b19",
  },
  logButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  loggedWeightList: {
    flex: 1,
    marginTop: 10,
  },
  weightLoggedItemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "black",
    elevation: 2,
  },
  weightLoggedItemDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
  weightLoggedItemWeight: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
  },
});

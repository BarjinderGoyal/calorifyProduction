import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState, memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Octicons } from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";

const RenderExercise = memo(({ item, index, handleUpdate }) => {
  const calories_burned = item?.calories_burned;
  return (
    <View style={styles.exerciseContainer}>
      <View style={styles.exerciseInnerContainer}>
        <Text
          style={styles.exerciseName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item?.name}
        </Text>
        <Text style={styles.exeriseDuration}>{item?.duration} min</Text>
      </View>
      <View style={styles.exerciseInnerRightContainer}>
        <Text style={styles.exerciseCalorieBurned}>{calories_burned} Kcal</Text>
        <Octicons
          name="pencil"
          size={24}
          color="grey"
          onPress={() => handleUpdate(item?.name, index, calories_burned)}
        />
      </View>
    </View>
  );
});

const CustomModal = memo(
  ({
    visible,
    heading,
    updatedValue,
    setUpdatedValue,
    handleSubmit,
    closeModal,
  }) => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>{heading}</Text>
          <TextInput
            style={styles.input}
            value={String(updatedValue)}
            onChangeText={(text) => setUpdatedValue(Number(text))}
            placeholder={String(updatedValue)}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
);

const ExercisePreviewScreen = () => {
  const navigation = useNavigation();
  const { exerciseInfo, logExercise, updateExerciseInfo } = useMealsContext();
  const [updatedValue, setUpdatedValue] = useState(0);
  const [index, setIndex] = useState(0);
  const [exerciseName, setExerciseName] = useState("");
  const { userUid } = userAuthUseContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLogExercise = async () => {
    setLoading(true);
    console.log(userUid, "and log exercise will be called");
    await logExercise(userUid);
    setLoading(false);
    navigation.navigate("homeScreen");
  };

  const handleSubmit = () => {
    updateExerciseInfo(index, updatedValue);
    setModalVisible(false);
  };

  const handleUpdate = useCallback((exerciseName, index, value) => {
    setExerciseName(exerciseName);
    setUpdatedValue(value);
    setIndex(index);
    setModalVisible(true);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="#d05b19" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            color="grey"
            size={30}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.exerciseListContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {exerciseInfo?.parsedResponse?.exercises?.map((item, idx) => (
              <RenderExercise
                key={idx}
                item={item}
                index={idx}
                handleUpdate={handleUpdate}
              />
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.logButtonContainer}
          onPress={handleLogExercise}
        >
          <Text style={styles.logButtonText}>Log Exercise</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <CustomModal
        visible={modalVisible}
        heading={exerciseName}
        updatedValue={updatedValue}
        setUpdatedValue={setUpdatedValue}
        handleSubmit={handleSubmit}
        closeModal={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ExercisePreviewScreen;

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
  exerciseListContainer: {
    marginVertical: 15,
    flex: 1,
  },
  logButtonContainer: {
    paddingVertical: 15,
    backgroundColor: "#d05b19",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 20,
    marginTop: "auto",
  },
  logButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  exerciseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgrey",
    marginBottom: 15,
    gap: 10,
  },
  exerciseInnerContainer: {
    flex: 1,
    gap: 5,
  },
  exerciseInnerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  exeriseDuration: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
  exerciseCalorieBurned: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#d05b19",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "black",
    fontSize: 16,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#2196F3",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f7f8f9",
    justifyContent: "center",
    alignItems: "center",
  },
});

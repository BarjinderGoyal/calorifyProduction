import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { bottomSheetUseContext } from "../../Context/BottomSheetContext";

const { width, height } = Dimensions.get("window");

const LogMealModal = ({ navigation }) => {
  const { bottomSheetIsOpen, updateBottomSheet } = bottomSheetUseContext();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (bottomSheetIsOpen) {
      setModalVisible(true);
    }
  }, [bottomSheetIsOpen]);

  const closeModal = useCallback(() => {
    updateBottomSheet(false);
    setModalVisible(false);
  }, [bottomSheetIsOpen]);

  const handleCameraClick = useCallback(() => {
    closeModal();
    navigation.navigate("cameraScreen");
  }, [bottomSheetIsOpen]);

  const handleSearchClick = useCallback(() => {
    closeModal();
    navigation.navigate("searchScreen", {
      previousScreen: "search",
    });
  }, [bottomSheetIsOpen]);

  const handleSavedMealClick = useCallback(() => {
    closeModal();
    navigation.navigate("savedFoodScreen");
  }, [bottomSheetIsOpen]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.container} onPress={closeModal}>
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: "#F3FEB8" }]}
              onPress={handleSearchClick}
            >
              <Ionicons name="search" size={40} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: "#FFBF78" }]}
              onPress={handleCameraClick}
            >
              <Ionicons name="camera-outline" size={40} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: "#FF7F3E" }]}
              onPress={handleSavedMealClick}
            >
              <Ionicons name="bookmark-outline" size={40} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Make the background black
  },
  modalContent: {
    width: width - 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  option: {
    alignItems: "center",
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 10,
    gap: 10,
    height: 120,
    justifyContent: "center",
  },
  iconHeading: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
});

export default LogMealModal;

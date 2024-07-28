import React, { useMemo, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import { bottomSheetUseContext } from "../../Context/BottomSheetContext";

const { width, height } = Dimensions.get("window");

const LogMealBottomSheet = ({ navigation }) => {
  const bottomSheetRef = useRef(null);
  const { bottomSheetIsOpen, updateBottomSheet } = bottomSheetUseContext();

  useEffect(() => {
    if (bottomSheetIsOpen && bottomSheetRef) {
      console.log("bottom sheet useEffect is working");
      bottomSheetRef?.current.expand();
    }
  }, [bottomSheetIsOpen]);

  // Variables
  const snapPoints = useMemo(() => ["25%"], []);

  // Handlers
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const closeBottomSheet = useCallback(() => {
    updateBottomSheet(false);
    bottomSheetRef.current?.close();
  }, [bottomSheetIsOpen, bottomSheetRef]);

  const handleCameraClick = useCallback(() => {
    updateBottomSheet(false);
    navigation.navigate("cameraScreen");
  }, [bottomSheetIsOpen]);

  const handleSearchClick = useCallback(() => {
    updateBottomSheet(false);
    navigation.navigate("searchScreen", {
      previousScreen: "search",
    });
  }, [bottomSheetIsOpen]);

  const handleSavedMealClick = useCallback(() => {
    updateBottomSheet(false);
    navigation.navigate("savedFoodScreen");
  }, [bottomSheetIsOpen]);

  return (
    <Pressable onPress={closeBottomSheet} style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        onClose={() => updateBottomSheet(false)}
        style={styles.bottomSheet}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#F3FEB8" }]}
            onPress={() => handleSearchClick()}
          >
            <Ionicons name="search" size={30} color="#000" />
            <Text style={styles.iconHeading}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#FFBF78" }]}
            onPress={() => handleCameraClick()}
          >
            <Ionicons name="camera-outline" size={30} color="#000" />
            <Text style={styles.iconHeading}>AI Identify</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: "#FF7F3E" }]}
            onPress={() => handleSavedMealClick()}
          >
            <Ionicons name="bookmark-outline" size={30} color="#000" />
            <Text style={styles.iconHeading}>Saved Meal</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)", // Make the background black
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
  },
  option: {
    alignItems: "center",
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    flex: 1,
    gap: 10,
    height: 120,
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height * 0.75, // 75% of the screen height
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  iconHeading: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  bottomSheetBackground: {
    backgroundColor: "white",
  },
});

export default LogMealBottomSheet;

import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";
import * as ImageManipulator from "expo-image-manipulator";
import FoodScannerAnimation from "./FoodScannerAnimation";

const { height, width } = Dimensions.get("window");

const CameraScreen = ({ route }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { fetchNutritionsFromFoodImage, handleFoodImage } = useMealsContext();
  const [isLoading, setIsLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);
  const navigation = useNavigation();
  const cameraRef = useRef();

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

  const handlePhoto = useCallback(async () => {
    try {
      const options = {
        quality: 0.5,
        pictureSize: "Low",
        skipProcessing: true,
        imageType: "image/jpeg",
      };
      await cameraRef?.current.takePictureAsync(options).then(async (photo) => {
        if (photo) {
          console.log("clicked photo is", photo.uri);
          const manipResult = await ImageManipulator.manipulateAsync(
            photo.uri,
            [{ resize: { width: 1024, height: 1024 } }],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
          );
          setImageUrl(manipResult.uri);
          getResponseFromOpenAi(manipResult.uri);
        }
      });
    } catch (e) {
      console.log("error while clicking photo", e);
      Toast.show("Something went wrong", Toast.SHORT);
    }
  });
  const getResponseFromOpenAi = async (imageUri) => {
    try {
      setIsLoading(true);
      await fetchNutritionsFromFoodImage(imageUri);
      navigation.navigate("previewNutrientScreen");
    } catch (e) {
      Toast.show("Network Error", Toast.LONG);
      console.log("error while getting response from openai", e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", fontSize: 18 }}>
          We need your permission to open the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ backgroundColor: "#3FA2F6", padding: 20, borderRadius: 20 }}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
            GRANT PERMISSION
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    if (imageUrl !== null) {
      return <FoodScannerAnimation imageUri={imageUrl} />;
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <Ionicons
          name="chevron-back"
          size={40}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.cameraContainer}>
          <CameraView
            facing="back"
            style={styles.camera}
            ratio={"16:9"}
            autofocus={true}
            ref={cameraRef}
          ></CameraView>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handlePhoto} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "black",
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    width: width - 20,
    height: height * 0.6,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 40,
  },
  buttonContainer: {
    position: "absolute",
    bottom: height * 0.05,
    width: 100,
    height: 100,
    borderRadius: 150,
    left: width / 2,
    marginLeft: -50,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "white",
  },

  scanIconContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  //   scanIcon:{
  //   }
});

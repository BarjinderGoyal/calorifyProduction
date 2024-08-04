import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import Toast from "react-native-simple-toast"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign } from "react-native-vector-icons";
import { useMealsContext } from "../../Context/MealsContext";
import { userAuthUseContext } from "../../Context/UserAuthContext";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const foodNameMaxWidth = (width - 20) * 0.8;
const emptyImage = require("../../assets/empty-removebg.png");

const RendereSavedFood = React.memo(
  ({ item, index, foodSelection, isSelected, setIsSelected }) => {
    const handleClick = useCallback(
      (index) => {
        setIsSelected((prev) => {
          if (prev === index) {
            foodSelection(null);
            return null;
          } else {
            foodSelection(index);
            return index;
          }
        });
      },
      [index, item]
    );

    return (
      <Pressable
        onPress={() => handleClick(index)}
        style={styles.savedFoodItemContainer}
      >
        <View style={styles.savedFoodItemInnerContainer}>
          <Text
            style={styles.savedFoodName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item?.name}
          </Text>
          <Text style={styles.savedFoodCalorie}>{item?.calories} Kcal</Text>
          <Text style={styles.foodItemMicroNutrient}>
            <Text style={{ color: "#d96e6b" }}>
              P {item?.protein || 0}g <Text style={{ color: "black" }}>.</Text>{" "}
            </Text>
            <Text style={{ color: "#e09c63" }}>
              F {item?.fat || 0}g <Text style={{ color: "black" }}>.</Text>{" "}
            </Text>
            <Text style={{ color: "#8aa9ce" }}>C {item?.carbs || 0}g</Text>
          </Text>
        </View>
        {isSelected === index ? (
          <AntDesign name="checkcircle" size={30} color="#d05b19" />
        ) : (
          <AntDesign name="checkcircleo" size={30} color="grey" />
        )}
      </Pressable>
    );
  }
);

const SavedFoodScreen = () => {
  const { savedFood, fetchFoodFromFoodItemId } = useMealsContext();
  const { userUid } = userAuthUseContext();
  const [logButtonIsVisible, setLogButtonIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(null);
  const navigation = useNavigation();

  const [headingWidth, setHeadingWidth] = useState(0);

  const handleLayout = (event) => {
    setHeadingWidth(event.nativeEvent.layout.width);
  };

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

  const foodSelection = useCallback((index) => {
    setSelectedIndex(index);
    if (index !== null) {
      setLogButtonIsVisible(true);
    } else {
      setLogButtonIsVisible(false);
    }
  });

  const handleLogFood = async () => {
    console.log(selectedIndex, "sselectedOIndex");
    if (selectedIndex === null){
      Toast.show('Meal is not selected',Toast.SHORT);
      return;
    }
    setLoading(true);
    const foodId = savedFood[selectedIndex]?._id;
    console.log(foodId, savedFood);
    await fetchFoodFromFoodItemId(foodId);
    setLoading(false);
    navigation.navigate("previewNutrientScreen");
    // console.log("clicked log");
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
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
        <View style={styles.header}>
          <Ionicons
            name="chevron-back"
            size={40}
            color="grey"
            onPress={() => navigation.goBack()}
          />
          <Text
            style={[
              styles.heading,
              {
                left: (width - 20) / 2,
                marginLeft: -headingWidth / 2,
              },
            ]}
            onLayout={handleLayout}
          >
            Saved Food
          </Text>
          <TouchableOpacity
            style={styles.logButtonContainer}
            onPress={handleLogFood}
            disabled={!logButtonIsVisible}
          >
            <Text style={styles.logButtonText}>Log Food</Text>
          </TouchableOpacity>
        </View>
        {savedFood?.length !== 0 ? (
          <View style={styles.SavedFoodList}>
            <FlatList
              data={savedFood}
              renderItem={({ item, index }) => (
                <RendereSavedFood
                  item={item}
                  index={index}
                  foodSelection={foodSelection}
                  isSelected={isSelected}
                  setIsSelected={setIsSelected}
                />
              )}
              keyExtractor={(item) => String(item._id)}
              contentContainerStyle={{ gap: 10 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.emptyScreenContainer}>
            <Image source={emptyImage} style={styles.emptyImage} />
            {/* <Text style={styles.emptyScreenHeading}>Nothing is saved!!</Text> */}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SavedFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F5F2", //"#f7f8f9",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    position: "absolute",
  },
  savedFoodItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
  },
  savedFoodItemInnerContainer: {
    gap: 3,
  },
  savedFoodName: {
    fontSize: 18,
    color: "black",
    maxWidth: foodNameMaxWidth,
  },
  savedFoodCalorie: {
    fontSize: 16,
    color: "black",
  },
  SavedFoodList: {
    flex: 1,
    marginVertical: 10,
  },

  foodItemMicroNutrient: {
    fontSize: 14,
    fontWeight: "600",
    color: "black",
  },
  logButtonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d05b19",
    borderRadius: 20,
  },
  logButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  emptyScreenContainer: {
    backgroundColor: "transparent",
    alignItems: "center",

    // gap: 10,
  },
  emptyImage: {
    width: 400,
    height: 400,
    marginTop: height * 0.1,
  },
  emptyScreenHeading: {
    fontSize: 18,
    color: "black",
    marginTop: -100,
  },
});

import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-simple-toast'
import { Ionicons } from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOnBoardingContext } from "../Context/OnBoardingContext";

const { width } = Dimensions.get("window");

const barItemWidth = (width - 140) / 8;

const HeightScreen = () => {
  const { setUserInfo } = useOnBoardingContext();

  const navigation = useNavigation();
  const [height, setHeight] = useState();
  const [heightUnit, setHeightUnit] = useState("cm");

  const handleNext = () => {
   
    const isNumeric = /^[0-9]*\.?[0-9]+$/.test(height);
    if(isNumeric ){
      setHeight(height);
      setUserInfo("height",height)
      navigation.navigate('weightScreen')
    }else{
      Toast.show('Height is Invalied',Toast.SHORT)
    }
  };

  const handleHeight = ( value) => {
    setHeight(value);
  }
  

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.barContainer}>
          <Ionicons
            name="chevron-back"
            color="black"
            size={30}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.innerBarContainer}>
            {[...new Array(5)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "#d05b19",
                  height: 5,
                }}
                key={index}
              />
            ))}
            {[...new Array(3)].map((_, index) => (
              <View
                style={{
                  width: barItemWidth,
                  backgroundColor: "grey",
                  height: 5,
                }}
                key={index}
              />
            ))}
          </View>
        </View>
        <View style={styles.header}>
          <Text style={styles.headerHeading}>What's your height(in cm)?</Text>
        </View>
        <View style={styles.heightInputContainer}>
            <TextInput
              value={height}
              placeholder="Cm"
              placeholderTextColor={"lightgrey"}
              onChangeText={(text) => handleHeight( text)}
              keyboardType="numeric"
              // placeholder="Age"
              style={styles.heightInput}
            />
        </View>
        <TouchableOpacity
          style={styles.nextButtonContainer}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default HeightScreen;

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
    marginTop: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  headerHeading: {
    fontSize: 25,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
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
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  innerBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  heightInput: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    // marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    width: "100%",
  },
  ftContainer: {
    gap: 15,
  },
  heightInputContainer: {
    gap: 15,
  },
  heightUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ftunit: {
    padding: 10,
    width: width * 0.3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  cmunit: {
    padding: 10,
    width: width * 0.3,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
});

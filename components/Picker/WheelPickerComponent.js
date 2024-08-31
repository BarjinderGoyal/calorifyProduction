// import React, { useRef, useEffect } from "react";
// import { Animated, FlatList, StyleSheet, View } from "react-native";

// const ITEM_WIDTH = 160;
// const ITEM_HEIGHT = 80;

// const WheelPickerComponent = ({ items, onIndexChange, defaultValue }) => {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const didMountRef = useRef(false);

//   useEffect(() => {
//     if (didMountRef.current) {
//       // Run only when defaultValue changes, not on initial mount
//       const defaultIndex = items?.findIndex(
//         (item) => item?.value === defaultValue
//       );

//       if (defaultIndex !== -1) {
//         flatListRef.current.scrollToOffset({
//           offset: defaultIndex * ITEM_HEIGHT,
//           animated: true,
//         });
//       }
//     } else {
//       didMountRef.current = true;
//     }
//   }, [defaultValue]);

//   const renderItem = ({ item, index }) => {
//     const inputRange = [
//       (index - 2) * ITEM_HEIGHT,
//       (index - 1) * ITEM_HEIGHT,
//       index * ITEM_HEIGHT,
//     ];

//     const scale = scrollY.interpolate({
//       inputRange,
//       outputRange: [1, 2, 1],
//     });

//     return (
//       <Animated.View
//         style={[
//           { height: ITEM_HEIGHT, transform: [{ scale }] },
//           styles.animatedContainer,
//         ]}
//       >
//         <Animated.Text style={[styles.pickerItem]}>{item?.label}</Animated.Text>
//       </Animated.View>
//     );
//   };

//   const modifiedItems = ["", ...items, ""];

//   const momentumScrollEnd = (event) => {
//     const y = event.nativeEvent.contentOffset.y;
//     const index = Math.round(y / ITEM_HEIGHT);
//     onIndexChange(index);
//   };

//   return (
//     <View style={{ height: ITEM_HEIGHT * 3 }}>
//       <Animated.FlatList
//         ref={flatListRef}
//         data={modifiedItems}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         snapToInterval={ITEM_HEIGHT}
//         onMomentumScrollEnd={momentumScrollEnd}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         getItemLayout={(_, index) => ({
//           length: ITEM_HEIGHT,
//           offset: ITEM_HEIGHT * index,
//           index,
//         })}
//         style={{ flex: 1, width: ITEM_WIDTH }}
//       />
//       <View style={[styles.indicatorHolder, { top: ITEM_HEIGHT }]}>
//         <View style={[styles.indicator, { marginTop: ITEM_HEIGHT }]} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   pickerItem: {
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "#000",
//   },
//   indicatorHolder: {
//     position: "absolute",
//     alignSelf: "center",
//     borderWidth: 1,
//     borderRadius: 15,
//     backgroundColor: "transparent",
//     zIndex: -1,
//   },
//   indicator: {
//     width: ITEM_WIDTH,
//     backgroundColor: "#ccc",
//   },
//   animatedContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default React.memo(WheelPickerComponent);

// import React, { useRef, useEffect } from "react";
// import { Animated, FlatList, StyleSheet, View } from "react-native";

// const ITEM_WIDTH = 160;
// const ITEM_HEIGHT = 80;

// const WheelPickerComponent = ({ items, onIndexChange, defaultValue }) => {
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const didMountRef = useRef(false);

//   useEffect(() => {
//     if (didMountRef.current) {
//       const defaultIndex = items?.findIndex(
//         (item) => item?.value === defaultValue
//       );

//       if (defaultIndex !== -1) {
//         flatListRef.current.scrollToOffset({
//           offset: (defaultIndex + 1) * ITEM_HEIGHT, // +1 to account for the empty item at the top
//           animated: true,
//         });
//       }
//     } else {
//       didMountRef.current = true;
//     }
//   }, [defaultValue]);

//   const renderItem = ({ item, index }) => {
//     const inputRange = [
//       (index - 2) * ITEM_HEIGHT,
//       (index - 1) * ITEM_HEIGHT,
//       index * ITEM_HEIGHT,
//     ];

//     const scale = scrollY.interpolate({
//       inputRange,
//       outputRange: [1, 2, 1],
//     });

//     return (
//       <Animated.View
//         style={[
//           { height: ITEM_HEIGHT, transform: [{ scale }] },
//           styles.animatedContainer,
//         ]}
//       >
//         <Animated.Text style={[styles.pickerItem]}>{item?.label}</Animated.Text>
//       </Animated.View>
//     );
//   };

//   const modifiedItems = ["", ...items, ""]; // Empty items for padding

//   const momentumScrollEnd = (event) => {
//     const y = event.nativeEvent.contentOffset.y;
//     const index = Math.round(y / ITEM_HEIGHT);
//     onIndexChange(index - 1); // Subtract 1 to correct the index
//   };

//   return (
//     <View style={{ height: ITEM_HEIGHT * 3 }}>
//       <Animated.FlatList
//         ref={flatListRef}
//         data={modifiedItems}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         snapToInterval={ITEM_HEIGHT}
//         onMomentumScrollEnd={momentumScrollEnd}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: true }
//         )}
//         getItemLayout={(_, index) => ({
//           length: ITEM_HEIGHT,
//           offset: ITEM_HEIGHT * index,
//           index,
//         })}
//         style={{ flex: 1, width: ITEM_WIDTH }}
//       />
//       <View style={[styles.indicatorHolder, { top: ITEM_HEIGHT }]}>
//         <View style={[styles.indicator, { marginTop: ITEM_HEIGHT }]} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   pickerItem: {
//     fontSize: 18,
//     fontWeight: "600",
//     textAlign: "center",
//     textAlignVertical: "center",
//     color: "#000",
//   },
//   indicatorHolder: {
//     position: "absolute",
//     alignSelf: "center",
//     borderWidth: 1,
//     borderRadius: 15,
//     backgroundColor: "transparent",
//     zIndex: -1,
//   },
//   indicator: {
//     width: ITEM_WIDTH,
//     backgroundColor: "#ccc",
//   },
//   animatedContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

// export default React.memo(WheelPickerComponent);

import React, { useRef, useEffect } from "react";
import { Animated, FlatList, StyleSheet, View } from "react-native";

const ITEM_WIDTH = 160;
const ITEM_HEIGHT = 80;

const WheelPickerComponent = ({ items, onIndexChange, defaultValue }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Remove useEffect for defaultValue to prevent unexpected scroll jumps

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 2, 1], // Use a subtler animation
    });

    return (
      <Animated.View
        style={[
          { height: ITEM_HEIGHT, transform: [{ scale }] },
          styles.animatedContainer,
        ]}
      >
        <Animated.Text style={[styles.pickerItem]}>{item?.label}</Animated.Text>
      </Animated.View>
    );
  };

  const modifiedItems = ["", ...items, ""]; // Padding items

  const momentumScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    onIndexChange(items[index]?.value); // No need to subtract 1
  };

  return (
    <View style={{ height: ITEM_HEIGHT * 3 }}>
      <Animated.FlatList
        ref={flatListRef}
        data={modifiedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={{ flex: 1, width: ITEM_WIDTH }}
      />
      <View style={[styles.indicatorHolder, { top: ITEM_HEIGHT }]}>
        <View style={[styles.indicator, { marginTop: ITEM_HEIGHT }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerItem: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000",
  },
  indicatorHolder: {
    position: "absolute",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "transparent",
    zIndex: -1,
  },
  indicator: {
    width: ITEM_WIDTH,
    backgroundColor: "#ccc",
  },
  animatedContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default React.memo(WheelPickerComponent);

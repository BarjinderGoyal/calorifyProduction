// import * as React from "react";
// import { TextInput, View, StyleSheet } from "react-native";
// import Svg, { G, Circle } from "react-native-svg";
// import Animated, {
//   useSharedValue,
//   useAnimatedProps,
//   withTiming,
//   Easing,
// } from "react-native-reanimated";

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// export default function CircularProgressBar({
//   percentage = 0,
//   radius = 80,
//   strokeWidth = 10,
//   duration = 500,
//   color = "tomato",
//   delay = 0,
//   textColor,
//   max = 100,
//   type = "calorie",
// }) {
//   const circumference = 2 * Math.PI * radius;
//   const halfCircle = radius + strokeWidth;
//   const progressCircle = useSharedValue(0);
//   const progressText = useSharedValue(0);

//   const animatedCircleProps = useAnimatedProps(() => {
//     const limitedProgress = Math.min(progressCircle.value, max);
//     const maxPerc = (100 * limitedProgress) / max;
//     const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
//     return {
//       strokeDashoffset,
//     };
//   });

//   const animatedTextProps = useAnimatedProps(() => {
//     let value = progressText.value;
//     if (type === "calorie") {
//       value = Math.round(value);
//     } else {
//       value = Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
//     }
//     return {
//       text: `${value}`,
//     };
//   });

//   React.useEffect(() => {
//     progressCircle.value = withTiming(Math.min(percentage, max), {
//       duration,
//       easing: Easing.out(Easing.ease),
//     });
//     progressText.value = withTiming(percentage, {
//       duration,
//       easing: Easing.out(Easing.ease),
//     });
//   }, [percentage, duration, Easing, max]);

//   const calculateFontSize = (value) => {
//     const length = value.toString().length;
//     const baseFontSize = radius / 2.5;
//     return baseFontSize - length * 2; // Adjust the subtraction factor based on text length
//   };

//   return (
//     <View style={{ width: radius * 2, height: radius * 2 }}>
//       <Svg
//         height={radius * 2}
//         width={radius * 2}
//         viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
//       >
//         <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
//           <Circle
//             cx="50%"
//             cy="50%"
//             r={radius}
//             fill="transparent"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeLinejoin="round"
//             strokeOpacity=".1"
//           />
//           <AnimatedCircle
//             cx="50%"
//             cy="50%"
//             r={radius}
//             fill="transparent"
//             stroke={color}
//             strokeWidth={strokeWidth}
//             strokeLinecap="round"
//             strokeDasharray={circumference}
//             animatedProps={animatedCircleProps}
//           />
//         </G>
//       </Svg>
//       <AnimatedTextInput
//         underlineColorAndroid="transparent"
//         editable={false}
//         defaultValue="0"
//         style={[
//           StyleSheet.absoluteFillObject,
//           {
//             fontSize: calculateFontSize(progressText.value),
//             color: textColor ?? color,
//             padding: 10,
//           },
//           styles.text,
//         ]}
//         animatedProps={animatedTextProps}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   text: { fontWeight: "900", textAlign: "center" },
// });

import * as React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function CircularProgressBar({
  percentage = 0,
  radius = 80,
  strokeWidth = 10,
  duration = 500,
  color = "tomato",
  delay = 0,
  textColor,
  max = 100,
  type = "calorie",
}) {
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;
  const progressCircle = useSharedValue(0);
  const progressText = useSharedValue(0);

  const animatedCircleProps = useAnimatedProps(() => {
    const limitedProgress = Math.min(progressCircle.value, max);
    const maxPerc = (100 * limitedProgress) / max;
    const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
    return {
      strokeDashoffset,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    let value = progressText.value;
    if (type === "calorie") {
      value = Math.round(value);
    } else {
      value = Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
    }
    return {
      text: `${value}`,
    };
  });

  React.useEffect(() => {
    progressCircle.value = withTiming(Math.min(Number(percentage), max), {
      duration,
      easing: Easing.out(Easing.ease),
    });
    progressText.value = withTiming(Number(percentage), {
      duration,
      easing: Easing.out(Easing.ease),
    });
  }, [percentage, duration, Easing, max]);

  const calculateFontSize = (value) => {
    const length = value.toString().length;
    const baseFontSize = radius / 2.5;
    return baseFontSize;
    -length * 2; // Adjust the subtraction factor based on text length
  };

  return (
    <View style={{ width: radius * 2, height: radius * 2 }}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
      >
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity=".1"
          />
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedCircleProps}
          />
        </G>
      </Svg>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFillObject,
          {
            fontSize: calculateFontSize(progressText.value),
            color: textColor ?? color,
            padding: 10,
          },
          styles.text,
        ]}
        animatedProps={animatedTextProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontWeight: "900", textAlign: "center" },
});

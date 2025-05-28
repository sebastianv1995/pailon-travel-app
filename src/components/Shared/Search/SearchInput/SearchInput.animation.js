import { Animated } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Crear componente animado
export const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);

const animVal = new Animated.Value(0);

// Animación solo de propiedades compatibles con useNativeDriver
const arrowAnimation = {
  opacity: animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  }),
  transform: [
    {
      translateX: animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
      }),
    },
    {
      scale: animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      }),
    },
  ],
};

// Usamos el valor animado directamente para controlar el ancho vía listener
const inputAnimationWidth = animVal;

// Animaciones de posición compatibles con useNativeDriver
const inputAnimation = {
  transform: [
    {
      translateX: animVal.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 10],
      }),
    },
  ],
};

// Animaciones con useNativeDriver: true para mejor rendimiento
const animatedTransition = Animated.timing(animVal, {
  toValue: 1,
  duration: 200,
  useNativeDriver: true,
});

const animatedTransitionReset = Animated.timing(animVal, {
  toValue: 0,
  duration: 200,
  useNativeDriver: true,
});

export const searchAnimation = {
  arrow: arrowAnimation,
  input: inputAnimation,
  inputWidth: inputAnimationWidth,
  transition: animatedTransition,
  transitionReset: animatedTransitionReset,
};

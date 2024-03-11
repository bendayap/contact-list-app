/* eslint-disable react-native/sort-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react/react-in-jsx-scope */
import { ActivityIndicator, StyleSheet, View } from "react-native"

export const LoadingIndicator = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={"cyan"} />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
})

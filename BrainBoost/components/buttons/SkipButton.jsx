import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 

const SkipButton = ({ hideSkip, onSkip }) => {
  const router = useRouter();  

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push("/auth/login"); 
    }
  };

  if (hideSkip) return null;  

  return (
    <TouchableOpacity 
      style={styles.skipButton} 
      onPress={handleSkip}
      activeOpacity={0.7}
    >
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  skipButton: {
    position: "absolute",
    top: 80,
    right: 30,
    zIndex: 1000, 
  },
  skipText: {
    fontSize: 17,
    color: "gray",
  },
});

export default SkipButton;

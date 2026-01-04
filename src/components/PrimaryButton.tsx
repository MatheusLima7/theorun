import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
}: PrimaryButtonProps) {
  const isSecondary = variant === "secondary";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isSecondary && styles.secondaryButton]}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, isSecondary && styles.secondaryText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1F5EFF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButton: {
    backgroundColor: "#F4F6FF",
    borderWidth: 1,
    borderColor: "#D6E0FF",
  },
  secondaryText: {
    color: "#1F5EFF",
  },
});

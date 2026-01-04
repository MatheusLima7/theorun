import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthFooterProps {
  question: string;
  actionLabel: string;
  onAction: () => void;
}

export function AuthFooter({
  question,
  actionLabel,
  onAction,
}: AuthFooterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "center",
  },
  question: {
    fontSize: 14,
    color: "#667085",
  },
  action: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#1F5EFF",
  },
});

import { StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Theo Run</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
  },
  brand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F5EFF",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#667085",
  },
});

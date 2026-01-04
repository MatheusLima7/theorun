import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface SettingsScreenProps {
  onBack: () => void;
  onOpenAssistant: () => void;
}

export function SettingsScreen({
  onBack,
  onOpenAssistant,
}: SettingsScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Configurações</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Assistente de IA</Text>
          <Text style={styles.cardSubtitle}>
            Controle quais informações serão faladas durante a corrida.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onOpenAssistant}>
            <Text style={styles.primaryButtonText}>Configurar assistente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Privacidade</Text>
          <Text style={styles.cardSubtitle}>
            Seus dados de GPS são usados apenas para gerar o histórico de corridas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  backText: {
    color: "#1F5EFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  headerSpacer: {
    width: 60,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  cardSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#667085",
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#1F5EFF",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

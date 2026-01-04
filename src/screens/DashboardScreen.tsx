import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardScreenProps {
  onLogout: () => void;
}

export function DashboardScreen({ onLogout }: DashboardScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Theo Run</Text>
            <Text style={styles.title}>Resumo da corrida</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Corrida Matinal</Text>
          <Text style={styles.heroSubtitle}>Rio de Janeiro · 6,4 km</Text>
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>Ritmo médio</Text>
              <Text style={styles.metricValue}>5:12 /km</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Velocidade</Text>
              <Text style={styles.metricValue}>11,5 km/h</Text>
            </View>
          </View>
          <View style={styles.metricRow}>
            <View>
              <Text style={styles.metricLabel}>Tempo</Text>
              <Text style={styles.metricValue}>33:22</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Calorias</Text>
              <Text style={styles.metricValue}>410 kcal</Text>
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vídeo da corrida</Text>
          <Text style={styles.cardSubtitle}>
            Gere um vídeo animado com mapa, ritmo e velocidade evoluindo em tempo
            real.
          </Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Gerar vídeo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registrar nova corrida</Text>
          <Text style={styles.cardSubtitle}>
            Inicie a gravação usando GPS, acompanhe o pace e finalize com
            segurança.
          </Text>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Iniciar corrida</Text>
          </TouchableOpacity>
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
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brand: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F5EFF",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#101828",
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475467",
  },
  heroCard: {
    backgroundColor: "#1F5EFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#D6E4FF",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  metricLabel: {
    fontSize: 12,
    color: "#D6E4FF",
  },
  metricValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#101828",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#667085",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#1F5EFF",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#F4F6FF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6E4FF",
  },
  secondaryButtonText: {
    color: "#1F5EFF",
    fontWeight: "600",
  },
});

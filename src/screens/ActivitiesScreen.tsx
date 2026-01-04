import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RunSummary } from "../types/run";

interface ActivitiesScreenProps {
  activities: RunSummary[];
  onBack: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const formatPace = (paceMinPerKm: number) => {
  if (!paceMinPerKm || Number.isNaN(paceMinPerKm)) {
    return "--:--";
  }
  const totalSeconds = Math.round(paceMinPerKm * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function ActivitiesScreen({ activities, onBack }: ActivitiesScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Atividades</Text>
          <View style={styles.headerSpacer} />
        </View>

        {activities.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma corrida registrada</Text>
            <Text style={styles.emptySubtitle}>
              Inicie uma nova corrida para registrar seus dados de GPS e
              desempenho.
            </Text>
          </View>
        ) : (
          activities.map((run) => (
            <View key={run.id} style={styles.card}>
              <Text style={styles.cardTitle}>{run.title}</Text>
              <Text style={styles.cardSubtitle}>
                {new Date(run.startedAt).toLocaleString("pt-BR")}
              </Text>
              <View style={styles.metricsRow}>
                <View>
                  <Text style={styles.metricLabel}>Distância</Text>
                  <Text style={styles.metricValue}>
                    {(run.distanceMeters / 1000).toFixed(2)} km
                  </Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Tempo</Text>
                  <Text style={styles.metricValue}>
                    {formatDuration(run.durationSeconds)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Ritmo</Text>
                  <Text style={styles.metricValue}>
                    {formatPace(run.averagePaceMinPerKm)} /km
                  </Text>
                </View>
              </View>
              <Text style={styles.sectionLabel}>JSON completo</Text>
              <Text style={styles.jsonPreview} selectable>
                {JSON.stringify(run, null, 2)}
              </Text>
            </View>
          ))
        )}
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
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#667085",
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
    marginTop: 4,
    fontSize: 12,
    color: "#98A2B3",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  metricLabel: {
    fontSize: 11,
    color: "#667085",
  },
  metricValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
  },
  sectionLabel: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "600",
    color: "#475467",
  },
  jsonPreview: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 16,
    color: "#1D2939",
    backgroundColor: "#F8F9FC",
    padding: 12,
    borderRadius: 12,
  },
});

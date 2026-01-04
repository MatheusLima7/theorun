import { useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AssistantSettings } from "../types/run";

interface AssistantSettingsScreenProps {
  settings: AssistantSettings;
  onBack: () => void;
  onChange: (settings: AssistantSettings) => void;
}

export function AssistantSettingsScreen({
  settings,
  onBack,
  onChange,
}: AssistantSettingsScreenProps) {
  const updateSetting = (partial: Partial<AssistantSettings>) => {
    onChange({ ...settings, ...partial });
  };

  const triggerLabel = useMemo(() => {
    if (settings.trigger === "minutes") {
      return `${settings.intervalMinutes} min`;
    }

    return `${settings.intervalKm} km`;
  }, [settings.intervalKm, settings.intervalMinutes, settings.trigger]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Assistente de IA</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Ativar assistente</Text>
              <Text style={styles.rowSubtitle}>
                Anúncios por voz durante a corrida.
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => updateSetting({ enabled: value })}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>O que deve ser falado</Text>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Ritmo ou velocidade média</Text>
              <Text style={styles.rowSubtitle}>
                Escolha entre minutos por km ou km/h.
              </Text>
            </View>
          </View>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                settings.paceMode === "minPerKm" && styles.toggleButtonActive,
              ]}
              onPress={() => updateSetting({ paceMode: "minPerKm" })}
            >
              <Text
                style={[
                  styles.toggleText,
                  settings.paceMode === "minPerKm" && styles.toggleTextActive,
                ]}
              >
                min/km
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                settings.paceMode === "avgSpeed" && styles.toggleButtonActive,
              ]}
              onPress={() => updateSetting({ paceMode: "avgSpeed" })}
            >
              <Text
                style={[
                  styles.toggleText,
                  settings.paceMode === "avgSpeed" && styles.toggleTextActive,
                ]}
              >
                km/h
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Falar distância percorrida</Text>
              <Text style={styles.rowSubtitle}>Atualizações de distância.</Text>
            </View>
            <Switch
              value={settings.announceDistance}
              onValueChange={(value) =>
                updateSetting({ announceDistance: value })
              }
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Status das metas</Text>
              <Text style={styles.rowSubtitle}>
                Informe se está acima ou abaixo do objetivo.
              </Text>
            </View>
            <Switch
              value={settings.announceGoalStatus}
              onValueChange={(value) =>
                updateSetting({ announceGoalStatus: value })
              }
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Comparar com última corrida</Text>
              <Text style={styles.rowSubtitle}>
                Destaque diferença de distância.
              </Text>
            </View>
            <Switch
              value={settings.announceComparison}
              onValueChange={(value) =>
                updateSetting({ announceComparison: value })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Integração com vídeo</Text>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Salvar áudios no vídeo</Text>
              <Text style={styles.rowSubtitle}>
                Embutir narração no vídeo final.
              </Text>
            </View>
            <Switch
              value={settings.saveAudioToVideo}
              onValueChange={(value) =>
                updateSetting({ saveAudioToVideo: value })
              }
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Gerar breakpoints</Text>
              <Text style={styles.rowSubtitle}>
                Pausas automáticas para análises.
              </Text>
            </View>
            <Switch
              value={settings.addVideoBreakpoints}
              onValueChange={(value) =>
                updateSetting({ addVideoBreakpoints: value })
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quando anunciar</Text>
          <Text style={styles.sectionSubtitle}>Intervalo atual: {triggerLabel}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                settings.trigger === "minutes" && styles.toggleButtonActive,
              ]}
              onPress={() => updateSetting({ trigger: "minutes" })}
            >
              <Text
                style={[
                  styles.toggleText,
                  settings.trigger === "minutes" && styles.toggleTextActive,
                ]}
              >
                Minutos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                settings.trigger === "km" && styles.toggleButtonActive,
              ]}
              onPress={() => updateSetting({ trigger: "km" })}
            >
              <Text
                style={[
                  styles.toggleText,
                  settings.trigger === "km" && styles.toggleTextActive,
                ]}
              >
                Km
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>
              {settings.trigger === "minutes" ? "Intervalo (min)" : "Intervalo (km)"}
            </Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  updateSetting({
                    intervalMinutes: Math.max(1, settings.intervalMinutes - 1),
                    intervalKm: Math.max(1, settings.intervalKm - 1),
                  })
                }
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>
                {settings.trigger === "minutes"
                  ? settings.intervalMinutes
                  : settings.intervalKm}
              </Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() =>
                  updateSetting({
                    intervalMinutes: settings.intervalMinutes + 1,
                    intervalKm: settings.intervalKm + 1,
                  })
                }
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#667085",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#101828",
  },
  rowSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: "#98A2B3",
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    alignItems: "center",
    backgroundColor: "#F4F6FF",
  },
  toggleButtonActive: {
    backgroundColor: "#1F5EFF",
    borderColor: "#1F5EFF",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F5EFF",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterLabel: {
    fontSize: 13,
    color: "#344054",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4F6FF",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  counterButtonText: {
    fontSize: 16,
    color: "#1F5EFF",
  },
  counterValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#101828",
  },
});

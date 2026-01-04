import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AssistantEvent,
  AssistantSettings,
  RunSummary,
} from "../types/run";

const GOAL_DISTANCE_METERS = 5000;
const GOAL_TIME_SECONDS = 30 * 60;

interface RunScreenProps {
  assistantSettings: AssistantSettings;
  lastRun?: RunSummary;
  onFinish: (run: RunSummary) => void;
  onBack: () => void;
}

const initialLocation = {
  latitude: -22.9068,
  longitude: -43.1729,
};

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceBetween = (
  a: typeof initialLocation,
  b: typeof initialLocation
) => {
  const R = 6371000;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return R * c;
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

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const formatDistance = (meters: number) => `${(meters / 1000).toFixed(2)} km`;

const formatSpeed = (meters: number, seconds: number) => {
  if (!seconds) {
    return "--";
  }
  const kmh = (meters / 1000) / (seconds / 3600);
  return `${kmh.toFixed(1)} km/h`;
};

export function RunScreen({
  assistantSettings,
  lastRun,
  onFinish,
  onBack,
}: RunScreenProps) {
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceMeters, setDistanceMeters] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [locations, setLocations] = useState<RunSummary["locations"]>([]);
  const [assistantEvents, setAssistantEvents] = useState<AssistantEvent[]>([]);
  const [isHoldingFinish, setIsHoldingFinish] = useState(false);
  const holdProgress = useRef(new Animated.Value(0)).current;
  const startTimeRef = useRef(new Date());
  const elapsedRef = useRef(0);
  const distanceRef = useRef(0);
  const locationRef = useRef(initialLocation);
  const lastAnnouncementRef = useRef({ minutes: 0, km: 0 });

  useEffect(() => {
    if (!isCountingDown) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsCountingDown(false);
          startTimeRef.current = new Date();
          lastAnnouncementRef.current = { minutes: 0, km: 0 };
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountingDown]);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    distanceRef.current = distanceMeters;
  }, [distanceMeters]);

  useEffect(() => {
    locationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    if (isPaused || isCountingDown) {
      return;
    }

    const interval = setInterval(() => {
      const nextElapsed = elapsedRef.current + 1;
      const current = locationRef.current;
      const nextLocation = {
        latitude: current.latitude + (Math.random() - 0.5) * 0.00015,
        longitude: current.longitude + (Math.random() - 0.5) * 0.00015,
      };
      const increment = distanceBetween(current, nextLocation);
      const updatedDistance = distanceRef.current + increment;
      const paceMinPerKm = updatedDistance
        ? (nextElapsed / 60) / (updatedDistance / 1000)
        : 0;

      const sample = {
        latitude: nextLocation.latitude,
        longitude: nextLocation.longitude,
        timestamp: new Date().toISOString(),
        secondsElapsed: nextElapsed,
        paceMinPerKm,
        distanceMeters: updatedDistance,
      };

      setElapsedSeconds(nextElapsed);
      setDistanceMeters(updatedDistance);
      setCurrentLocation(nextLocation);
      setLocations((prev) => [...prev, sample]);

      if (assistantSettings.enabled) {
        const shouldAnnounce = () => {
          if (assistantSettings.trigger === "minutes") {
            const intervalMinutes = Math.max(1, assistantSettings.intervalMinutes);
            const intervalSeconds = intervalMinutes * 60;
            if (nextElapsed % intervalSeconds === 0) {
              return true;
            }
          }

          if (assistantSettings.trigger === "km") {
            const intervalKm = Math.max(1, assistantSettings.intervalKm);
            const nextKm = updatedDistance / 1000;
            if (
              nextKm - lastAnnouncementRef.current.km >= intervalKm &&
              nextKm >= intervalKm
            ) {
              lastAnnouncementRef.current.km =
                Math.floor(nextKm / intervalKm) * intervalKm;
              return true;
            }
          }

          return false;
        };

        if (shouldAnnounce()) {
          const messages: string[] = [];
          if (assistantSettings.paceMode === "minPerKm") {
            messages.push(`Ritmo médio ${formatPace(paceMinPerKm)} min/km`);
          } else {
            messages.push(
              `Velocidade média ${formatSpeed(updatedDistance, nextElapsed)}`
            );
          }

          if (assistantSettings.announceDistance) {
            messages.push(`Distância ${formatDistance(updatedDistance)}`);
          }

          if (assistantSettings.announceGoalStatus) {
            const targetPaceSeconds = GOAL_TIME_SECONDS / (GOAL_DISTANCE_METERS / 1000);
            const currentPaceSeconds = paceMinPerKm * 60;
            const goalStatus =
              updatedDistance >= GOAL_DISTANCE_METERS
                ? "Meta de distância concluída"
                : currentPaceSeconds <= targetPaceSeconds
                ? "Você está dentro da meta de 5 km em 30 min"
                : "Você precisa acelerar para bater a meta";
            messages.push(goalStatus);
          }

          if (assistantSettings.announceComparison && lastRun) {
            const lastDistanceKm = lastRun.distanceMeters / 1000;
            const currentDistanceKm = updatedDistance / 1000;
            const comparison =
              currentDistanceKm >= lastDistanceKm
                ? "Você já superou a distância da última corrida"
                : `Faltam ${(lastDistanceKm - currentDistanceKm).toFixed(
                    2
                  )} km para alcançar a última corrida`;
            messages.push(comparison);
          }

          if (messages.length > 0) {
            const event: AssistantEvent = {
              timestamp: new Date().toISOString(),
              message: messages.join(" · "),
              context: "assistente-voz",
              audioFile: assistantSettings.saveAudioToVideo
                ? `audio-${Date.now()}.mp3`
                : undefined,
            };
            setAssistantEvents((prev) => [...prev, event]);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [assistantSettings, isPaused, lastRun]);

  const averagePace = useMemo(() => {
    if (!distanceMeters) {
      return 0;
    }
    return (elapsedSeconds / 60) / (distanceMeters / 1000);
  }, [distanceMeters, elapsedSeconds]);

  const handleHoldStart = () => {
    setIsHoldingFinish(true);
    holdProgress.setValue(0);
    Animated.timing(holdProgress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        handleFinishRun();
      }
    });
  };

  const handleHoldEnd = () => {
    setIsHoldingFinish(false);
    holdProgress.stopAnimation();
    holdProgress.setValue(0);
  };

  const handleFinishRun = () => {
    const finalAveragePace = distanceRef.current
      ? (elapsedRef.current / 60) / (distanceRef.current / 1000)
      : 0;
    const runSummary: RunSummary = {
      id: `run-${Date.now()}`,
      title: "Corrida guiada",
      startedAt: startTimeRef.current.toISOString(),
      durationSeconds: elapsedRef.current,
      distanceMeters: distanceRef.current,
      averagePaceMinPerKm: finalAveragePace,
      locations,
      assistantEvents,
      assistantSettings,
    };

    onFinish(runSummary);
  };

  const progressRotation = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Corrida em tempo real</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.mapCard}>
          <View style={styles.mapHeader}>
            <Text style={styles.mapTitle}>Mapa ao vivo</Text>
            <Text style={styles.mapSubtitle}>GPS ativo · {locations.length} pontos</Text>
          </View>
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapDot} />
            <Text style={styles.mapText}>Lat {currentLocation.latitude.toFixed(5)}</Text>
            <Text style={styles.mapText}>Lon {currentLocation.longitude.toFixed(5)}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Tempo</Text>
            <Text style={styles.metricValue}>{formatDuration(elapsedSeconds)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Distância</Text>
            <Text style={styles.metricValue}>{formatDistance(distanceMeters)}</Text>
          </View>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Ritmo médio</Text>
            <Text style={styles.metricValue}>{formatPace(averagePace)} /km</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Velocidade</Text>
            <Text style={styles.metricValue}>
              {formatSpeed(distanceMeters, elapsedSeconds)}
            </Text>
          </View>
        </View>

        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Meta ativa</Text>
          <Text style={styles.goalSubtitle}>5 km em 30 minutos</Text>
          <Text style={styles.goalProgress}>
            {distanceMeters >= GOAL_DISTANCE_METERS
              ? "Meta atingida!"
              : `${((distanceMeters / GOAL_DISTANCE_METERS) * 100).toFixed(0)}% concluído`}
          </Text>
        </View>

        <View style={styles.controlsCard}>
          <TouchableOpacity
            style={[
              styles.pauseButton,
              isPaused && styles.pauseButtonActive,
              isCountingDown && styles.pauseButtonDisabled,
            ]}
            onPress={() => setIsPaused((prev) => !prev)}
            disabled={isCountingDown}
          >
            <Text style={styles.pauseButtonText}>
              {isPaused ? "Retomar corrida" : "Pausar corrida"}
            </Text>
          </TouchableOpacity>

          {isPaused && (
            <View style={styles.finishContainer}>
              <Text style={styles.finishHint}>
                Pressione por 5 segundos para finalizar
              </Text>
              <Pressable
                onPressIn={handleHoldStart}
                onPressOut={handleHoldEnd}
                style={styles.finishButton}
              >
                <Text style={styles.finishButtonText}>Finalizar corrida</Text>
                {isHoldingFinish && (
                  <Animated.View
                    style={[
                      styles.progressRing,
                      { transform: [{ rotate: progressRotation }] },
                    ]}
                  />
                )}
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.assistantCard}>
          <Text style={styles.assistantTitle}>Assistente de voz</Text>
          <Text style={styles.assistantSubtitle}>
            {assistantSettings.enabled
              ? `Eventos a cada ${
                  assistantSettings.trigger === "minutes"
                    ? `${assistantSettings.intervalMinutes} min`
                    : `${assistantSettings.intervalKm} km`
                }`
              : "Assistente desativado"}
          </Text>
          {assistantEvents.length === 0 ? (
            <Text style={styles.assistantEmpty}>
              Nenhum anúncio gerado até agora.
            </Text>
          ) : (
            assistantEvents.slice(-3).map((event) => (
              <View key={event.timestamp} style={styles.assistantEvent}>
                <Text style={styles.assistantEventText}>{event.message}</Text>
                {event.audioFile && (
                  <Text style={styles.assistantEventMeta}>
                    {event.audioFile}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {isCountingDown && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownLabel}>Prepare-se</Text>
          <Text style={styles.countdownValue}>{countdown}</Text>
          <Text style={styles.countdownHint}>A corrida começa já</Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  headerSpacer: {
    width: 60,
  },
  mapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  mapHeader: {
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  mapSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#667085",
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  mapDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1F5EFF",
    marginBottom: 8,
  },
  mapText: {
    fontSize: 12,
    color: "#1D2939",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  metricLabel: {
    fontSize: 12,
    color: "#667085",
  },
  metricValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  goalCard: {
    backgroundColor: "#1F5EFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  goalSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#D6E4FF",
  },
  goalProgress: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  controlsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  pauseButton: {
    backgroundColor: "#F4F6FF",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6E4FF",
  },
  pauseButtonActive: {
    backgroundColor: "#FFEAD5",
    borderColor: "#FEC84B",
  },
  pauseButtonDisabled: {
    opacity: 0.6,
  },
  pauseButtonText: {
    color: "#1F5EFF",
    fontWeight: "600",
  },
  finishContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  finishHint: {
    fontSize: 12,
    color: "#667085",
    marginBottom: 12,
  },
  finishButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#FF4D4F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  progressRing: {
    position: "absolute",
    top: -6,
    bottom: -6,
    left: -6,
    right: -6,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "#FFFFFF",
  },
  assistantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  assistantTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  assistantSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#667085",
    marginBottom: 12,
  },
  assistantEmpty: {
    fontSize: 13,
    color: "#98A2B3",
  },
  assistantEvent: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#EAECF0",
  },
  assistantEventText: {
    fontSize: 13,
    color: "#344054",
  },
  assistantEventMeta: {
    marginTop: 4,
    fontSize: 11,
    color: "#98A2B3",
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 24, 40, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  countdownLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  countdownValue: {
    fontSize: 88,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 4,
  },
  countdownHint: {
    marginTop: 12,
    fontSize: 14,
    color: "#D0D5DD",
  },
});

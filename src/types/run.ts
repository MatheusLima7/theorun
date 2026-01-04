export type LocationSample = {
  latitude: number;
  longitude: number;
  timestamp: string;
  secondsElapsed: number;
  paceMinPerKm: number;
  distanceMeters: number;
};

export type AssistantEvent = {
  timestamp: string;
  message: string;
  context?: string;
  audioFile?: string;
};

export type AssistantTrigger = "minutes" | "km";

export type AssistantSettings = {
  enabled: boolean;
  paceMode: "minPerKm" | "avgSpeed";
  announceDistance: boolean;
  announceGoalStatus: boolean;
  announceComparison: boolean;
  saveAudioToVideo: boolean;
  addVideoBreakpoints: boolean;
  trigger: AssistantTrigger;
  intervalMinutes: number;
  intervalKm: number;
};

export type RunSummary = {
  id: string;
  title: string;
  startedAt: string;
  durationSeconds: number;
  distanceMeters: number;
  averagePaceMinPerKm: number;
  locations: LocationSample[];
  assistantEvents: AssistantEvent[];
  assistantSettings: AssistantSettings;
};

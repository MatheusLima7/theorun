import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthCard } from "./src/components/AuthCard";
import { AuthFooter } from "./src/components/AuthFooter";
import { AuthHeader } from "./src/components/AuthHeader";
import { AuthInput } from "./src/components/AuthInput";
import { PrimaryButton } from "./src/components/PrimaryButton";
import { ActivitiesScreen } from "./src/screens/ActivitiesScreen";
import { AssistantSettingsScreen } from "./src/screens/AssistantSettingsScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { RunScreen } from "./src/screens/RunScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { AssistantSettings, RunSummary } from "./src/types/run";

const enum Screen {
  Login = "login",
  Signup = "signup",
  Forgot = "forgot",
  Dashboard = "dashboard",
  Run = "run",
  Activities = "activities",
  Settings = "settings",
  Assistant = "assistant",
}

const SCREEN_TITLES: Record<Screen, string> = {
  [Screen.Login]: "Entrar",
  [Screen.Signup]: "Criar conta",
  [Screen.Forgot]: "Recuperar senha",
  [Screen.Dashboard]: "Theo Run",
  [Screen.Run]: "Corrida",
  [Screen.Activities]: "Atividades",
  [Screen.Settings]: "Configurações",
  [Screen.Assistant]: "Assistente",
};

const DEFAULT_ASSISTANT_SETTINGS: AssistantSettings = {
  enabled: true,
  paceMode: "minPerKm",
  announceDistance: true,
  announceGoalStatus: true,
  announceComparison: true,
  saveAudioToVideo: false,
  addVideoBreakpoints: false,
  trigger: "minutes",
  intervalMinutes: 2,
  intervalKm: 1,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [activities, setActivities] = useState<RunSummary[]>([]);
  const [assistantSettings, setAssistantSettings] =
    useState<AssistantSettings>(DEFAULT_ASSISTANT_SETTINGS);

  const footerText = useMemo(() => {
    if (screen === Screen.Login) {
      return {
        question: "Ainda não tem conta?",
        action: "Criar agora",
        target: Screen.Signup,
      };
    }

    if (screen === Screen.Signup) {
      return {
        question: "Já possui uma conta?",
        action: "Entrar",
        target: Screen.Login,
      };
    }

    return {
      question: "Lembrou da senha?",
      action: "Voltar ao login",
      target: Screen.Login,
    };
  }, [screen]);

  if (screen === Screen.Dashboard) {
    return (
      <DashboardScreen
        onLogout={() => setScreen(Screen.Login)}
        onStartRun={() => setScreen(Screen.Run)}
        onOpenActivities={() => setScreen(Screen.Activities)}
        onOpenSettings={() => setScreen(Screen.Settings)}
      />
    );
  }

  if (screen === Screen.Run) {
    return (
      <RunScreen
        assistantSettings={assistantSettings}
        lastRun={activities[0]}
        onBack={() => setScreen(Screen.Dashboard)}
        onFinish={(run) => {
          setActivities((prev) => [run, ...prev]);
          setScreen(Screen.Activities);
        }}
      />
    );
  }

  if (screen === Screen.Activities) {
    return (
      <ActivitiesScreen
        activities={activities}
        onBack={() => setScreen(Screen.Dashboard)}
      />
    );
  }

  if (screen === Screen.Settings) {
    return (
      <SettingsScreen
        onBack={() => setScreen(Screen.Dashboard)}
        onOpenAssistant={() => setScreen(Screen.Assistant)}
      />
    );
  }

  if (screen === Screen.Assistant) {
    return (
      <AssistantSettingsScreen
        settings={assistantSettings}
        onBack={() => setScreen(Screen.Settings)}
        onChange={setAssistantSettings}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <AuthHeader
          title={SCREEN_TITLES[screen]}
          subtitle="Sua corrida inteligente começa aqui"
        />
        <AuthCard>
          {screen === Screen.Signup && (
            <AuthInput
              label="Nome completo"
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
              textContentType="name"
            />
          )}
          <AuthInput
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <AuthInput
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />
          {screen === Screen.Login && (
            <TouchableOpacity
              onPress={() => setScreen(Screen.Forgot)}
              style={styles.link}
            >
              <Text style={styles.linkText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          )}
          <PrimaryButton
            label={screen === Screen.Signup ? "Criar conta" : "Entrar"}
            onPress={() => setScreen(Screen.Dashboard)}
          />
        </AuthCard>
        {screen === Screen.Forgot && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Envio rápido e seguro</Text>
            <Text style={styles.infoText}>
              Vamos enviar um link de redefinição para o seu e-mail com
              instruções. Você pode voltar ao app a qualquer momento.
            </Text>
            <PrimaryButton
              label="Enviar link"
              variant="secondary"
              onPress={() => setScreen(Screen.Login)}
            />
          </View>
        )}
        <AuthFooter
          question={footerText.question}
          actionLabel={footerText.action}
          onAction={() => setScreen(footerText.target)}
        />
        <Text style={styles.legal}>
          Ao continuar, você concorda com nossos Termos e Política de
          Privacidade.
        </Text>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  link: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  linkText: {
    color: "#1F5EFF",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#475467",
    lineHeight: 20,
    marginBottom: 16,
  },
  legal: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#98A2B3",
  },
});

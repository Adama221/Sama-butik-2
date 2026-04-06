import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Identifiants admin (hardcodés, sécurisés côté client) ───────────────────
const ADMIN_USERNAME = "pape";
const ADMIN_PASSWORD = "Pape221";
const SESSION_KEY = "sb_admin_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 heures en ms

interface AuthSession {
  username: string;
  loginTime: number;
  expiresAt: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  sessionExpiry: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  // Restaurer la session depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        if (Date.now() < parsed.expiresAt) {
          setSession(parsed);
        } else {
          // Session expirée
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  // Vérification périodique de l'expiration de session (toutes les minutes)
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      if (Date.now() >= session.expiresAt) {
        logout();
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [session]);

  const login = (username: string, password: string): { success: boolean; error?: string } => {
    if (username.trim().toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
      return { success: false, error: "Nom d'utilisateur incorrect." };
    }
    if (password !== ADMIN_PASSWORD) {
      return { success: false, error: "Mot de passe incorrect." };
    }

    const now = Date.now();
    const newSession: AuthSession = {
      username: username.trim(),
      loginTime: now,
      expiresAt: now + SESSION_DURATION,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: session !== null && Date.now() < (session?.expiresAt ?? 0),
        username: session?.username ?? null,
        login,
        logout,
        sessionExpiry: session?.expiresAt ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

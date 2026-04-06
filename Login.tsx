import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Si déjà connecté → redirection
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Restaurer le lockout depuis sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("sb_lockout");
    if (stored) {
      const until = parseInt(stored, 10);
      if (Date.now() < until) {
        setLockedUntil(until);
        setAttempts(MAX_ATTEMPTS);
      } else {
        sessionStorage.removeItem("sb_lockout");
      }
    }
  }, []);

  // Countdown du lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockCountdown(remaining);
      if (remaining === 0) {
        setLockedUntil(null);
        setAttempts(0);
        sessionStorage.removeItem("sb_lockout");
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (lockedUntil && Date.now() < lockedUntil) {
      setError(`Trop de tentatives. Réessayez dans ${lockCountdown}s.`);
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    // Petite pause pour simuler une vérification (anti-brute force UX)
    await new Promise((r) => setTimeout(r, 600));

    const result = login(username, password);
    setLoading(false);

    if (result.success) {
      navigate("/admin", { replace: true });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(result.error || "Identifiants incorrects.");

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockedUntil(until);
        sessionStorage.setItem("sb_lockout", until.toString());
        setError(`Compte temporairement bloqué pour 5 minutes après ${MAX_ATTEMPTS} tentatives échouées.`);
      } else {
        setError(`${result.error} (${MAX_ATTEMPTS - newAttempts} tentative(s) restante(s))`);
      }
    }
  };

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-200 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-300 rounded-full opacity-20 blur-3xl" />
        {/* Motif africain décoratif */}
        <div className="absolute top-8 left-8 opacity-10">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <polygon points="60,5 115,30 115,90 60,115 5,90 5,30" stroke="#f97316" strokeWidth="3" fill="none"/>
            <polygon points="60,20 100,40 100,80 60,100 20,80 20,40" stroke="#f97316" strokeWidth="2" fill="none"/>
            <circle cx="60" cy="60" r="15" stroke="#f97316" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-8 right-8 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="8" stroke="#f97316" strokeWidth="3" fill="none"/>
            <rect x="25" y="25" width="50" height="50" rx="4" stroke="#f97316" strokeWidth="2" fill="none"/>
            <circle cx="50" cy="50" r="12" stroke="#f97316" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-10 text-center relative">
            {/* Motif wax simulé */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border-2 border-white rounded-full"
                  style={{
                    width: `${40 + i * 30}px`,
                    height: `${40 + i * 30}px`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>

            {/* Logo */}
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">👘</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">Sama Butik</h1>
              <p className="text-orange-100 text-sm mt-1">Administration</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-orange-200 opacity-60" />
                <span className="text-orange-100 text-xs uppercase tracking-widest">HLM 5</span>
                <div className="h-px w-12 bg-orange-200 opacity-60" />
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="px-8 py-8">
            <h2 className="text-center text-gray-700 text-lg font-semibold mb-6">
              Connexion Admin
            </h2>

            {/* Alerte lockout */}
            {isLocked && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-red-700 font-semibold text-sm">Accès temporairement bloqué</p>
                  <p className="text-red-500 text-xs mt-1">
                    Trop de tentatives échouées. Réessayez dans{" "}
                    <span className="font-bold">{Math.floor(lockCountdown / 60)}:{String(lockCountdown % 60).padStart(2, "0")}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Erreur */}
            {error && !isLocked && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={isLocked || loading}
                    autoComplete="username"
                    className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 text-gray-800 placeholder-gray-400 transition-all outline-none text-sm
                      ${isLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" :
                        "border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white"}`}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    disabled={isLocked || loading}
                    autoComplete="current-password"
                    className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 text-gray-800 placeholder-gray-400 transition-all outline-none text-sm
                      ${isLocked ? "bg-gray-100 cursor-not-allowed border-gray-200" :
                        "border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 bg-gray-50 focus:bg-white"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Indicateur tentatives */}
              {attempts > 0 && attempts < MAX_ATTEMPTS && !isLocked && (
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-gray-500">Tentatives :</span>
                  <div className="flex gap-1">
                    {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i < attempts ? "bg-red-400" : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Bouton connexion */}
              <button
                type="submit"
                disabled={isLocked || loading}
                className={`w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-200 flex items-center justify-center gap-3 shadow-lg
                  ${isLocked ? "bg-gray-300 cursor-not-allowed" :
                    "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200 hover:shadow-xl active:scale-95"}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Vérification…
                  </>
                ) : isLocked ? (
                  <>🔒 Accès bloqué ({Math.floor(lockCountdown / 60)}:{String(lockCountdown % 60).padStart(2, "0")})</>
                ) : (
                  <>🔐 Se connecter</>
                )}
              </button>
            </form>

            {/* Info sécurité */}
            <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">🛡️</span>
                <span className="text-xs font-semibold text-orange-700">Zone sécurisée</span>
              </div>
              <p className="text-xs text-orange-600 leading-relaxed">
                Accès réservé aux administrateurs de Sama Butik. Session active pendant 8 heures.
                Après {MAX_ATTEMPTS} tentatives échouées, le compte est bloqué 5 minutes.
              </p>
            </div>

            {/* Lien retour boutique */}
            <div className="mt-5 text-center">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
              >
                ← Retour à la boutique
              </Link>
            </div>
          </div>
        </div>

        {/* Badge version */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-400">Sama Butik Admin v2.0 · Marché HLM 5, Dakar</span>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

const SHOP_CATEGORIES = [
  { value: "nouveaux-arrivages", label: "Nouveaux Arrivages", icon: "🆕", desc: "Les dernières pièces",       color: "text-red-500",    bg: "hover:bg-red-50" },
  { value: "boubou-homme",       label: "Boubou Homme",       icon: "👘", desc: "Boubous & kaftans",          color: "text-orange-500", bg: "hover:bg-orange-50" },
  { value: "korite-tabaski",     label: "Korité & Tabaski",   icon: "🎉", desc: "Tenues de fête",             color: "text-amber-500",  bg: "hover:bg-amber-50" },
  { value: "mariage",            label: "Tenues Mariage",     icon: "💍", desc: "Pour votre grand jour",      color: "text-yellow-500", bg: "hover:bg-yellow-50" },
  { value: "babouches",          label: "Babouches",          icon: "👡", desc: "Chaussures artisanales",     color: "text-orange-400", bg: "hover:bg-orange-50" },
  { value: "accessoires",        label: "Accessoires",        icon: "💎", desc: "Ceintures, bonnets & plus",  color: "text-gray-500",   bg: "hover:bg-gray-50" },
];

export default function Navbar() {
  const { cartCount } = useStore();
  const { isAuthenticated, username, logout } = useAuth();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const megaRef  = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fermer les menus au clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setShowMegaMenu(false);
      }
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setShowAdminMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fermer les menus lors d'un changement de route
  useEffect(() => {
    setMenuOpen(false);
    setShowMegaMenu(false);
    setShowAdminMenu(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowAdminMenu(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <div>
              <p className="font-black text-lg text-gray-900 leading-tight tracking-wide">SAMA BUTIK</p>
              <p className="text-[10px] text-orange-500 font-semibold tracking-widest uppercase -mt-0.5">HLM 5 · Dakar</p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">

            {/* Accueil */}
            <Link to="/"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive("/") ? "bg-orange-500 text-white shadow" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}>
              Accueil
            </Link>

            {/* ── BOUTIQUE MEGA MENU ── */}
            <div ref={megaRef} className="relative">
              <button
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  showMegaMenu || location.pathname === "/boutique"
                    ? "bg-orange-500 text-white shadow"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}>
                Boutique
                <svg className={`w-4 h-4 transition-transform duration-200 ${showMegaMenu ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Menu Dropdown */}
              {showMegaMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[520px] bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden z-50">
                  {/* Header du mega menu */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                    <p className="text-white font-black text-base">🛍️ Nos Collections</p>
                    <p className="text-orange-100 text-xs mt-0.5">Mode africaine authentique — HLM 5, Dakar</p>
                  </div>

                  {/* Grille de catégories */}
                  <div className="grid grid-cols-2 gap-1 p-3">
                    {SHOP_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.value}
                        to={`/boutique?category=${cat.value}`}
                        onClick={() => setShowMegaMenu(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${cat.bg} transition-all group`}>
                        <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                        <div>
                          <p className={`font-bold text-sm text-gray-900 group-hover:${cat.color}`}>{cat.label}</p>
                          <p className="text-xs text-gray-400">{cat.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pied du mega menu */}
                  <div className="border-t border-orange-100 px-6 py-3 flex items-center justify-between bg-orange-50">
                    <Link to="/boutique" onClick={() => setShowMegaMenu(false)}
                      className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      Voir tous les produits →
                    </Link>
                    <span className="text-xs text-gray-400">Livraison express Dakar</span>
                  </div>
                </div>
              )}
            </div>

            {/* Affiliation */}
            <Link to="/affiliation"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive("/affiliation") ? "bg-orange-500 text-white shadow" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}>
              🤝 Affiliation
            </Link>

            {/* À Propos */}
            <Link to="/a-propos"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive("/a-propos") ? "bg-orange-500 text-white shadow" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}>
              À Propos
            </Link>

            {/* Contact */}
            <Link to="/contact"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive("/contact") ? "bg-orange-500 text-white shadow" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}>
              Contact
            </Link>

            {/* ── Admin dropdown ── */}
            {isAuthenticated ? (
              <div ref={adminRef} className="relative ml-2">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-50 border-2 border-orange-200 text-orange-700 rounded-full text-sm font-semibold hover:bg-orange-100 transition-all">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {username?.charAt(0) ?? "A"}
                  </span>
                  {username}
                  <svg className={`w-4 h-4 transition-transform ${showAdminMenu ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
                      <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide">Admin connecté</p>
                      <p className="text-sm font-bold text-gray-800">{username}</p>
                    </div>
                    <Link to="/admin" onClick={() => setShowAdminMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <span>📦</span> Produits & Commandes
                    </Link>
                    <Link to="/admin/affiliation" onClick={() => setShowAdminMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <span>🤝</span> Gestion Affiliation
                    </Link>
                    <div className="border-t border-gray-100">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold">
                        <span>🚪</span> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="ml-2 px-4 py-2 text-sm font-semibold text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all flex items-center gap-1">
                🔐 Admin
              </Link>
            )}
          </div>

          {/* ── Cart + Mobile toggle ── */}
          <div className="flex items-center gap-3">
            <Link to="/panier"
              className="relative flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors shadow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-orange-500">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-orange-50"
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ══════════════ MOBILE MENU ══════════════ */}
        {menuOpen && (
          <div className="md:hidden border-t border-orange-100 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
            <Link to="/" onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive("/") ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-50"
              }`}>
              🏠 Accueil
            </Link>

            {/* Catégories boutique sur mobile */}
            <div className="px-4 py-2">
              <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">🛍️ Boutique — Collections</p>
              <div className="space-y-1">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link key={cat.value} to={`/boutique?category=${cat.value}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">
                    <span className="text-lg">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
                <Link to="/boutique" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-orange-500 hover:bg-orange-50 transition-all">
                  <span>→</span> Tous les produits
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2 space-y-1">
              <Link to="/affiliation" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive("/affiliation") ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-50"
                }`}>
                🤝 Programme Affiliation
              </Link>
              <Link to="/a-propos" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive("/a-propos") ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-50"
                }`}>
                ℹ️ À Propos
              </Link>
              <Link to="/contact" onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive("/contact") ? "bg-orange-500 text-white" : "text-gray-700 hover:bg-orange-50"
                }`}>
                📞 Contact
              </Link>
            </div>

            {/* Mobile admin */}
            <div className="border-t border-gray-100 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="mx-4 my-2 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-500 font-semibold mb-1">Connecté en tant qu'admin</p>
                    <p className="text-sm font-bold text-gray-800">{username}</p>
                  </div>
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-semibold text-orange-700 hover:bg-orange-50">
                    📦 Produits & Commandes
                  </Link>
                  <Link to="/admin/affiliation" onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-semibold text-orange-700 hover:bg-orange-50">
                    🤝 Gestion Affiliation
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                    🚪 Se déconnecter
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-orange-400">
                  🔐 Connexion Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barre de session admin */}
      {isAuthenticated && (
        <div className="bg-orange-500 text-white text-center py-1 text-xs font-semibold tracking-wide">
          🔐 Mode Administration activé ·{" "}
          <Link to="/admin" className="underline hover:text-orange-100">Tableau de bord</Link>{" "}
          ·{" "}
          <button onClick={handleLogout} className="underline hover:text-orange-100">Déconnexion</button>
        </div>
      )}
    </nav>
  );
}

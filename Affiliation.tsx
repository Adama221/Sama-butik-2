import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Affiliate } from "../types";

type Tab = "register" | "dashboard" | "howto" | "catalog";

export default function Affiliation() {
  const {
    products,
    registerAffiliate,
    getAffiliateByCode,
    getReferralsByAffiliate,
    getWithdrawalsByAffiliate,
    requestWithdrawal,
    calcProductCommission,
    calcProductCommissionRate,
  } = useStore();

  const [tab, setTab] = useState<Tab>("howto");
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);

  // ── Register form ─────────────────────────────────────────────
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [registered, setRegistered] = useState<Affiliate | null>(null);
  const [formError, setFormError] = useState("");

  // ── Login form ────────────────────────────────────────────────
  const [loginCode, setLoginCode] = useState("");
  const [loginError, setLoginError] = useState("");

  // ── Withdrawal form ───────────────────────────────────────────
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"wave" | "orange_money" | "free_money">("wave");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawMsg, setWithdrawMsg] = useState("");

  // ── Catalog filter ────────────────────────────────────────────
  const [catalogCategory, setCatalogCategory] = useState("all");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError("Nom et téléphone sont obligatoires.");
      return;
    }
    const aff = registerAffiliate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      commissionRate: 10,
    });
    setRegistered(aff);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const aff = getAffiliateByCode(loginCode.trim().toUpperCase());
    if (!aff) {
      setLoginError("Code affilié introuvable. Vérifiez votre code.");
      return;
    }
    setAffiliate(aff);
    setTab("dashboard");
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliate) return;
    const amount = parseInt(withdrawAmount);
    if (!amount || amount < 1000) {
      setWithdrawMsg("Montant minimum : 1 000 FCFA");
      return;
    }
    if (amount > affiliate.balance) {
      setWithdrawMsg("Solde insuffisant.");
      return;
    }
    requestWithdrawal(affiliate.id, amount, withdrawMethod, withdrawPhone);
    setWithdrawMsg("✅ Demande de retrait envoyée ! Traitement sous 24h.");
    setShowWithdraw(false);
    setWithdrawAmount("");
    const updated = getAffiliateByCode(affiliate.code);
    if (updated) setAffiliate(updated);
  };

  const myReferrals = affiliate ? getReferralsByAffiliate(affiliate.id) : [];
  const myWithdrawals = affiliate ? getWithdrawalsByAffiliate(affiliate.id) : [];

  // Avec HashRouter, les URLs sont sous la forme : origin/index.html#/boutique?ref=CODE
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const affiliateLink = affiliate
    ? `${baseUrl}#/boutique?ref=${affiliate.code}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
  };

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🛍️ Découvrez *Sama Butik HLM5* - Les plus beaux boubous & vêtements africains de Dakar !\n\n👉 Commandez ici : ${affiliateLink}\n\n✨ L'élégance africaine au quotidien`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const COMMISSION_RATE = affiliate?.commissionRate ?? 10;

  // Catalogue produits filtré par catégorie
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = catalogCategory === "all"
    ? products
    : products.filter((p) => p.category === catalogCategory);

  // Calcul des commissions maximales possibles dans le catalogue
  const totalPotentialCommission = products.reduce((sum, p) => sum + calcProductCommission(p, COMMISSION_RATE), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4 text-sm font-semibold">
            🤝 Programme d'Affiliation
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Gagnez de l'argent avec<br />
            <span className="text-yellow-300">Sama Butik</span>
          </h1>
          <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto">
            Partagez nos produits et gagnez une <strong className="text-white">commission unique par produit</strong>.
            Chaque article a sa propre référence et son propre taux. Payement via Wave, Orange Money ou Free Money.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: "🏷️", label: "Commission par produit" },
              { icon: "📱", label: "Partage WhatsApp" },
              { icon: "⚡", label: "Paiement rapide" },
              { icon: "📊", label: "Suivi en temps réel" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-1 sm:gap-2 bg-white rounded-2xl p-2 shadow-sm border border-orange-100 mb-8 overflow-x-auto">
          {[
            { key: "howto", label: "💡 Comment ça marche" },
            { key: "catalog", label: "🏷️ Commissions produits" },
            { key: "register", label: "✍️ S'inscrire" },
            { key: "dashboard", label: "📊 Mon espace" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as Tab); if (t.key !== "dashboard") setAffiliate(null); }}
              className={`flex-shrink-0 flex-1 py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-500 hover:text-orange-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        {tab === "howto" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  icon: "✍️",
                  title: "Inscrivez-vous",
                  desc: "Créez votre compte affilié gratuitement en moins de 2 minutes. Obtenez votre code unique.",
                },
                {
                  step: "02",
                  icon: "📢",
                  title: "Partagez",
                  desc: "Partagez votre lien unique sur WhatsApp, Facebook, Instagram ou par SMS auprès de vos proches.",
                },
                {
                  step: "03",
                  icon: "💸",
                  title: "Gagnez",
                  desc: "Pour chaque vente via votre lien, vous gagnez la commission spécifique à chaque produit vendu.",
                },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="text-xs font-black text-orange-300 mb-1">ÉTAPE {item.step}</div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Nouvelle section : commission par produit */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
                🏷️ <span>Commission unique par produit</span>
              </h3>
              <p className="text-gray-600 text-sm mb-5">
                Contrairement à d'autres programmes, chez Sama Butik <strong>chaque produit a sa propre référence et son propre taux de commission</strong>.
                Certains produits rapportent plus ! Consultez le catalogue pour choisir vos meilleurs vendeurs.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {products.slice(0, 3).map((p) => {
                  const comm = calcProductCommission(p, 10);
                  const rate = calcProductCommissionRate(p, 10);
                  const isFixed = !!(p.commissionFixed && p.commissionFixed > 0);
                  return (
                    <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs leading-tight line-clamp-1">{p.name}</p>
                        <p className="font-mono text-xs text-orange-500 mt-0.5">{p.affiliateRef ?? "—"}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-xs font-black px-1.5 py-0.5 rounded ${isFixed ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                            {rate}%
                          </span>
                          <span className="text-xs font-black text-orange-500">= {comm.toLocaleString("fr-FR")} F</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setTab("catalog")}
                className="mt-4 w-full text-center text-orange-500 font-bold text-sm hover:underline"
              >
                Voir toutes les commissions → 
              </button>
            </div>

            {/* Simulateur */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-xl font-black text-gray-900 mb-2 text-center">💰 Simulateur de gains</h3>
              <p className="text-gray-500 text-center text-sm mb-6">Estimez vos revenus mensuels avec notre programme</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { sales: 5, avg: 35000, label: "Débutant", icon: "🌱" },
                  { sales: 15, avg: 45000, label: "Actif", icon: "🚀" },
                  { sales: 30, avg: 55000, label: "Expert", icon: "⭐" },
                ].map((sim) => (
                  <div key={sim.label} className="bg-white rounded-xl p-5 text-center shadow-sm border border-orange-100">
                    <div className="text-3xl mb-2">{sim.icon}</div>
                    <div className="font-bold text-gray-700 mb-1">{sim.label}</div>
                    <div className="text-xs text-gray-400 mb-3">{sim.sales} ventes × {(sim.avg / 1000).toFixed(0)}k FCFA</div>
                    <div className="text-2xl font-black text-orange-500">
                      {((sim.sales * sim.avg * 10) / 100).toLocaleString("fr-FR")}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">FCFA / mois (base 10%)</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-xl font-black text-gray-900 mb-4">❓ Questions fréquentes</h3>
              <div className="space-y-4">
                {[
                  { q: "Comment suis-je suivi comme affilié ?", a: "Chaque affilié reçoit un lien unique avec son code. Toute commande passée via ce lien est automatiquement attribuée à votre compte." },
                  { q: "Comment fonctionne la commission par produit ?", a: "Chaque produit a sa propre référence (ex: SB-BOU-001) et son propre taux. Quand un client achète plusieurs produits, vous recevez la commission spécifique à chaque article acheté." },
                  { q: "Quand sont versées les commissions ?", a: "Les commissions sont validées après confirmation de la livraison. Le paiement est effectué sous 24-48h après votre demande de retrait." },
                  { q: "Quel est le montant minimum de retrait ?", a: "Le minimum est de 1 000 FCFA. Vous pouvez retirer via Wave, Orange Money ou Free Money." },
                  { q: "Y a-t-il des limites de gains ?", a: "Aucune limite ! Concentrez-vous sur les produits avec les meilleures commissions. Certains affiliés gagnent plus de 100 000 FCFA par mois." },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-bold text-gray-800 mb-1">Q: {faq.q}</p>
                    <p className="text-gray-500 text-sm">R: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setTab("register")}
                className="bg-orange-500 text-white font-black px-10 py-4 rounded-full text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Rejoindre le programme → 
              </button>
            </div>
          </div>
        )}

        {/* ── CATALOG ─────────────────────────────────────────── */}
        {tab === "catalog" && (
          <div className="space-y-6">
            {/* Bannière résumé */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black mb-1">🏷️ Catalogue des commissions</h2>
                <p className="text-orange-100 text-sm">
                  Chaque produit a sa référence unique et son taux de commission.
                  Partagez les produits les plus rentables !
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-4 text-center">
                <p className="text-orange-200 text-xs mb-1">Commission potentielle totale</p>
                <p className="text-3xl font-black">{totalPotentialCommission.toLocaleString("fr-FR")}</p>
                <p className="text-orange-200 text-xs">FCFA si tout est vendu</p>
              </div>
            </div>

            {/* Filtre catégorie */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                    catalogCategory === cat
                      ? "bg-orange-500 text-white shadow"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400"
                  }`}
                >
                  {cat === "all" ? "Tous les produits" : cat}
                </button>
              ))}
            </div>

            {/* Grille produits */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const comm = calcProductCommission(p, 10);
                const rate = calcProductCommissionRate(p, 10);
                const isFixed = !!(p.commissionFixed && p.commissionFixed > 0);
                return (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all group">
                    {/* Image */}
                    <div className="relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badge référence */}
                      <div className="absolute top-2 left-2 bg-gray-900/80 backdrop-blur text-white text-xs font-mono font-bold px-2 py-1 rounded-lg">
                        {p.affiliateRef ?? `ID-${p.id}`}
                      </div>
                      {/* Badge type commission */}
                      <div className={`absolute top-2 right-2 text-xs font-black px-2 py-1 rounded-lg ${
                        isFixed ? "bg-purple-500 text-white" : "bg-orange-500 text-white"
                      }`}>
                        {isFixed ? "💰 Fixe" : `📊 ${rate}%`}
                      </div>
                    </div>

                    {/* Info produit */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</p>
                          <p className="text-xs text-gray-500 capitalize mt-0.5">{p.category}</p>
                        </div>
                      </div>

                      {/* Prix produit */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-800 font-bold text-sm">
                          {p.price.toLocaleString("fr-FR")} FCFA
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          p.stock === 0 ? "bg-red-100 text-red-600" :
                          p.stock <= 3 ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {p.stock === 0 ? "Épuisé" : p.stock <= 3 ? `${p.stock} restants` : "En stock"}
                        </span>
                      </div>

                      {/* Commission highlight */}
                      <div className={`rounded-xl p-3 flex items-center justify-between ${
                        isFixed ? "bg-purple-50 border border-purple-200" : "bg-orange-50 border border-orange-200"
                      }`}>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Commission affilié</p>
                          <p className={`text-xl font-black ${isFixed ? "text-purple-600" : "text-orange-500"}`}>
                            +{comm.toLocaleString("fr-FR")} F
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Taux</p>
                          <p className={`font-black text-lg ${isFixed ? "text-purple-600" : "text-orange-500"}`}>
                            {rate}%
                          </p>
                        </div>
                      </div>

                      {/* Tailles */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.sizes.slice(0, 5).map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                            {s}
                          </span>
                        ))}
                        {p.sizes.length > 5 && (
                          <span className="text-xs text-gray-400">+{p.sizes.length - 5}</span>
                        )}
                      </div>

                      {/* Bouton partage WA */}
                      {affiliate && affiliate.status === "active" && (
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `🛍️ *${p.name}* - Sama Butik HLM5\n\n💰 Prix : ${p.price.toLocaleString("fr-FR")} FCFA\n\nDécouvrez ce produit ici : ${window.location.origin}/produit/${p.id}?ref=${affiliate.code}\n\n✨ L'élégance africaine au quotidien`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                        >
                          💬 Partager ce produit (+{comm.toLocaleString("fr-FR")} F)
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-black text-gray-900 mb-3">📖 Légende</h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="bg-orange-500 text-white text-xs font-black px-2 py-1 rounded-lg whitespace-nowrap">📊 %</span>
                  <div>
                    <p className="font-bold text-gray-800">Commission en pourcentage</p>
                    <p className="text-gray-500 text-xs">Le montant varie selon le prix de vente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white text-xs font-black px-2 py-1 rounded-lg whitespace-nowrap">💰 Fixe</span>
                  <div>
                    <p className="font-bold text-gray-800">Commission fixe en FCFA</p>
                    <p className="text-gray-500 text-xs">Montant garanti quelle que soit la situation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs bg-gray-900 text-white px-2 py-1 rounded-lg whitespace-nowrap">SB-BOU-001</span>
                  <div>
                    <p className="font-bold text-gray-800">Référence produit</p>
                    <p className="text-gray-500 text-xs">Identifiant unique qui apparaît dans vos commissions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                  <span className="text-xl">💡</span>
                  <p className="text-orange-700 text-xs font-semibold">
                    Connectez-vous à "Mon espace" pour avoir les boutons de partage par produit avec votre code affilié intégré !
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setTab("register")}
                className="bg-orange-500 text-white font-black px-10 py-4 rounded-full text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                S'inscrire pour commencer →
              </button>
            </div>
          </div>
        )}

        {/* ── REGISTER ─────────────────────────────────────────── */}
        {tab === "register" && (
          <div className="max-w-lg mx-auto space-y-6">
            {!registered ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Créer mon compte affilié</h2>
                <p className="text-gray-500 text-sm mb-6">Inscription gratuite – Validé sous 24h par notre équipe</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Prénom & Nom <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex : Moussa Diallo"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Téléphone (WhatsApp) <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+221 7X XXX XX XX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  {formError && (
                    <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{formError}</p>
                  )}
                  <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-600">
                    ✅ En vous inscrivant, vous acceptez les conditions du programme d'affiliation Sama Butik.
                    Les commissions sont définies <strong>par produit</strong> (de 5% à 15%).
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white font-black py-4 rounded-xl hover:bg-orange-600 transition-colors text-lg shadow"
                  >
                    🚀 Créer mon compte gratuit
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-200 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Inscription réussie !</h2>
                <p className="text-gray-500 mb-6">
                  Votre demande est en cours de validation. Votre code affilié est :
                </p>
                <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 mb-6">
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-wider mb-2">Votre code unique</p>
                  <p className="text-4xl font-black text-orange-600 tracking-widest">{registered.code}</p>
                  <p className="text-xs text-gray-400 mt-2">Conservez ce code précieusement</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700 mb-6">
                  ⏳ Votre compte sera activé sous <strong>24h</strong>. Vous recevrez une confirmation sur WhatsApp.
                </div>
                <button
                  onClick={() => {
                    setAffiliate(registered);
                    setTab("dashboard");
                  }}
                  className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Voir mon tableau de bord
                </button>
              </div>
            )}

            {/* Se connecter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="font-black text-gray-900 mb-1">Déjà inscrit ?</h3>
              <p className="text-gray-500 text-sm mb-4">Accédez à votre espace avec votre code affilié</p>
              <form onSubmit={handleLogin} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Votre code (ex: MOUS1234)"
                  value={loginCode}
                  onChange={(e) => setLoginCode(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase"
                />
                <button
                  type="submit"
                  className="bg-gray-900 text-white font-bold px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
                >
                  Accéder →
                </button>
              </form>
              {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
            </div>
          </div>
        )}

        {/* ── DASHBOARD ─────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            {!affiliate ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100 max-w-md mx-auto">
                <h2 className="text-xl font-black text-gray-900 mb-4 text-center">Accéder à mon espace</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Votre code affilié (ex: MOUS1234)"
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase"
                  />
                  {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Accéder à mon tableau de bord
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setTab("register")}
                    className="text-orange-500 text-sm font-semibold hover:underline"
                  >
                    Pas encore inscrit ? S'inscrire →
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Status banner */}
                {affiliate.status === "pending" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <p className="font-bold text-amber-800">Compte en attente de validation</p>
                      <p className="text-amber-600 text-sm">Notre équipe validera votre compte sous 24h. Pour accélérer : <a href="https://wa.me/221751059213" target="_blank" rel="noopener noreferrer" className="underline">contactez-nous sur WhatsApp</a></p>
                    </div>
                  </div>
                )}
                {affiliate.status === "suspended" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <p className="font-bold text-red-800">Compte suspendu</p>
                      <p className="text-red-600 text-sm">Contactez notre équipe pour plus d'informations.</p>
                    </div>
                  </div>
                )}

                {/* Welcome */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-orange-200 text-sm">Bienvenue,</p>
                    <h2 className="text-2xl font-black">{affiliate.name}</h2>
                    <p className="text-orange-200 text-sm mt-1">Code : <strong className="text-white text-lg tracking-wider">{affiliate.code}</strong></p>
                    <p className="text-orange-100 text-xs mt-1">Taux global par défaut : {COMMISSION_RATE}% · Commission définie par produit</p>
                  </div>
                  <div className="text-center bg-white/20 rounded-xl p-4">
                    <p className="text-orange-200 text-xs">Solde disponible</p>
                    <p className="text-3xl font-black">{affiliate.balance.toLocaleString("fr-FR")}</p>
                    <p className="text-orange-200 text-xs">FCFA</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Ventes totales", value: `${myReferrals.length}`, icon: "🛍️" },
                    { label: "CA généré", value: `${myReferrals.reduce((s, r) => s + r.orderTotal, 0).toLocaleString("fr-FR")} F`, icon: "📈" },
                    { label: "Gains totaux", value: `${affiliate.totalEarnings.toLocaleString("fr-FR")} F`, icon: "💰" },
                    { label: "Solde dispo.", value: `${affiliate.balance.toLocaleString("fr-FR")} F`, icon: "💳" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50 text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-lg font-black text-gray-900 leading-tight">{stat.value}</div>
                      <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Lien d'affiliation */}
                {affiliate.status === "active" && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                    <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                      🔗 Mon lien de parrainage (toute la boutique)
                    </h3>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        readOnly
                        value={affiliateLink}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-mono"
                      />
                      <button
                        onClick={copyLink}
                        className="bg-orange-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors whitespace-nowrap"
                      >
                        📋 Copier
                      </button>
                    </div>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={shareWhatsApp}
                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>💬</span> Partager WhatsApp
                      </button>
                      <button
                        onClick={() => {
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`, "_blank");
                        }}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>👤</span> Facebook
                      </button>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-orange-700 mb-2">💡 Conseils pour maximiser vos gains :</p>
                      <ul className="text-xs text-orange-600 space-y-1">
                        <li>• Partagez les produits avec les meilleures commissions en priorité</li>
                        <li>• Utilisez les boutons "Partager ce produit" dans l'onglet "Commissions produits"</li>
                        <li>• Profitez des fêtes (Korité, Tabaski) pour booster vos partages</li>
                        <li>• Mentionnez la référence produit pour rassurer vos clients</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Partage par produit */}
                {affiliate.status === "active" && (
                  <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                      <div>
                        <h3 className="font-black text-gray-900">🏷️ Partager par produit</h3>
                        <p className="text-gray-400 text-sm">Lien unique par produit avec votre code intégré</p>
                      </div>
                      <button
                        onClick={() => setTab("catalog")}
                        className="text-orange-500 text-sm font-bold hover:underline"
                      >
                        Voir tout →
                      </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {products.slice(0, 5).map((p) => {
                        const comm = calcProductCommission(p, COMMISSION_RATE);
                        const rate = calcProductCommissionRate(p, COMMISSION_RATE);
                        const isFixed = !!(p.commissionFixed && p.commissionFixed > 0);
                        const productLink = `${baseUrl}#/produit/${p.id}?ref=${affiliate.code}`;
                        return (
                          <div key={p.id} className="px-5 py-4 flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-xs text-orange-500">{p.affiliateRef ?? `ID-${p.id}`}</span>
                                <span className={`text-xs font-black px-1.5 py-0.5 rounded ${isFixed ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-600"}`}>
                                  {rate}%
                                </span>
                                <span className="text-xs font-black text-orange-500">+{comm.toLocaleString("fr-FR")} F</span>
                              </div>
                            </div>
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `🛍️ *${p.name}*\n\n💰 ${p.price.toLocaleString("fr-FR")} FCFA\n📦 Réf: ${p.affiliateRef ?? p.id}\n\nCommandez ici : ${productLink}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors whitespace-nowrap"
                            >
                              💬 Partager
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Retrait */}
                {affiliate.status === "active" && affiliate.balance >= 1000 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-gray-900">💳 Retrait de fonds</h3>
                        <p className="text-gray-500 text-sm">Solde disponible : <strong className="text-green-600">{affiliate.balance.toLocaleString("fr-FR")} FCFA</strong></p>
                      </div>
                      {!showWithdraw && (
                        <button
                          onClick={() => setShowWithdraw(true)}
                          className="bg-green-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                        >
                          Retirer →
                        </button>
                      )}
                    </div>
                    {withdrawMsg && (
                      <p className="text-green-600 text-sm bg-green-50 rounded-lg p-3 mb-4">{withdrawMsg}</p>
                    )}
                    {showWithdraw && (
                      <form onSubmit={handleWithdraw} className="space-y-4 border-t border-gray-100 pt-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Montant (FCFA)</label>
                            <input
                              type="number"
                              placeholder="Min. 1 000"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Méthode</label>
                            <select
                              value={withdrawMethod}
                              onChange={(e) => setWithdrawMethod(e.target.value as "wave" | "orange_money" | "free_money")}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            >
                              <option value="wave">💙 Wave</option>
                              <option value="orange_money">🟠 Orange Money</option>
                              <option value="free_money">🟢 Free Money</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Numéro de réception</label>
                          <input
                            type="tel"
                            placeholder="+221 7X XXX XX XX"
                            value={withdrawPhone}
                            onChange={(e) => setWithdrawPhone(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors">
                            Confirmer le retrait
                          </button>
                          <button type="button" onClick={() => setShowWithdraw(false)} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50">
                            Annuler
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Historique des ventes avec détail produit */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-black text-gray-900">📋 Historique des ventes</h3>
                    <p className="text-gray-400 text-sm">{myReferrals.length} vente(s) via votre lien · Commissions par produit</p>
                  </div>
                  {myReferrals.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="text-5xl mb-4">📊</div>
                      <p className="text-gray-500 font-semibold">Aucune vente encore</p>
                      <p className="text-gray-400 text-sm mt-1">Partagez votre lien pour commencer à gagner !</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {myReferrals.map((ref) => {
                        const isExpanded = expandedReferral === ref.id;
                        return (
                          <div key={ref.id} className="p-4">
                            {/* Ligne principale */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-xs text-gray-400">
                                    {new Date(ref.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                                  </span>
                                  <span className="font-mono text-xs text-gray-400">{ref.orderId}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    ref.status === "paid" ? "bg-green-100 text-green-700" :
                                    ref.status === "validated" ? "bg-blue-100 text-blue-700" :
                                    "bg-amber-100 text-amber-700"
                                  }`}>
                                    {ref.status === "paid" ? "✅ Payé" : ref.status === "validated" ? "✔ Validé" : "⏳ En attente"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-gray-500">Vente: <strong>{ref.orderTotal.toLocaleString("fr-FR")} F</strong></span>
                                  <span className="font-black text-orange-500">+{ref.commissionAmount.toLocaleString("fr-FR")} F</span>
                                </div>
                                {/* Tags produits */}
                                {ref.productLines && ref.productLines.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {ref.productLines.map((line, i) => (
                                      <span key={i} className="text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-mono">
                                        {line.affiliateRef}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {ref.productLines && ref.productLines.length > 0 && (
                                <button
                                  onClick={() => setExpandedReferral(isExpanded ? null : ref.id)}
                                  className="text-xs bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600 px-2 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap"
                                >
                                  {isExpanded ? "▲" : "▼ Détail"}
                                </button>
                              )}
                            </div>

                            {/* Détail produits */}
                            {isExpanded && ref.productLines && (
                              <div className="mt-3 bg-orange-50 rounded-xl p-3 space-y-2">
                                <p className="text-xs font-black text-gray-500 uppercase">Détail par produit</p>
                                {ref.productLines.map((line, i) => (
                                  <div key={i} className="bg-white rounded-lg p-2.5 flex items-center gap-3 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <p className="text-xs font-bold text-gray-900 line-clamp-1">{line.productName}</p>
                                        <span className="font-mono text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">{line.affiliateRef}</span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        {line.quantity} × {line.unitPrice.toLocaleString("fr-FR")} F
                                        <span className={`ml-2 px-1 py-0.5 rounded font-bold ${line.isFixedRate ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>
                                          {line.commissionRate}%{line.isFixedRate ? " fixe" : ""}
                                        </span>
                                      </p>
                                    </div>
                                    <span className="font-black text-orange-500 text-sm whitespace-nowrap">
                                      +{line.commissionAmount.toLocaleString("fr-FR")} F
                                    </span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                                  <span className="text-xs font-bold text-gray-600">Total commission</span>
                                  <span className="font-black text-orange-500">+{ref.commissionAmount.toLocaleString("fr-FR")} FCFA</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Historique retraits */}
                {myWithdrawals.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-black text-gray-900">💳 Historique des retraits</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {myWithdrawals.map((w) => (
                        <div key={w.id} className="px-5 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-800">{w.amount.toLocaleString("fr-FR")} FCFA</p>
                            <p className="text-xs text-gray-400">
                              {w.method === "wave" ? "💙 Wave" : w.method === "orange_money" ? "🟠 Orange Money" : "🟢 Free Money"} · {w.phoneNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              w.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {w.status === "paid" ? "✅ Versé" : "⏳ En cours"}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(w.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => { setAffiliate(null); setLoginCode(""); }}
                    className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

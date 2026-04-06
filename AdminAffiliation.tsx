import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { Affiliate, AffiliateReferral } from "../types";

type AdminTab = "overview" | "affiliates" | "referrals" | "withdrawals";

export default function AdminAffiliation() {
  const {
    affiliates,
    referrals,
    withdrawals,
    products,
    updateAffiliateStatus,
    updateAffiliateCommissionRate,
    validateReferral,
    markReferralPaid,
    approveWithdrawal,
    getReferralsByAffiliate,
    affiliateStats,
  } = useStore();

  const { username, logout, sessionExpiry } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sessionTimeLeft = sessionExpiry
    ? Math.max(0, Math.floor((sessionExpiry - Date.now()) / 1000 / 60))
    : 0;

  const [tab, setTab] = useState<AdminTab>("overview");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [editRate, setEditRate] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedReferral, setExpandedReferral] = useState<string | null>(null);

  const filteredAffiliates = affiliates.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.phone.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const pendingReferrals = referrals.filter((r) => r.status === "pending");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");
  const pendingAffiliates = affiliates.filter((a) => a.status === "pending");

  // Trouver le produit associé à une ref affilié
  const getProductByRef = (ref: string) => products.find((p) => p.affiliateRef === ref);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-lg">🤝</div>
              <div>
                <h1 className="text-2xl font-black">Gestion Affiliation</h1>
                <p className="text-gray-400 text-sm">Commissions par produit · Sama Butik HLM5</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                  {username?.charAt(0) ?? "A"}
                </div>
                <div>
                  <p className="text-white text-xs font-bold leading-tight">{username}</p>
                  <p className="text-gray-400 text-[10px]">Session : {sessionTimeLeft}min</p>
                </div>
              </div>
              <Link to="/admin" className="text-orange-400 hover:text-orange-300 text-sm font-bold transition-colors">
                ← Produits
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                🚪 <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
          {/* Alertes */}
          <div className="flex flex-wrap gap-3 mt-4">
            {pendingAffiliates.length > 0 && (
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-2 text-sm">
                ⏳ <strong>{pendingAffiliates.length}</strong> inscription(s) en attente
              </div>
            )}
            {pendingReferrals.length > 0 && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 text-sm">
                📋 <strong>{pendingReferrals.length}</strong> commission(s) à valider
              </div>
            )}
            {pendingWithdrawals.length > 0 && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 text-sm">
                💳 <strong>{pendingWithdrawals.length}</strong> retrait(s) à traiter
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-200 mb-8 overflow-x-auto">
          {[
            { key: "overview", label: "📊 Vue d'ensemble" },
            { key: "affiliates", label: `👥 Affiliés (${affiliates.length})` },
            { key: "referrals", label: `📋 Commissions (${pendingReferrals.length} en attente)` },
            { key: "withdrawals", label: `💳 Retraits (${pendingWithdrawals.length} en attente)` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as AdminTab)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-500 hover:text-orange-500"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ─────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Affiliés", value: affiliateStats.totalAffiliates, icon: "👥", sub: `${affiliateStats.activeAffiliates} actifs`, color: "orange" },
                { label: "CA via Affiliation", value: `${affiliateStats.totalSalesViaAffiliation.toLocaleString("fr-FR")} FCFA`, icon: "📈", sub: "Ventes générées", color: "blue" },
                { label: "Commissions payées", value: `${affiliateStats.totalCommissionsPaid.toLocaleString("fr-FR")} FCFA`, icon: "✅", sub: "Versées aux affiliés", color: "green" },
                { label: "Commissions en attente", value: `${affiliateStats.totalCommissionsPending.toLocaleString("fr-FR")} FCFA`, icon: "⏳", sub: "À valider / verser", color: "amber" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-black text-gray-900 leading-tight">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-600 mt-1">{stat.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Catalogue produits + commissions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-gray-900">📦 Commissions par produit</h3>
                  <p className="text-gray-400 text-sm">Vue d'ensemble des taux de commission définis par produit</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Produit</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Réf. Affilié</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Prix</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => {
                      const isFixed = !!(p.commissionFixed && p.commissionFixed > 0);
                      const commAmt = isFixed ? p.commissionFixed! : Math.round(p.price * ((p.commissionRate ?? 10) / 100));
                      const commRate = isFixed
                        ? Math.round((p.commissionFixed! / p.price) * 1000) / 10
                        : (p.commissionRate ?? 10);
                      return (
                        <tr key={p.id} className="hover:bg-orange-50/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                              <div>
                                <p className="font-semibold text-gray-900 text-xs leading-tight line-clamp-1">{p.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-lg font-bold">
                              {p.affiliateRef ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-800 text-xs">
                            {p.price.toLocaleString("fr-FR")} F
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              isFixed ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                            }`}>
                              {isFixed ? "💰 Fixe" : "📊 %"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="font-black text-orange-500 text-sm">
                                {commAmt.toLocaleString("fr-FR")} F
                              </span>
                              <span className="text-xs text-gray-400">({commRate}%)</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top affiliés */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-black text-gray-900">🏆 Top Affiliés</h3>
              </div>
              {affiliates.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <div className="text-4xl mb-3">👥</div>
                  <p>Aucun affilié pour le moment</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {[...affiliates]
                    .sort((a, b) => b.totalEarnings - a.totalEarnings)
                    .slice(0, 5)
                    .map((aff, i) => (
                      <div key={aff.id} className="px-5 py-4 flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          i === 0 ? "bg-yellow-100 text-yellow-600" :
                          i === 1 ? "bg-gray-100 text-gray-600" :
                          i === 2 ? "bg-orange-100 text-orange-600" : "bg-gray-50 text-gray-400"
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{aff.name}</p>
                          <p className="text-xs text-gray-400">{aff.code} · {aff.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-orange-500">{aff.totalEarnings.toLocaleString("fr-FR")} FCFA</p>
                          <p className="text-xs text-gray-400">{getReferralsByAffiliate(aff.id).length} ventes · tx. global {aff.commissionRate}%</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          aff.status === "active" ? "bg-green-100 text-green-700" :
                          aff.status === "pending" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {aff.status === "active" ? "Actif" : aff.status === "pending" ? "En attente" : "Suspendu"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Actions rapides */}
            {pendingAffiliates.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-black text-amber-800 mb-3">⏳ Inscriptions en attente de validation</h3>
                <div className="space-y-3">
                  {pendingAffiliates.map((aff) => (
                    <div key={aff.id} className="bg-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between shadow-sm">
                      <div>
                        <p className="font-bold text-gray-900">{aff.name}</p>
                        <p className="text-sm text-gray-500">{aff.phone} · Code: <strong>{aff.code}</strong></p>
                        <p className="text-xs text-gray-400">{new Date(aff.joinDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateAffiliateStatus(aff.id, "active")}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors"
                        >
                          ✅ Activer
                        </button>
                        <button
                          onClick={() => updateAffiliateStatus(aff.id, "suspended")}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
                        >
                          ❌ Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AFFILIATES ────────────────────────────────────────── */}
        {tab === "affiliates" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Rechercher par nom, code, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">✅ Actifs</option>
                <option value="pending">⏳ En attente</option>
                <option value="suspended">🚫 Suspendus</option>
              </select>
            </div>

            {filteredAffiliates.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">👥</div>
                <p className="text-gray-500 font-semibold">Aucun affilié trouvé</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAffiliates.map((aff) => {
                  const affReferrals = getReferralsByAffiliate(aff.id);
                  const isEditing = selectedAffiliate?.id === aff.id;
                  return (
                    <div key={aff.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600 text-lg flex-shrink-0">
                          {aff.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-gray-900 text-lg">{aff.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              aff.status === "active" ? "bg-green-100 text-green-700" :
                              aff.status === "pending" ? "bg-amber-100 text-amber-700" :
                              "bg-red-100 text-red-700"
                            }`}>
                              {aff.status === "active" ? "✅ Actif" : aff.status === "pending" ? "⏳ En attente" : "🚫 Suspendu"}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                            <span>Code: <strong className="text-orange-500 font-mono">{aff.code}</strong></span>
                            <span>📞 {aff.phone}</span>
                            {aff.email && <span>✉️ {aff.email}</span>}
                            <span>📅 {new Date(aff.joinDate).toLocaleDateString("fr-FR")}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                            <span className="text-gray-500">{affReferrals.length} ventes · CA: <strong>{aff.totalSales.toLocaleString("fr-FR")} FCFA</strong></span>
                            <span className="text-orange-500 font-bold">Gains: {aff.totalEarnings.toLocaleString("fr-FR")} FCFA</span>
                            <span className="text-green-600 font-bold">Solde: {aff.balance.toLocaleString("fr-FR")} FCFA</span>
                            <span className="text-gray-500">Taux global: <strong>{aff.commissionRate}%</strong></span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {aff.status !== "active" && (
                            <button
                              onClick={() => updateAffiliateStatus(aff.id, "active")}
                              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                            >
                              ✅ Activer
                            </button>
                          )}
                          {aff.status !== "suspended" && (
                            <button
                              onClick={() => updateAffiliateStatus(aff.id, "suspended")}
                              className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                            >
                              🚫 Suspendre
                            </button>
                          )}
                          {aff.status !== "pending" && (
                            <button
                              onClick={() => updateAffiliateStatus(aff.id, "pending")}
                              className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
                            >
                              ⏳ En attente
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedAffiliate(isEditing ? null : aff);
                              setEditRate(aff.commissionRate);
                            }}
                            className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-200 transition-colors"
                          >
                            ✏️ Taux global
                          </button>
                        </div>
                      </div>

                      {/* Édition taux global */}
                      {isEditing && (
                        <div className="px-5 pb-5 border-t border-gray-50">
                          <div className="bg-orange-50 rounded-xl p-4 mt-3">
                            <p className="text-xs text-gray-500 mb-3">
                              💡 Ce taux s'applique uniquement aux produits qui n'ont pas de commission spécifique définie.
                            </p>
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-bold text-gray-700 whitespace-nowrap">Taux global par défaut :</label>
                              <input
                                type="number"
                                min="1"
                                max="50"
                                value={editRate ?? aff.commissionRate}
                                onChange={(e) => setEditRate(parseInt(e.target.value))}
                                className="w-20 border border-orange-300 rounded-lg px-3 py-2 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                              />
                              <span className="text-gray-600 font-bold">%</span>
                              <button
                                onClick={() => {
                                  if (editRate !== null) {
                                    updateAffiliateCommissionRate(aff.id, editRate);
                                    setSelectedAffiliate(null);
                                  }
                                }}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
                              >
                                Enregistrer
                              </button>
                              <button
                                onClick={() => setSelectedAffiliate(null)}
                                className="text-gray-400 text-sm hover:text-gray-600"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Historique ventes de cet affilié */}
                      {affReferrals.length > 0 && (
                        <div className="border-t border-gray-50 px-5 py-3">
                          <p className="text-xs text-gray-400 font-semibold mb-2">DERNIÈRES VENTES</p>
                          <div className="space-y-1">
                            {affReferrals.slice(0, 3).map((ref) => (
                              <div key={ref.id} className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">{new Date(ref.date).toLocaleDateString("fr-FR")}</span>
                                <span className="text-gray-700 font-mono">{ref.orderId}</span>
                                <span className="text-gray-600">{ref.orderTotal.toLocaleString("fr-FR")} F</span>
                                <span className="font-bold text-orange-500">+{ref.commissionAmount.toLocaleString("fr-FR")} F</span>
                                <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                                  ref.status === "paid" ? "bg-green-100 text-green-700" :
                                  ref.status === "validated" ? "bg-blue-100 text-blue-700" :
                                  "bg-amber-100 text-amber-700"
                                }`}>
                                  {ref.status === "paid" ? "Payé" : ref.status === "validated" ? "Validé" : "En attente"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── REFERRALS / COMMISSIONS ───────────────────────────── */}
        {tab === "referrals" && (
          <div className="space-y-4">
            {referrals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500 font-semibold">Aucune commission générée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((ref: AffiliateReferral) => {
                  const aff = affiliates.find((a) => a.id === ref.affiliateId);
                  const isExpanded = expandedReferral === ref.id;
                  return (
                    <div key={ref.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* Ligne principale */}
                      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-black text-gray-900">{aff?.name ?? "?"}</span>
                            <span className="font-mono text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">{ref.affiliateCode}</span>
                            <span className="text-xs text-gray-400">{new Date(ref.date).toLocaleDateString("fr-FR")}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-gray-500">Commande: <strong className="font-mono text-xs">{ref.orderId}</strong></span>
                            <span className="text-gray-700">Vente: <strong>{ref.orderTotal.toLocaleString("fr-FR")} F</strong></span>
                            <span className="text-orange-500 font-black">Commission: +{ref.commissionAmount.toLocaleString("fr-FR")} F</span>
                          </div>
                          {/* Résumé produits */}
                          {ref.productLines && ref.productLines.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {ref.productLines.map((line, i) => (
                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                                  {line.affiliateRef}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            ref.status === "paid" ? "bg-green-100 text-green-700" :
                            ref.status === "validated" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {ref.status === "paid" ? "✅ Payé" : ref.status === "validated" ? "✔ Validé" : "⏳ En attente"}
                          </span>
                          {/* Détail produits */}
                          {ref.productLines && ref.productLines.length > 0 && (
                            <button
                              onClick={() => setExpandedReferral(isExpanded ? null : ref.id)}
                              className="text-xs bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 px-2 py-1.5 rounded-lg font-bold transition-colors"
                            >
                              {isExpanded ? "▲ Réduire" : "▼ Détail"}
                            </button>
                          )}
                          {ref.status === "pending" && (
                            <button
                              onClick={() => validateReferral(ref.id)}
                              className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
                            >
                              Valider
                            </button>
                          )}
                          {ref.status === "validated" && (
                            <button
                              onClick={() => markReferralPaid(ref.id)}
                              className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                            >
                              Marquer payé
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Détail par produit (expandable) */}
                      {isExpanded && ref.productLines && ref.productLines.length > 0 && (
                        <div className="border-t border-orange-100 bg-orange-50/50 p-4">
                          <p className="text-xs font-black text-gray-500 uppercase mb-3">Détail des commissions par produit</p>
                          <div className="space-y-2">
                            {ref.productLines.map((line, i) => {
                              const productImg = getProductByRef(line.affiliateRef);
                              return (
                                <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-orange-100">
                                  {productImg && (
                                    <img src={productImg.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-gray-900 text-sm line-clamp-1">{line.productName}</span>
                                      <span className="font-mono text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">
                                        {line.affiliateRef}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                                      <span>{line.quantity} × {line.unitPrice.toLocaleString("fr-FR")} F</span>
                                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                                        line.isFixedRate ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                                      }`}>
                                        {line.isFixedRate ? `${line.commissionRate}% fixe` : `${line.commissionRate}%`}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-black text-orange-500 text-sm">
                                      +{line.commissionAmount.toLocaleString("fr-FR")} F
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {line.quantity > 1 ? `${(line.commissionAmount / line.quantity).toLocaleString("fr-FR")} F/u` : ""}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Total */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-200">
                            <span className="text-sm font-bold text-gray-600">Total commission</span>
                            <span className="font-black text-orange-500 text-lg">
                              +{ref.commissionAmount.toLocaleString("fr-FR")} FCFA
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── WITHDRAWALS ───────────────────────────────────────── */}
        {tab === "withdrawals" && (
          <div className="space-y-4">
            {withdrawals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-4">💳</div>
                <p className="text-gray-500 font-semibold">Aucune demande de retrait</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-black text-gray-900">Demandes de retraits</h3>
                  <p className="text-gray-400 text-sm">{withdrawals.length} demandes · {pendingWithdrawals.length} en attente</p>
                </div>
                <div className="divide-y divide-gray-50">
                  {withdrawals.map((w) => {
                    const aff = affiliates.find((a) => a.id === w.affiliateId);
                    return (
                      <div key={w.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-black text-gray-900 text-lg">{w.amount.toLocaleString("fr-FR")} FCFA</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              w.status === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {w.status === "paid" ? "✅ Versé" : "⏳ En attente"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-semibold">{aff?.name ?? "Affilié inconnu"}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                            <span>
                              {w.method === "wave" ? "💙 Wave" :
                               w.method === "orange_money" ? "🟠 Orange Money" : "🟢 Free Money"}
                            </span>
                            <span>📱 {w.phoneNumber}</span>
                            <span>📅 {new Date(w.date).toLocaleDateString("fr-FR")}</span>
                            <span className="font-mono text-gray-400">{w.id}</span>
                          </div>
                        </div>
                        {w.status === "pending" && (
                          <div className="flex gap-2">
                            <a
                              href={`https://wa.me/${w.phoneNumber.replace(/\s/g, "").replace("+", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                            >
                              💬 Contacter
                            </a>
                            <button
                              onClick={() => approveWithdrawal(w.id)}
                              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
                            >
                              ✅ Marquer versé
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

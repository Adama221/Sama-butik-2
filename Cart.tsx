import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart, getAffiliateByCode } = useStore();
  const navigate = useNavigate();

  const [manualRefCode, setManualRefCode] = useState("");
  const [refMsg, setRefMsg] = useState("");

  const sessionRef = sessionStorage.getItem("sb_ref") ?? "";
  const [activeRef, setActiveRef] = useState(sessionRef);

  const affFromRef = activeRef ? getAffiliateByCode(activeRef) : undefined;
  const refIsValid = !!affFromRef && affFromRef.status === "active";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const applyManualCode = () => {
    const code = manualRefCode.trim().toUpperCase();
    const aff = getAffiliateByCode(code);
    if (!aff) { setRefMsg("❌ Code introuvable."); return; }
    if (aff.status !== "active") { setRefMsg("❌ Ce code d'affiliation n'est pas actif."); return; }
    setActiveRef(code);
    sessionStorage.setItem("sb_ref", code);
    setRefMsg(`✅ Code affilié "${aff.name}" appliqué !`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-8 text-sm">Découvrez nos boubous et vêtements africains</p>
          <Link
            to="/boutique"
            className="bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all hover:scale-105 shadow-lg"
          >
            Découvrir la Boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl sm:text-3xl font-black text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Mon Panier ({cart.length} article{cart.length > 1 ? "s" : ""})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 font-semibold transition-colors"
          >
            Vider le panier
          </button>
        </div>

        {/* Étapes */}
        <div className="flex items-center gap-2 mb-6 text-xs font-semibold">
          <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full shadow">1. Panier</span>
          <span className="text-gray-300">──</span>
          <span className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full">2. Commande</span>
          <span className="text-gray-300">──</span>
          <span className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full">3. Paiement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center"
              >
                <Link to={`/produit/${item.product.id}`}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0 hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/produit/${item.product.id}`}>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight hover:text-orange-500 transition-colors line-clamp-1">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold capitalize">
                      {item.product.category}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                      Taille: {item.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold text-sm hover:bg-orange-100 hover:text-orange-500 transition-colors flex items-center justify-center"
                      >−</button>
                      <span className="font-bold text-gray-900 text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-bold text-sm hover:bg-orange-100 hover:text-orange-500 transition-colors flex items-center justify-center"
                      >+</button>
                    </div>
                    <span className="font-black text-orange-500 text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id, item.size)}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Code affilié */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
              <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                🤝 Code d'affiliation
                <span className="text-xs text-gray-400 font-normal">(optionnel)</span>
              </h3>
              <p className="text-gray-400 text-xs mb-3">
                Si quelqu'un vous a recommandé Sama Butik, entrez son code pour lui créditer une commission.
              </p>
              {refIsValid ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-green-700 font-bold text-sm">✅ Code actif : <span className="font-mono tracking-wider">{activeRef}</span></p>
                    <p className="text-green-600 text-xs">{affFromRef?.name} recevra une commission</p>
                  </div>
                  <button
                    onClick={() => { setActiveRef(""); sessionStorage.removeItem("sb_ref"); setRefMsg(""); }}
                    className="text-red-400 text-xs hover:text-red-600 font-semibold"
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ex: MOUS1234"
                    value={manualRefCode}
                    onChange={(e) => setManualRefCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button
                    onClick={applyManualCode}
                    className="bg-orange-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              )}
              {refMsg && !refIsValid && <p className="text-sm mt-2 text-red-500">{refMsg}</p>}
            </div>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-black text-gray-900 text-lg mb-4">Récapitulatif</h2>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}-sum`} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 flex-1 mr-2">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {refIsValid && (
                <div className="bg-green-50 rounded-xl p-3 mb-4 text-xs text-green-700">
                  🤝 Parrain : <strong>{affFromRef?.name}</strong> ({activeRef})
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-black text-2xl text-orange-500">{formatPrice(cartTotal)}</span>
              </div>

              {/* ── CTA principal : Commander ── */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl transition-all hover:scale-105 text-sm shadow-lg mb-3"
              >
                <span className="text-base">💳</span>
                Commander & Payer
              </button>

              {/* Logos paiement */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-[8px] font-black">W</span>
                  </div>
                  <span className="text-blue-700 text-[10px] font-bold">Wave</span>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-lg px-2 py-1">
                  <div className="w-4 h-4 rounded bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-[7px] font-black">OM</span>
                  </div>
                  <span className="text-orange-700 text-[10px] font-bold">Orange</span>
                </div>
                <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                  <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                    <span className="text-white text-[7px] font-black">FM</span>
                  </div>
                  <span className="text-green-700 text-[10px] font-bold">Free</span>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                  <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-[7px] font-black">WA</span>
                  </div>
                  <span className="text-emerald-700 text-[10px] font-bold">WhatsApp</span>
                </div>
              </div>

              <Link
                to="/boutique"
                className="block text-center text-orange-500 font-semibold text-sm hover:underline"
              >
                ← Continuer mes achats
              </Link>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: "🔒", label: "Sécurisé" },
                  { icon: "🚀", label: "Livraison" },
                  { icon: "↩️", label: "Retours" },
                ].map((b) => (
                  <div key={b.label} className="text-xs text-gray-400">
                    <div className="text-lg">{b.icon}</div>
                    <div>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

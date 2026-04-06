import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { PaymentMethod } from "../types";
import PaymentModal from "../components/PaymentModal";

function generateOrderRef() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `SB-${ts}-${rand}`;
}

const DELIVERY_OPTIONS = [
  { id: "pickup", label: "🏪 Retrait boutique HLM 5", price: 0, delay: "Même jour" },
  { id: "dakar", label: "🛵 Livraison Dakar", price: 1500, delay: "24 – 48h" },
  { id: "banlieue", label: "📦 Banlieue & périphérie", price: 2500, delay: "48 – 72h" },
  { id: "regions", label: "🚌 Régions (DHL / Gora)", price: 4000, delay: "3 – 5 jours" },
];

export default function Checkout() {
  const { cart, cartTotal, clearCart, addOrder, getAffiliateByCode } = useStore();
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────────
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [address, setAddress]     = useState("");
  const [delivery, setDelivery]   = useState("pickup");
  const [note, setNote]           = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});

  // ── Affilié ───────────────────────────────────────────────────────────────
  const sessionRef = sessionStorage.getItem("sb_ref") ?? "";
  const [activeRef]               = useState(sessionRef);
  const affFromRef = activeRef ? getAffiliateByCode(activeRef) : undefined;
  const refIsValid = !!affFromRef && affFromRef.status === "active";

  // ── Paiement ─────────────────────────────────────────────────────────────
  const [showPayment, setShowPayment] = useState(false);
  const [orderRef]                    = useState(generateOrderRef());

  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery)!;
  const deliveryPrice  = deliveryOption.price;
  const grandTotal     = cartTotal + deliveryPrice;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("fr-FR").format(p) + " FCFA";

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Votre nom est requis";
    if (!phone.trim()) e.phone = "Votre numéro est requis";
    else if (!/^(\+221|00221)?[0-9]{9}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Numéro invalide (ex: 77 123 45 67)";
    if (delivery !== "pickup" && !address.trim())
      e.address = "L'adresse de livraison est requise";
    return e;
  };

  const handleProceedToPayment = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setShowPayment(true);
  };

  // ── Confirmation paiement ─────────────────────────────────────────────────
  const handlePaymentConfirmed = (method: PaymentMethod, ref: string) => {
    const order = {
      items: [...cart],
      total: grandTotal,
      customerName: name,
      customerPhone: phone,
      customerAddress: address || "Retrait boutique HLM 5",
      status: "pending" as const,
      affiliateCode: refIsValid ? activeRef : undefined,
      paymentMethod: method,
      paymentRef: ref,
    };
    addOrder(order);
    clearCart();
    sessionStorage.removeItem("sb_ref");
    navigate("/confirmation?ref=" + encodeURIComponent(orderRef) + "&method=" + method);
  };

  // ── WhatsApp direct (sans paiement) ───────────────────────────────────────
  const handleWhatsAppOrder = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const itemsList = cart
      .map((i) => `• ${i.product.name} – Taille: ${i.size} – Qté: ${i.quantity} – ${formatPrice(i.product.price * i.quantity)}`)
      .join("\n");
    const delivLine = `🚚 Livraison : ${deliveryOption.label} (${deliveryPrice > 0 ? formatPrice(deliveryPrice) : "Gratuit"})`;
    const refLine   = refIsValid ? `\n🔗 Code affilié : *${activeRef}*` : "";
    const addrLine  = address ? `\n📍 Adresse : ${address}` : "";
    const noteLine  = note ? `\n📝 Note : ${note}` : "";
    const msg = encodeURIComponent(
      `Bonjour Sama Butik! 👋\n\n` +
      `🧾 *Commande ${orderRef}*\n\n` +
      `👤 Nom : ${name}\n` +
      `📱 Téléphone : ${phone}${addrLine}${noteLine}\n\n` +
      `*Articles commandés :*\n${itemsList}\n\n` +
      `${delivLine}\n` +
      `💰 *Total : ${formatPrice(grandTotal)}*${refLine}\n\n` +
      `Merci de confirmer ma commande 🙏`
    );
    window.open(`https://wa.me/221751059213?text=${msg}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Votre panier est vide</h2>
          <Link to="/boutique" className="bg-orange-500 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all">
            Découvrir la Boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/panier" className="text-gray-400 hover:text-orange-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Finaliser la commande
          </h1>
        </div>

        {/* Étapes */}
        <div className="flex items-center gap-2 mb-8 text-xs font-semibold">
          <span className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full">1. Panier ✓</span>
          <span className="text-gray-300">──</span>
          <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-md">2. Commande</span>
          <span className="text-gray-300">──</span>
          <span className="bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full">3. Paiement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Formulaire ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Infos client */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-gray-900 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-black flex items-center justify-center">1</span>
                Vos informations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prénom & Nom"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Téléphone (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Note (optionnel)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Instructions spéciales, couleur préférée..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-black text-gray-900 text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-black flex items-center justify-center">2</span>
                Livraison
              </h2>
              <div className="space-y-3">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      delivery === opt.id
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={delivery === opt.id}
                      onChange={() => setDelivery(opt.id)}
                      className="accent-orange-500 w-4 h-4 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${delivery === opt.id ? "text-orange-700" : "text-gray-800"}`}>
                        {opt.label}
                      </p>
                      <p className="text-gray-400 text-xs">Délai : {opt.delay}</p>
                    </div>
                    <span className={`font-black text-sm ${delivery === opt.id ? "text-orange-600" : "text-gray-600"}`}>
                      {opt.price === 0 ? "Gratuit" : formatPrice(opt.price)}
                    </span>
                  </label>
                ))}
              </div>

              {delivery !== "pickup" && (
                <div className="mt-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Adresse de livraison *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Quartier, rue, point de repère..."
                    rows={2}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              )}
            </div>

            {/* Code affilié */}
            {refIsValid && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-bold text-green-800 text-sm">Code affilié appliqué</p>
                  <p className="text-green-600 text-xs">{affFromRef?.name} recevra une commission • Code : <span className="font-mono font-bold">{activeRef}</span></p>
                </div>
              </div>
            )}
          </div>

          {/* ── Résumé commande ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-black text-gray-900 text-lg mb-4">Votre commande</h2>

              {/* Articles */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">Taille: {item.size} × {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-orange-500 whitespace-nowrap">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={`font-semibold ${deliveryPrice === 0 ? "text-green-600" : ""}`}>
                    {deliveryPrice === 0 ? "Gratuit" : formatPrice(deliveryPrice)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-b border-gray-100 mb-5">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-2xl text-orange-500">{formatPrice(grandTotal)}</span>
              </div>

              {/* ── Boutons de paiement ── */}
              <div className="space-y-3">
                {/* Paiement mobile */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg text-sm"
                >
                  <span className="text-lg">💳</span>
                  Payer maintenant
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Wave / OM / Free</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-semibold">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition-all hover:scale-[1.02] text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Commander via WhatsApp
                </button>
              </div>

              {/* Logos paiement */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">Moyens de paiement acceptés</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-black">W</span>
                    </div>
                    <span className="text-blue-700 text-xs font-bold">Wave</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">OM</span>
                    </div>
                    <span className="text-orange-700 text-xs font-bold">Orange</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                      <span className="text-white text-[9px] font-black">FM</span>
                    </div>
                    <span className="text-green-700 text-xs font-bold">Free</span>
                  </div>
                </div>
              </div>

              {/* Réf commande */}
              <p className="text-center text-gray-300 text-xs mt-4 font-mono">Réf: {orderRef}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal paiement ── */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={grandTotal}
        orderRef={orderRef}
        customerName={name}
        customerPhone={phone}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </div>
  );
}

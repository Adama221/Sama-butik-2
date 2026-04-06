import { useState, useEffect } from "react";
import { PaymentMethod } from "../types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderRef: string;
  customerName: string;
  customerPhone: string;
  onPaymentConfirmed: (method: PaymentMethod, ref: string) => void;
}

// ─── Numéros de réception des paiements Sama Butik ──────────────────────────
const SAMA_BUTIK_WAVE   = "751059213";   // Wave : 75 105 92 13
const SAMA_BUTIK_OM     = "751059213";   // Orange Money : même numéro
const SAMA_BUTIK_FREE   = "751059213";   // Free Money   : même numéro

// ─── Génère les deep links selon l'opérateur ────────────────────────────────
function buildWaveLink(phone: string, amount: number, ref: string) {
  // Wave Sénégal : deep link officiel wave://send + fallback https
  const msg = encodeURIComponent(`Paiement Sama Butik – Commande ${ref}`);
  return `https://wave.com/out/send?phone=${phone}&amount=${amount}&note=${msg}`;
}

function buildOrangeMoneyLink(phone: string, amount: number, ref: string) {
  // Orange Money Sénégal : deep link app + fallback USSD
  const msg = encodeURIComponent(`Sama Butik ${ref}`);
  return `orangemoney://transfer?to=${phone}&amount=${amount}&label=${msg}`;
}

function buildOrangeMoneyFallback(phone: string, amount: number) {
  // USSD Orange Money Sénégal : *144*1*1*<numero>*<montant>#
  return `tel:*144*1*1*${phone}*${amount}%23`;
}

function buildFreeMoneyLink(phone: string, amount: number, ref: string) {
  // Free Money (Tigo Cash) Sénégal
  const msg = encodeURIComponent(`Sama Butik ${ref}`);
  return `freemoney://transfer?to=${phone}&amount=${amount}&label=${msg}`;
}

function buildFreeMoneyFallback(phone: string, amount: number) {
  // USSD Free Money : *555*<numero>*<montant>#
  return `tel:*555*${phone}*${amount}%23`;
}

function buildWhatsAppPaymentMsg(amount: number, ref: string, method: string, customerName: string) {
  return encodeURIComponent(
    `Bonjour Sama Butik! 👋\n\n` +
    `✅ *Paiement effectué*\n\n` +
    `👤 Nom : ${customerName}\n` +
    `🧾 Commande : ${ref}\n` +
    `💰 Montant : ${new Intl.NumberFormat("fr-FR").format(amount)} FCFA\n` +
    `📱 Via : ${method}\n\n` +
    `Merci de confirmer la réception du paiement et les détails de livraison. 🙏`
  );
}

const PAYMENT_METHODS = [
  {
    id: "wave" as PaymentMethod,
    name: "Wave",
    emoji: "🌊",
    color: "from-blue-500 to-blue-600",
    border: "border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-600",
    description: "Paiement instantané via l'app Wave",
    subtext: "Recommandé • Rapide & sécurisé",
    logo: "W",
    logoColor: "bg-blue-500",
  },
  {
    id: "orange_money" as PaymentMethod,
    name: "Orange Money",
    emoji: "🟠",
    color: "from-orange-500 to-orange-600",
    border: "border-orange-400",
    bg: "bg-orange-50",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-600",
    description: "Transfert via Orange Money",
    subtext: "Disponible 24h/24 • 7j/7",
    logo: "OM",
    logoColor: "bg-orange-500",
  },
  {
    id: "free_money" as PaymentMethod,
    name: "Free Money",
    emoji: "🟢",
    color: "from-green-500 to-green-600",
    border: "border-green-400",
    bg: "bg-green-50",
    text: "text-green-700",
    badge: "bg-green-100 text-green-600",
    description: "Paiement via Free Money (Tigo Cash)",
    subtext: "Simple & rapide",
    logo: "FM",
    logoColor: "bg-green-500",
  },
  {
    id: "whatsapp" as PaymentMethod,
    name: "WhatsApp",
    emoji: "💬",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-600",
    description: "Contacter la boutique directement",
    subtext: "Paiement à la livraison possible",
    logo: "WA",
    logoColor: "bg-emerald-500",
  },
];

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  orderRef,
  customerName,
  onPaymentConfirmed,
}: PaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [step, setStep] = useState<"choose" | "confirm" | "done">("choose");
  const [countdown, setCountdown] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const formatted = new Intl.NumberFormat("fr-FR").format(amount);

  useEffect(() => {
    if (!isOpen) {
      setSelected(null);
      setStep("choose");
      setCountdown(0);
      setConfirmed(false);
    }
  }, [isOpen]);

  // Countdown avant redirection vers l'app
  useEffect(() => {
    if (step === "confirm" && countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, countdown]);

  const handleSelectAndPay = (method: PaymentMethod) => {
    setSelected(method);
    setStep("confirm");
    setCountdown(3);
  };

  const handleLaunchApp = () => {
    if (!selected) return;
    let link = "";

    switch (selected) {
      case "wave":
        link = buildWaveLink(SAMA_BUTIK_WAVE, amount, orderRef);
        window.open(link, "_blank");
        break;
      case "orange_money":
        // Essayer le deep link, fallback USSD
        link = buildOrangeMoneyLink(SAMA_BUTIK_OM, amount, orderRef);
        window.location.href = link;
        // Fallback après 1.5s si l'app ne s'ouvre pas
        setTimeout(() => {
          window.location.href = buildOrangeMoneyFallback(SAMA_BUTIK_OM, amount);
        }, 1500);
        break;
      case "free_money":
        link = buildFreeMoneyLink(SAMA_BUTIK_FREE, amount, orderRef);
        window.location.href = link;
        setTimeout(() => {
          window.location.href = buildFreeMoneyFallback(SAMA_BUTIK_FREE, amount);
        }, 1500);
        break;
      case "whatsapp":
        link = `https://wa.me/221${SAMA_BUTIK_WAVE}?text=${buildWhatsAppPaymentMsg(amount, orderRef, "WhatsApp", customerName)}`;
        window.open(link, "_blank");
        break;
    }

    setStep("done");
  };

  const handleConfirmPayment = () => {
    if (!selected) return;
    setConfirmed(true);
    // Envoyer confirmation WhatsApp
    const method = PAYMENT_METHODS.find((m) => m.id === selected);
    const waLink = `https://wa.me/221${SAMA_BUTIK_WAVE}?text=${buildWhatsAppPaymentMsg(amount, orderRef, method?.name ?? selected, customerName)}`;
    window.open(waLink, "_blank");
    onPaymentConfirmed(selected, orderRef);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <h2 className="text-lg font-black">Paiement sécurisé</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">{formatted}</span>
            <span className="text-orange-200 font-semibold">FCFA</span>
          </div>
          <p className="text-orange-100 text-xs mt-0.5">Réf: {orderRef}</p>
        </div>

        {/* ── ÉTAPE 1 : Choisir le moyen de paiement ── */}
        {step === "choose" && (
          <div className="p-5">
            <p className="text-gray-500 text-sm mb-4 font-medium">
              Choisissez votre moyen de paiement mobile :
            </p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelectAndPay(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.01] active:scale-[0.99] ${method.bg} ${method.border} hover:shadow-md`}
                >
                  {/* Logo */}
                  <div className={`w-12 h-12 rounded-2xl ${method.logoColor} flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0`}>
                    {method.logo}
                  </div>
                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-base ${method.text}`}>
                        {method.emoji} {method.name}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{method.description}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${method.text} opacity-70`}>{method.subtext}</p>
                  </div>
                  {/* Arrow */}
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1">🔒 Sécurisé</span>
              <span className="flex items-center gap-1">⚡ Instantané</span>
              <span className="flex items-center gap-1">✅ Confirmé</span>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : Confirmation avant ouverture de l'app ── */}
        {step === "confirm" && selected && (() => {
          const method = PAYMENT_METHODS.find((m) => m.id === selected)!;
          return (
            <div className="p-5">
              <div className={`rounded-2xl ${method.bg} border ${method.border} p-5 mb-5`}>
                {/* Logo grand */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${method.logoColor} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                    {method.logo}
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${method.text}`}>{method.name}</h3>
                    <p className="text-gray-500 text-xs">{method.description}</p>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="bg-white rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destinataire</span>
                    <span className="font-bold text-gray-900">Sama Butik HLM5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Numéro</span>
                    <span className="font-bold font-mono text-gray-900">+221 75 105 92 13</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Montant</span>
                    <span className={`font-black text-lg ${method.text}`}>{formatted} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Référence</span>
                    <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{orderRef}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-amber-800 text-sm font-semibold mb-2">📋 Instructions :</p>
                {selected === "wave" && (
                  <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                    <li>Cliquez "Ouvrir Wave" ci-dessous</li>
                    <li>Le montant et le numéro seront pré-remplis</li>
                    <li>Confirmez avec votre code secret Wave</li>
                    <li>Revenez ici et cliquez "J'ai payé"</li>
                  </ol>
                )}
                {selected === "orange_money" && (
                  <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                    <li>Cliquez "Ouvrir Orange Money" ci-dessous</li>
                    <li>Ou composez le <strong>*144#</strong> sur votre téléphone</li>
                    <li>Sélectionnez Transfert → entrez <strong>75 105 92 13</strong></li>
                    <li>Entrez le montant : <strong>{formatted} FCFA</strong></li>
                    <li>Confirmez avec votre code PIN</li>
                  </ol>
                )}
                {selected === "free_money" && (
                  <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                    <li>Cliquez "Ouvrir Free Money" ci-dessous</li>
                    <li>Ou composez le <strong>*555#</strong> sur votre téléphone</li>
                    <li>Sélectionnez Transfert → entrez <strong>75 105 92 13</strong></li>
                    <li>Entrez le montant : <strong>{formatted} FCFA</strong></li>
                    <li>Confirmez votre paiement</li>
                  </ol>
                )}
                {selected === "whatsapp" && (
                  <ol className="text-amber-700 text-xs space-y-1 list-decimal list-inside">
                    <li>Cliquez "Ouvrir WhatsApp" ci-dessous</li>
                    <li>Envoyez le message pré-rédigé</li>
                    <li>Discutez du mode de paiement avec la boutique</li>
                    <li>Paiement à la livraison disponible</li>
                  </ol>
                )}
              </div>

              {/* Bouton principal */}
              <button
                onClick={handleLaunchApp}
                className={`w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r ${method.color} shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mb-3`}
              >
                <span className="text-xl">{method.emoji}</span>
                {selected === "wave" && "Ouvrir Wave"}
                {selected === "orange_money" && "Ouvrir Orange Money"}
                {selected === "free_money" && "Ouvrir Free Money"}
                {selected === "whatsapp" && "Ouvrir WhatsApp"}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>

              {/* Bouton "J'ai payé" */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2 mb-3"
              >
                ✅ J'ai effectué le paiement
              </button>

              {/* Retour */}
              <button
                onClick={() => setStep("choose")}
                className="w-full text-center text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                ← Changer de moyen de paiement
              </button>
            </div>
          );
        })()}

        {/* ── ÉTAPE 3 : Paiement envoyé ── */}
        {step === "done" && (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Paiement lancé !</h3>
            <p className="text-gray-500 text-sm mb-6">
              Après avoir confirmé votre paiement dans l'application, cliquez sur le bouton ci-dessous pour nous notifier.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 text-left">
              <p className="text-orange-800 text-sm font-bold mb-1">📞 Numéro à créditer :</p>
              <p className="text-orange-700 font-mono font-black text-xl tracking-widest text-center py-2">
                +221 75 105 92 13
              </p>
              <p className="text-orange-600 text-xs text-center">Sama Butik – Marché HLM 5</p>
            </div>
            <button
              onClick={handleConfirmPayment}
              disabled={confirmed}
              className="w-full py-4 rounded-2xl font-black text-white text-base bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mb-3 disabled:opacity-60"
            >
              {confirmed ? "✅ Confirmation envoyée !" : "✅ J'ai payé – Confirmer"}
            </button>
            <button
              onClick={() => setStep("confirm")}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

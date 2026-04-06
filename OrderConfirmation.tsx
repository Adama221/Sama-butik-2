import { useSearchParams, Link } from "react-router-dom";
import { PaymentMethod } from "../types";

const METHOD_INFO: Record<PaymentMethod, { emoji: string; name: string; color: string; bg: string; border: string }> = {
  wave:         { emoji: "🌊", name: "Wave",         color: "text-blue-700",    bg: "bg-blue-50",    border: "border-blue-200" },
  orange_money: { emoji: "🟠", name: "Orange Money", color: "text-orange-700",  bg: "bg-orange-50",  border: "border-orange-200" },
  free_money:   { emoji: "🟢", name: "Free Money",   color: "text-green-700",   bg: "bg-green-50",   border: "border-green-200" },
  whatsapp:     { emoji: "💬", name: "WhatsApp",      color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
};

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const ref    = params.get("ref")    ?? "SB-XXXXX";
  const method = (params.get("method") ?? "whatsapp") as PaymentMethod;
  const info   = METHOD_INFO[method] ?? METHOD_INFO.whatsapp;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Icône succès */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-2xl mb-4 animate-bounce">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Commande envoyée !
          </h1>
          <p className="text-gray-500 text-sm">
            Merci pour votre confiance. Sama Butik vous contactera très bientôt.
          </p>
        </div>

        {/* Carte confirmation */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
          {/* Header orange */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 text-white text-center">
            <p className="text-orange-100 text-xs font-semibold mb-1">RÉFÉRENCE COMMANDE</p>
            <p className="font-mono font-black text-2xl tracking-widest">{ref}</p>
          </div>

          {/* Corps */}
          <div className="p-6 space-y-4">
            {/* Méthode paiement */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${info.bg} ${info.border}`}>
              <span className="text-3xl">{info.emoji}</span>
              <div>
                <p className={`font-bold text-sm ${info.color}`}>Paiement via {info.name}</p>
                <p className="text-gray-500 text-xs">En cours de vérification par Sama Butik</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {[
                { icon: "✅", label: "Commande reçue",           done: true },
                { icon: "💳", label: "Vérification du paiement", done: false },
                { icon: "📦", label: "Préparation de la commande", done: false },
                { icon: "🚀", label: "Livraison / Retrait",       done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    step.done
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.icon}
                  </div>
                  <p className={`text-sm font-semibold ${step.done ? "text-green-700" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {step.done && (
                    <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">
                      Fait
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Contact boutique */}
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-3">
                Pour toute question, contactez-nous directement :
              </p>
              <a
                href="https://wa.me/221751059213"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-all hover:scale-105 text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                +221 75 105 92 13
              </a>
              <p className="text-gray-400 text-xs mt-2">Sama Butik – Marché HLM 5, Dakar</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 text-center">
          <Link
            to="/boutique"
            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg"
          >
            Continuer mes achats 🛍️
          </Link>
          <Link
            to="/"
            className="block text-gray-400 hover:text-orange-500 text-sm font-semibold transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

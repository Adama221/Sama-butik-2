import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* WhatsApp Banner */}
      <div className="bg-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-semibold text-white text-center sm:text-left">
            📲 Commandez directement via WhatsApp – Livraison rapide à Dakar !
          </p>
          <a
            href="https://wa.me/221751059213"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-500 font-bold px-6 py-2 rounded-full hover:bg-orange-50 transition-colors whitespace-nowrap text-sm shadow"
          >
            💬 WhatsApp +221 75 105 92 13
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <div>
              <p className="font-black text-lg leading-tight">SAMA BUTIK</p>
              <p className="text-[10px] text-orange-400 font-semibold tracking-widest uppercase">
                HLM 5 · Dakar
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            L'élégance africaine au quotidien. Boubous, kaftans et vêtements modernes africains de qualité premium.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-bold text-orange-400 uppercase tracking-wider text-sm mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Accueil" },
              { to: "/boutique", label: "Boutique" },
              { to: "/a-propos", label: "À Propos" },
              { to: "/contact", label: "Contact" },
              { to: "/panier", label: "Mon Panier" },
              { to: "/affiliation", label: "🤝 Programme Affiliation" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-gray-400 hover:text-orange-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Catégories */}
        <div>
          <h3 className="font-bold text-orange-400 uppercase tracking-wider text-sm mb-4">Collections</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              { label: "🆕 Nouveaux Arrivages", value: "nouveaux-arrivages" },
              { label: "👘 Boubou Homme",       value: "boubou-homme" },
              { label: "🎉 Korité & Tabaski",   value: "korite-tabaski" },
              { label: "💍 Tenues Mariage",     value: "mariage" },
              { label: "👡 Babouches",          value: "babouches" },
              { label: "💎 Accessoires",        value: "accessoires" },
            ].map((cat) => (
              <li key={cat.value}>
                <Link
                  to={`/boutique?category=${cat.value}`}
                  className="hover:text-orange-400 transition-colors"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-orange-400 uppercase tracking-wider text-sm mb-4">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-0.5">📍</span>
              <span>Marché HLM 5, Centre Commercial Al Medina, Dakar, Sénégal</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-400">📞</span>
              <a href="tel:+221751059213" className="hover:text-orange-400 transition-colors">
                +221 75 105 92 13
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-400">💬</span>
              <a
                href="https://wa.me/221751059213"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <p className="text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Sama Butik HLM5 – Tous droits réservés · Dakar, Sénégal
        </p>
      </div>
    </footer>
  );
}

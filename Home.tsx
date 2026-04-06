import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products } = useStore();

  const newArrivals   = products.filter((p) => p.category === "nouveaux-arrivages").slice(0, 4);
  const boubouHomme   = products.filter((p) => p.category === "boubou-homme").slice(0, 4);
  const koriteTabaski = products.filter((p) => p.category === "korite-tabaski").slice(0, 4);
  const mariage       = products.filter((p) => p.category === "mariage").slice(0, 3);
  const babouches     = products.filter((p) => p.category === "babouches").slice(0, 4);
  const accessoires   = products.filter((p) => p.category === "accessoires").slice(0, 4);

  const navCategories = [
    { label: "Nouveaux Arrivages", icon: "🆕", value: "nouveaux-arrivages", color: "bg-red-500",    ring: "ring-red-300" },
    { label: "Boubou Homme",       icon: "👘", value: "boubou-homme",       color: "bg-orange-500", ring: "ring-orange-300" },
    { label: "Korité & Tabaski",   icon: "🎉", value: "korite-tabaski",     color: "bg-amber-500",  ring: "ring-amber-300" },
    { label: "Tenues Mariage",     icon: "💍", value: "mariage",            color: "bg-yellow-500", ring: "ring-yellow-300" },
    { label: "Babouches",          icon: "👡", value: "babouches",          color: "bg-orange-400", ring: "ring-orange-200" },
    { label: "Accessoires",        icon: "💎", value: "accessoires",        color: "bg-gray-600",   ring: "ring-gray-300" },
  ];

  return (
    <div className="min-h-screen">

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #f97316 0px, #f97316 2px, transparent 2px, transparent 20px),
              repeating-linear-gradient(-45deg, #f97316 0px, #f97316 2px, transparent 2px, transparent 20px)`,
          }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-400 rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              🎉 Nouvelle Collection Korité & Tabaski disponible !
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              L'Élégance<br />
              <span className="text-orange-400">Africaine</span><br />
              Au Quotidien
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Boubous, tenues de mariage, babouches et accessoires africains de qualité premium.
              Artisanat sénégalais authentique. Situé au{" "}
              <strong className="text-orange-300">Marché HLM 5, Dakar</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/boutique"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg shadow-orange-900/40">
                🛒 Découvrir la Boutique
              </Link>
              <a href="https://wa.me/221751059213?text=Bonjour%20Sama%20Butik!%20Je%20voudrais%20des%20informations%20sur%20vos%20produits."
                target="_blank" rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Commander via WhatsApp
              </a>
            </div>
            <div className="flex gap-6 mt-10 justify-center lg:justify-start">
              {[
                { num: "500+", label: "Clients satisfaits" },
                { num: "100+", label: "Modèles disponibles" },
                { num: "10+",  label: "Ans d'expérience" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-orange-400">{s.num}</p>
                  <p className="text-gray-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-72 h-80 sm:w-80 sm:h-96">
              <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-6 opacity-30" />
              <div className="absolute inset-0 bg-orange-400 rounded-3xl -rotate-3 opacity-20" />
              <img src="https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80"
                alt="Boubou africain élégant"
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-xl">
                <p className="font-black text-orange-500 text-lg">45 000</p>
                <p className="text-xs text-gray-600 font-semibold">FCFA • Boubou Bazin</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ NAVIGATION CATÉGORIES (cercles icons) ════════════════ */}
      <section className="py-10 bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-black text-center text-gray-900 mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Nos Collections
          </h2>
          <p className="text-center text-gray-400 text-xs mb-7">Trouvez votre style africain</p>
          <div className="flex items-start justify-center gap-4 sm:gap-8 flex-wrap">
            {navCategories.map((cat) => (
              <Link key={cat.value} to={`/boutique?category=${cat.value}`}
                className="flex flex-col items-center gap-2 group cursor-pointer w-16 sm:w-20">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${cat.color} ${cat.ring} ring-4 ring-offset-2 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-200`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-tight group-hover:text-orange-500 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ NOUVEAUX ARRIVAGES ════════════════ */}
      {newArrivals.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  🆕 Just arrivé
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Nouveaux Arrivages
                </h2>
                <p className="text-gray-500 text-sm mt-1">Les toutes dernières pièces en stock</p>
              </div>
              <Link to="/boutique?category=nouveaux-arrivages"
                className="hidden sm:flex items-center gap-1 bg-red-500 text-white font-semibold px-4 py-2 rounded-full hover:bg-red-600 transition-colors text-sm">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/boutique?category=nouveaux-arrivages"
                className="inline-flex items-center gap-1 bg-red-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-red-600 transition-colors text-sm">
                Voir tous les nouveaux arrivages →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ BOUBOU HOMME ════════════════ */}
      {boubouHomme.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  👘 Collection Homme
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Boubou Homme
                </h2>
                <p className="text-gray-500 text-sm mt-1">Élégance africaine authentique</p>
              </div>
              <Link to="/boutique?category=boubou-homme"
                className="hidden sm:flex items-center gap-1 text-orange-500 font-semibold hover:underline text-sm">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {boubouHomme.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/boutique?category=boubou-homme"
                className="text-orange-500 font-semibold hover:underline text-sm">
                Voir tous les boubous →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ BANNER KORITÉ & TABASKI ════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-500 to-red-500" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(60deg, #fff 0px, #fff 1px, transparent 1px, transparent 30px)`,
        }} />
        <div className="relative max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-white text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-full mb-4">
              🎉 Édition Spéciale
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Tenues Korité<br />& Tabaski 2025
            </h2>
            <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-lg">
              Commandez votre boubou pour la fête avant rupture de stock.
              Bazin extra riche, broderies exclusives, livraison express Dakar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/boutique?category=korite-tabaski"
                className="bg-white text-orange-600 font-black px-8 py-4 rounded-2xl text-lg hover:bg-orange-50 transition-all hover:scale-105 shadow-xl">
                🎊 Voir la Collection
              </Link>
              <a href="https://wa.me/221751059213?text=Bonjour!%20Je%20cherche%20une%20tenue%20pour%20la%20Korite%2FTabaski."
                target="_blank" rel="noopener noreferrer"
                className="bg-green-500 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center gap-2">
                💬 Commander WhatsApp
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-3">
            {koriteTabaski.slice(0, 2).map((p) => (
              <Link key={p.id} to={`/produit/${p.id}`}
                className="block w-32 h-36 sm:w-40 sm:h-44 rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition-transform">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ KORITÉ & TABASKI PRODUITS ════════════════ */}
      {koriteTabaski.length > 0 && (
        <section className="py-14 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  🎉 Fête & Célébration
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Tenues Korité & Tabaski
                </h2>
                <p className="text-gray-500 text-sm mt-1">Les plus belles tenues pour la fête</p>
              </div>
              <Link to="/boutique?category=korite-tabaski"
                className="hidden sm:flex items-center gap-1 text-amber-600 font-semibold hover:underline text-sm">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {koriteTabaski.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ TENUES MARIAGE ════════════════ */}
      {mariage.length > 0 && (
        <section className="py-14 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                💍 Mariage
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Tenues Mariage
              </h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">
                Des tenues grandioses pour votre plus beau jour. Agbada, boubou et kaftan de prestige.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {mariage.map((p) => (
                <Link key={p.id} to={`/produit/${p.id}`}
                  className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 bg-white border border-yellow-100">
                  <div className="relative h-64 overflow-hidden">
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="font-black text-lg leading-tight">{p.name}</p>
                      <p className="text-yellow-300 font-bold text-sm mt-1">
                        {p.price.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      💍 Mariage
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs line-clamp-2">{p.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">Stock: {p.stock} pcs</span>
                      <span className="text-orange-500 text-xs font-bold group-hover:underline">Voir →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/boutique?category=mariage"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-3 rounded-full transition-all hover:scale-105 shadow-lg">
                💍 Voir toutes les tenues mariage
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ BABOUCHES ════════════════ */}
      {babouches.length > 0 && (
        <section className="py-14 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  👡 Chaussures
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Babouches
                </h2>
                <p className="text-gray-500 text-sm mt-1">Artisanat cuir sénégalais, fait main</p>
              </div>
              <Link to="/boutique?category=babouches"
                className="hidden sm:flex items-center gap-1 text-orange-500 font-semibold hover:underline text-sm">
                Tout voir →
              </Link>
            </div>

            {/* Layout horizontal scrollable sur mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {babouches.map((p) => (
                <Link key={p.id} to={`/produit/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all hover:-translate-y-1 border border-orange-100">
                  <div className="h-44 overflow-hidden relative">
                    <img src={p.images[0]} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {p.isNew && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Nouveau</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-orange-500 font-black text-sm mt-1">{p.price.toLocaleString("fr-FR")} F</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.sizes.slice(0, 4).map((s) => (
                        <span key={s} className="text-[10px] bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                      {p.sizes.length > 4 && <span className="text-[10px] text-gray-400">+{p.sizes.length - 4}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6 sm:hidden">
              <Link to="/boutique?category=babouches"
                className="text-orange-500 font-semibold hover:underline text-sm">Voir toutes les babouches →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ ACCESSOIRES ════════════════ */}
      {accessoires.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                  💎 Accessoires
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  Accessoires
                </h2>
                <p className="text-gray-500 text-sm mt-1">Ceintures, bonnets, chapelets et plus</p>
              </div>
              <Link to="/boutique?category=accessoires"
                className="hidden sm:flex items-center gap-1 text-gray-600 font-semibold hover:underline text-sm">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {accessoires.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ CTA BANNER ════════════════ */}
      <section className="bg-gray-900 py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(60deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 25px)`,
          }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🎊</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Commandez maintenant,<br />
            <span className="text-orange-400">livraison express Dakar</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Recevez votre tenue à domicile. Paiement Wave, Orange Money ou à la livraison.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/boutique"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105">
              🛒 Voir la Collection
            </Link>
            <a href="https://wa.me/221751059213?text=Bonjour!%20Je%20veux%20passer%20une%20commande."
              target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              💬 Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════ POURQUOI NOUS ════════════════ */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Pourquoi choisir Sama Butik ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "Qualité Premium",    desc: "Bazin et tissus africains de haute qualité sélectionnés avec soin." },
              { icon: "✂️", title: "Artisanat Local",   desc: "Broderies et coutures faites à la main par nos artisans sénégalais." },
              { icon: "🚀", title: "Livraison Rapide",  desc: "Livraison express à Dakar. Commandez aujourd'hui, recevez demain." },
              { icon: "💬", title: "Service WhatsApp",  desc: "Commandez facilement via WhatsApp. On vous répond en moins d'1h." },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-orange-50 border border-orange-100 hover:border-orange-300 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PAIEMENTS MOBILES ════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-xs font-bold px-4 py-2 rounded-full mb-4">
              💳 Paiements Mobiles Acceptés
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Payez comme vous voulez</h2>
            <p className="text-gray-500 text-sm">Paiement 100% sécurisé via vos applications mobiles préférées</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { logo: "W",  name: "Wave",        sub: "Paiement instantané", color: "bg-blue-500",    bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700",    sub2: "text-blue-500" },
              { logo: "OM", name: "Orange Money", sub: "Transfert mobile",   color: "bg-orange-500",  bg: "bg-orange-50",  border: "border-orange-200",  text: "text-orange-700",  sub2: "text-orange-500" },
              { logo: "FM", name: "Free Money",   sub: "Tigo Cash",          color: "bg-green-500",   bg: "bg-green-50",   border: "border-green-200",   text: "text-green-700",   sub2: "text-green-500" },
              { logo: "WA", name: "WhatsApp",     sub: "Commande directe",   color: "bg-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", sub2: "text-emerald-500" },
            ].map((pm) => (
              <div key={pm.name} className={`${pm.bg} border-2 ${pm.border} rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1`}>
                <div className={`w-14 h-14 rounded-2xl ${pm.color} flex items-center justify-center text-white font-black text-lg shadow-md mb-3`}>
                  {pm.logo}
                </div>
                <p className={`font-black text-base ${pm.text}`}>{pm.name}</p>
                <p className={`text-xs font-semibold ${pm.sub2} mt-0.5`}>{pm.sub}</p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-xs text-gray-400">Disponible</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ AFFILIATION BANNER ════════════════ */}
      <section className="py-14 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, #f97316 0px, #f97316 1px, transparent 1px, transparent 15px)` }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🤝 Programme d'Affiliation Sama Butik
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Gagnez de l'argent en<br />
            <span className="text-orange-400">partageant nos produits</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez notre programme et gagnez des commissions sur chaque vente.
            Paiement Wave, Orange Money ou Free Money.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: "💰", label: "Commission par produit" },
              { icon: "📱", label: "Partage WhatsApp & Facebook" },
              { icon: "⚡", label: "Paiement rapide" },
              { icon: "🎯", label: "Aucun objectif" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 flex items-center gap-2">
                <span className="text-xl">{f.icon}</span>
                <span className="font-semibold text-sm">{f.label}</span>
              </div>
            ))}
          </div>
          <Link to="/affiliation"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-full text-lg transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1">
            🚀 Rejoindre le programme gratuit
          </Link>
          <p className="text-gray-400 text-sm mt-4">Inscription gratuite · Aucun frais caché</p>
        </div>
      </section>

    </div>
  );
}

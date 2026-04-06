export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #f97316 0px, #f97316 2px, transparent 2px, transparent 20px)`,
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🏪 Marché HLM 5, Dakar
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            À Propos de{" "}
            <span className="text-orange-400">Sama Butik</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            L'élégance africaine au quotidien – depuis le cœur de Dakar.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-orange-500 font-semibold uppercase tracking-wider text-sm mb-3">Notre Histoire</p>
          <h2
            className="text-3xl font-black text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            La Mode Africaine<br />Réinventée
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">Sama Butik</strong> est une boutique spécialisée dans les boubous modernes et la mode africaine élégante, située au cœur du <strong className="text-orange-500">Marché HLM 5</strong>, Centre Commercial Al Medina, à Dakar, Sénégal.
            </p>
            <p>
              Notre mission est simple : proposer des vêtements africains de qualité premium qui allient l'authenticité des traditions sénégalaises et africaines à l'élégance de la mode contemporaine.
            </p>
            <p>
              Chaque pièce est soigneusement sélectionnée ou confectionnée par nos artisans locaux, utilisant des tissus bazin, Ankara et Kente de haute qualité. Nos broderies sont réalisées à la main, perpétuant un savoir-faire artisanal ancestral.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-3xl rotate-6 opacity-20" />
          <img
            src="https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=700&q=80"
            alt="Sama Butik"
            className="relative w-full h-80 object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-orange-50 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-black text-center text-gray-900 mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏅",
                title: "Qualité Authentique",
                desc: "Nous n'utilisons que des tissus et matériaux de qualité premium – bazin extra riche, Ankara, soie africaine – pour des vêtements qui durent.",
              },
              {
                icon: "🎨",
                title: "Artisanat Local",
                desc: "Nous soutenons les artisans sénégalais en valorisant leur savoir-faire unique. Chaque broderie, chaque couture raconte une histoire.",
              },
              {
                icon: "🌍",
                title: "Fierté Africaine",
                desc: "Nous célébrons la richesse culturelle africaine à travers la mode. Porter nos vêtements, c'est porter la fierté du continent.",
              },
              {
                icon: "💎",
                title: "Élégance Moderne",
                desc: "Tradition et modernité ne sont pas opposées. Nos créations allient motifs traditionnels et coupes contemporaines.",
              },
              {
                icon: "🤝",
                title: "Service Client",
                desc: "Votre satisfaction est notre priorité. Notre équipe est disponible sur WhatsApp pour vous conseiller et traiter vos commandes rapidement.",
              },
              {
                icon: "🚀",
                title: "Livraison Dakar",
                desc: "Livraison rapide à Dakar et ses environs. Commandez le matin, recevez dans l'après-midi.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:border-orange-300 transition-colors">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-black text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Venez nous rendre visite
          </h2>
          <p className="text-gray-500 mb-8">Nous sommes au cœur de Dakar, facilement accessible</p>
          <div className="bg-gray-900 text-white rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📍</div>
              <h3 className="font-bold text-orange-400 mb-1">Adresse</h3>
              <p className="text-gray-300 text-sm">
                Marché HLM 5,<br />Centre Commercial Al Medina,<br />Dakar, Sénégal
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🕐</div>
              <h3 className="font-bold text-orange-400 mb-1">Horaires</h3>
              <p className="text-gray-300 text-sm">
                Lundi – Samedi<br />8h00 – 20h00<br />Dimanche: 10h – 18h
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📞</div>
              <h3 className="font-bold text-orange-400 mb-1">Contact</h3>
              <p className="text-gray-300 text-sm">
                WhatsApp:<br />
                <a href="https://wa.me/221751059213" className="text-green-400 hover:underline">
                  +221 75 105 92 13
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

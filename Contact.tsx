import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Bonjour Sama Butik! 👋\n\nJe m'appelle *${form.name}*.\n\n${form.message}\n\n📞 Mon numéro: ${form.phone}`
    );
    window.open(`https://wa.me/221751059213?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contactez-nous
          </h1>
          <p className="text-orange-100">On vous répond dans les plus brefs délais sur WhatsApp</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <div>
            <h2
              className="text-2xl font-black text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Informations de contact
            </h2>
          </div>

          {[
            {
              icon: "📍",
              title: "Notre Adresse",
              content: "Marché HLM 5, Centre Commercial Al Medina\nDakar, Sénégal",
              color: "bg-orange-100 text-orange-600",
            },
            {
              icon: "💬",
              title: "WhatsApp (Principal)",
              content: "+221 75 105 92 13",
              link: "https://wa.me/221751059213",
              color: "bg-green-100 text-green-600",
            },
            {
              icon: "🕐",
              title: "Horaires d'ouverture",
              content: "Lundi – Samedi: 8h00 – 20h00\nDimanche: 10h00 – 18h00",
              color: "bg-blue-100 text-blue-600",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 font-semibold hover:underline text-sm"
                  >
                    {item.content}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm whitespace-pre-line">{item.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* Direct WhatsApp */}
          <a
            href="https://wa.me/221751059213?text=Bonjour%20Sama%20Butik!%20Je%20voudrais%20des%20informations."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all hover:scale-105 shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Ouvrir WhatsApp maintenant
          </a>
        </div>

        {/* Form */}
        <div>
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2
              className="text-2xl font-black text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Envoyer un message
            </h2>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Moussa Diallo"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+221 77 000 00 00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Votre message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Bonjour, je voudrais des informations sur..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Envoyer via WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">
                Votre message sera envoyé directement sur notre WhatsApp
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

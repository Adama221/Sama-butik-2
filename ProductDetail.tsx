import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";


export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, calcProductCommission, calcProductCommissionRate } = useStore();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Produit introuvable</h2>
          <Link to="/boutique" className="text-orange-500 hover:underline font-semibold">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const whatsappMsg = encodeURIComponent(
    `Bonjour Sama Butik! 👋\n\nJe suis intéressé par:\n*${product.name}*\nTaille: ${selectedSize || "À préciser"}\nQuantité: ${quantity}\nPrix: ${formatPrice(product.price)}\n\nEst-ce disponible?`
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Veuillez choisir une taille.");
      return;
    }
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500 transition-colors">Accueil</Link>
          <span>/</span>
          <Link to="/boutique" className="hover:text-orange-500 transition-colors">Boutique</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden h-80 sm:h-96 lg:h-[500px] mb-3 shadow-md">
              <img
                src={product.images[mainImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NOUVEAU
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === i ? "border-orange-500 scale-105 shadow" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider capitalize">
                {product.category}
              </p>
              {product.affiliateRef && (
                <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg font-bold">
                  {product.affiliateRef}
                </span>
              )}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-black text-orange-500">
                {formatPrice(product.price)}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                  Plus que {product.stock} en stock!
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                  ÉPUISÉ
                </span>
              )}
            </div>

            {/* Badge commission affilié */}
            {(product.affiliateRef || product.commissionRate) && (
              <div className="flex items-center gap-3 mb-6 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">
                  🤝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700">
                    Programme Affilié ·{" "}
                    <span className="font-mono text-orange-500">{product.affiliateRef ?? "—"}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Commission:{" "}
                    <strong className="text-orange-600">
                      +{calcProductCommission(product).toLocaleString("fr-FR")} FCFA
                    </strong>
                    {" "}({calcProductCommissionRate(product)}%{product.commissionFixed && product.commissionFixed > 0 ? " fixe" : ""})
                    {" "}par vente générée
                  </p>
                </div>
                <Link
                  to="/affiliation"
                  className="text-xs text-orange-500 font-bold hover:underline whitespace-nowrap"
                >
                  Devenir affilié →
                </Link>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-6 text-sm">{product.description}</p>

            {/* Sizes */}
            <div className="mb-6">
              <p className="font-bold text-gray-900 text-sm mb-3">
                Choisir la taille:{" "}
                {selectedSize && (
                  <span className="text-orange-500 font-black">{selectedSize}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border-2 ${
                      selectedSize === size
                        ? "bg-orange-500 text-white border-orange-500 shadow-md scale-110"
                        : "bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-bold text-gray-900 text-sm mb-3">Quantité:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold text-lg hover:bg-orange-100 hover:text-orange-500 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-lg text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold text-lg hover:bg-orange-100 hover:text-orange-500 transition-colors"
                  disabled={product.stock === 0}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-bold py-4 rounded-2xl transition-all text-sm ${
                  added
                    ? "bg-green-500 text-white"
                    : product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 shadow-lg"
                }`}
              >
                {added ? "✓ Ajouté au panier !" : product.stock === 0 ? "Rupture de stock" : "🛒 Ajouter au panier"}
              </button>
              <button
                onClick={() => navigate("/panier")}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 text-sm"
              >
                Voir le panier
              </button>
            </div>

            {/* WhatsApp Order */}
            <a
              href={`https://wa.me/221751059213?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 text-sm shadow-lg mb-6"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Commander via WhatsApp
            </a>

            {/* Store Info */}
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <p className="text-sm font-bold text-gray-900 mb-2">📍 Sama Butik HLM5</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Marché HLM 5, Centre Commercial Al Medina, Dakar, Sénégal<br />
                Lun – Sam: 8h00 – 20h00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

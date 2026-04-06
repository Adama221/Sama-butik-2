import { Link } from "react-router-dom";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.sizes[0];
    addToCart(product, defaultSize, 1);
  };

  const whatsappMsg = encodeURIComponent(
    `Bonjour! Je suis intéressé par: ${product.name} (${formatPrice(product.price)}). Est-ce disponible?`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <Link to={`/produit/${product.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-64 bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                NOUVEAU
              </span>
            )}
            {product.stock <= 3 && product.stock > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                STOCK LIMITÉ
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                ÉPUISÉ
              </span>
            )}
          </div>
          {/* Quick WhatsApp overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 gap-2">
            <a
              href={`https://wa.me/221751059213?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-xl text-center hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>
            <button
              onClick={handleQuickAdd}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 text-white text-xs font-bold py-2 px-3 rounded-xl hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              🛒 Ajouter
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1 capitalize">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-orange-600 font-black text-lg">
              {formatPrice(product.price)}
            </span>
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map((s) => (
                <span key={s} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium border border-orange-200">
                  {s}
                </span>
              ))}
              {product.sizes.length > 3 && (
                <span className="text-xs text-gray-400 px-1">+{product.sizes.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

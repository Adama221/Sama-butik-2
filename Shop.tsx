import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/products";
import { Category } from "../types";

export default function Shop() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const categoryParam = searchParams.get("category") as Category | null;
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    categoryParam || "all"
  );

  // Sync avec l'URL quand elle change (ex: depuis la navbar)
  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "new")   list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [products, selectedCategory, search, sortBy]);

  const handleCategoryChange = (cat: Category | "all") => {
    setSelectedCategory(cat);
    if (cat === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Infos de la catégorie active
  const activeCat = CATEGORIES.find((c) => c.value === selectedCategory);

  // Header couleurs selon catégorie
  const headerGradients: Record<string, string> = {
    "nouveaux-arrivages": "from-red-500 to-orange-500",
    "boubou-homme":       "from-orange-500 to-orange-600",
    "korite-tabaski":     "from-amber-500 to-orange-500",
    "mariage":            "from-yellow-500 to-amber-500",
    "babouches":          "from-orange-400 to-orange-500",
    "accessoires":        "from-gray-600 to-gray-700",
  };
  const gradientClass = selectedCategory !== "all"
    ? headerGradients[selectedCategory] || "from-orange-500 to-orange-600"
    : "from-orange-500 to-orange-600";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className={`bg-gradient-to-r ${gradientClass} text-white py-10 px-4`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            {activeCat && <span className="text-3xl">{activeCat.icon}</span>}
            <h1 className="text-3xl sm:text-4xl font-black"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeCat ? activeCat.label : "Notre Boutique"}
            </h1>
          </div>
          <p className="text-white/80 text-sm mt-1">
            {filtered.length} produit{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Navigation catégories (pills horizontales) ── */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max sm:flex-wrap sm:min-w-0">
            {/* Bouton "Tout" */}
            <button
              onClick={() => handleCategoryChange("all")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white border-gray-900 shadow-lg"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}>
              🛍️ Tout voir
            </button>

            {CATEGORIES.map((cat) => {
              const activeColors: Record<string, string> = {
                "nouveaux-arrivages": "bg-red-500 text-white border-red-500",
                "boubou-homme":       "bg-orange-500 text-white border-orange-500",
                "korite-tabaski":     "bg-amber-500 text-white border-amber-500",
                "mariage":            "bg-yellow-500 text-white border-yellow-500",
                "babouches":          "bg-orange-400 text-white border-orange-400",
                "accessoires":        "bg-gray-600 text-white border-gray-600",
              };
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value as Category)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all whitespace-nowrap ${
                    isSelected
                      ? activeColors[cat.value] || "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}>
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Search + Sort ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher un vêtement, boubou, babouche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:outline-none transition-colors bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                ✕
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 focus:border-orange-400 focus:outline-none bg-white min-w-[160px]">
            <option value="default">Trier par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="new">Nouveautés d'abord</option>
          </select>
        </div>

        {/* ── Résultats ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400 text-sm mb-6">Essayez une autre catégorie ou modifiez votre recherche.</p>
            <button
              onClick={() => { setSearch(""); handleCategoryChange("all"); }}
              className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors">
              Voir tous les produits
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

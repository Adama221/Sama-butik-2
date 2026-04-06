import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { Product, Category } from "../types";
import { CATEGORIES, generateAffiliateRef } from "../data/products";
import ImageUploader from "../components/ImageUploader";

type AdminTab = "products" | "add" | "orders";

const EMPTY_PRODUCT = {
  name: "",
  price: 0,
  description: "",
  images: [""],
  sizes: [] as string[],
  stock: 0,
  category: "boubou" as Category,
  isNew: false,
  isFeatured: false,
  affiliateRef: "",
  commissionRate: 10,
  commissionFixed: 0,
};

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus, calcProductCommission, calcProductCommissionRate } = useStore();
  const { username, logout, sessionExpiry } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("products");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sessionTimeLeft = sessionExpiry
    ? Math.max(0, Math.floor((sessionExpiry - Date.now()) / 1000 / 60))
    : 0;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [commissionMode, setCommissionMode] = useState<"percent" | "fixed">("percent");

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " FCFA";

  const resetForm = () => {
    setForm({ ...EMPTY_PRODUCT });
    setEditingProduct(null);
    setCommissionMode("percent");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const isFixed = !!(product.commissionFixed && product.commissionFixed > 0);
    setCommissionMode(isFixed ? "fixed" : "percent");
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images.length ? product.images : [""],
      sizes: [...product.sizes],
      stock: product.stock,
      category: product.category,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      affiliateRef: product.affiliateRef || "",
      commissionRate: product.commissionRate ?? 10,
      commissionFixed: product.commissionFixed ?? 0,
    });
    setTab("add");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanImages = form.images.filter((img) => img.trim() !== "");

    // Auto-générer référence si vide
    const existingRefs = products
      .filter((p) => !editingProduct || p.id !== editingProduct.id)
      .map((p) => p.affiliateRef ?? "")
      .filter(Boolean);
    const affiliateRef = form.affiliateRef.trim() ||
      generateAffiliateRef(form.category, existingRefs);

    const productData = {
      ...form,
      affiliateRef,
      images: cleanImages.length ? cleanImages : ["https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80"],
      commissionFixed: commissionMode === "fixed" ? form.commissionFixed : 0,
      commissionRate: commissionMode === "percent" ? form.commissionRate : 10,
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
    } else {
      addProduct(productData);
    }

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      resetForm();
      setTab("products");
    }, 1500);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setConfirmDelete(null);
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.affiliateRef ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Aperçu commission pour le formulaire
  const previewCommission = form.price > 0
    ? commissionMode === "fixed"
      ? form.commissionFixed
      : Math.round(form.price * (form.commissionRate / 100))
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">SB</div>
            <div>
              <p className="font-black text-lg leading-tight">Admin Panel</p>
              <p className="text-orange-400 text-xs">Sama Butik HLM5</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="hidden sm:flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
              <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                {username?.charAt(0) ?? "A"}
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">{username}</p>
                <p className="text-gray-400 text-[10px]">Session : {sessionTimeLeft}min restantes</p>
              </div>
            </div>
            <Link to="/admin/affiliation" className="text-orange-400 font-bold hover:text-orange-300 transition-colors text-sm">
              🤝 Affiliation →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              🚪 <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Produits total", value: products.length, icon: "👔", color: "bg-orange-500" },
            { label: "Stock faible (≤3)", value: products.filter((p) => p.stock <= 3).length, icon: "⚠️", color: "bg-yellow-500" },
            { label: "Épuisés", value: products.filter((p) => p.stock === 0).length, icon: "❌", color: "bg-red-500" },
            { label: "Commandes WhatsApp", value: orders.length, icon: "💬", color: "bg-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg mb-2`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "products", label: "📦 Produits" },
            { id: "add", label: editingProduct ? "✏️ Modifier" : "➕ Ajouter" },
            { id: "orders", label: "📋 Commandes" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id as AdminTab); if (t.id !== "add") resetForm(); }}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id
                  ? "bg-orange-500 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Products Tab ─────────────────────────────────────────── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Nom, catégorie, référence affilié..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <button
                onClick={() => { resetForm(); setTab("add"); }}
                className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
              >
                + Nouveau produit
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Produit</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden md:table-cell">Réf. Affilié</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden sm:table-cell">Catégorie</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Prix</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600 hidden lg:table-cell">Commission</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Stock</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const commRate = calcProductCommissionRate(product);
                      const commAmt = calcProductCommission(product);
                      const isFixed = !!(product.commissionFixed && product.commissionFixed > 0);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.images[0]}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                                {product.isNew && (
                                  <span className="text-xs text-orange-500 font-semibold">NOUVEAU</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-bold">
                              {product.affiliateRef ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(product.price)}</td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-xs font-black px-2 py-1 rounded-lg ${isFixed ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}>
                                {isFixed ? `${commAmt.toLocaleString("fr-FR")} F fixe` : `${commRate}%`}
                              </span>
                              <span className="text-xs text-gray-400">
                                = {commAmt.toLocaleString("fr-FR")} F
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-bold text-sm px-2 py-1 rounded-full ${
                                product.stock === 0
                                  ? "bg-red-100 text-red-600"
                                  : product.stock <= 3
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                ✏️ Éditer
                              </button>
                              {confirmDelete === product.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="text-xs bg-red-500 text-white font-semibold px-2 py-1.5 rounded-lg"
                                  >
                                    Confirmer
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1.5 rounded-lg"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(product.id)}
                                  className="text-xs bg-red-50 text-red-500 hover:bg-red-100 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  🗑️ Suppr.
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="font-semibold">Aucun produit trouvé</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Add/Edit Tab ─────────────────────────────────────────── */}
        {tab === "add" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">
              {editingProduct ? `✏️ Modifier: ${editingProduct.name}` : "➕ Ajouter un produit"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nom + Catégorie */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Boubou Grand Bazin Brodé"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prix + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Prix (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    placeholder="Ex: 45000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Quantité en stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    placeholder="Ex: 10"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* ── Section Affiliation ─────────────────────────────── */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🤝</span>
                  <h3 className="font-black text-gray-800">Paramètres d'Affiliation</h3>
                  <span className="text-xs bg-orange-200 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Par produit</span>
                </div>

                {/* Référence affilié */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Référence Affilié
                    <span className="ml-2 text-xs text-gray-400 font-normal">(auto-générée si vide)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.affiliateRef}
                      onChange={(e) => setForm({ ...form, affiliateRef: e.target.value.toUpperCase() })}
                      placeholder={`Ex: SB-${form.category.toUpperCase().slice(0, 3)}-001`}
                      className="flex-1 border border-orange-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const existingRefs = products
                          .filter((p) => !editingProduct || p.id !== editingProduct.id)
                          .map((p) => p.affiliateRef ?? "").filter(Boolean);
                        setForm({ ...form, affiliateRef: generateAffiliateRef(form.category, existingRefs) });
                      }}
                      className="bg-orange-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      🔄 Générer
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Utilisé par les affiliés pour identifier ce produit dans leurs commissions
                  </p>
                </div>

                {/* Type de commission */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type de commission</label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setCommissionMode("percent")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                        commissionMode === "percent"
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-500 border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      📊 Pourcentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommissionMode("fixed")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                        commissionMode === "fixed"
                          ? "bg-purple-500 text-white border-purple-500"
                          : "bg-white text-gray-500 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      💰 Montant fixe (FCFA)
                    </button>
                  </div>

                  {commissionMode === "percent" && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={form.commissionRate}
                          onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                          className="w-full border border-orange-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                        />
                      </div>
                      <span className="text-gray-600 font-bold text-lg">%</span>
                      {form.price > 0 && (
                        <div className="bg-green-100 text-green-700 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap">
                          = {Math.round(form.price * (form.commissionRate / 100)).toLocaleString("fr-FR")} FCFA
                        </div>
                      )}
                    </div>
                  )}

                  {commissionMode === "fixed" && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          value={form.commissionFixed}
                          onChange={(e) => setForm({ ...form, commissionFixed: Number(e.target.value) })}
                          placeholder="Ex: 3000"
                          className="w-full border border-purple-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                        />
                      </div>
                      <span className="text-gray-600 font-bold">FCFA</span>
                      {form.price > 0 && form.commissionFixed > 0 && (
                        <div className="bg-purple-100 text-purple-700 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap">
                          ≈ {Math.round((form.commissionFixed / form.price) * 1000) / 10}%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Aperçu commission */}
                {previewCommission > 0 && (
                  <div className="bg-white rounded-xl p-4 border border-orange-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Commission affilié par vente</p>
                      <p className="font-black text-xl text-orange-500">{previewCommission.toLocaleString("fr-FR")} FCFA</p>
                    </div>
                    <div className="text-3xl">🎯</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le produit en détail..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Tailles */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tailles disponibles *</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-12 h-12 rounded-xl font-bold text-sm transition-all border-2 ${
                        form.sizes.includes(size)
                          ? "bg-orange-500 text-white border-orange-500 shadow"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📸 Images du produit
                  <span className="ml-2 text-xs text-gray-400 font-normal">
                    (max 4 · upload depuis galerie, photo ou URL)
                  </span>
                </label>
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                  maxImages={4}
                />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Marquer comme Nouveau</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">Produit Populaire</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className={`flex-1 font-bold py-4 rounded-2xl transition-all text-sm ${
                    saved
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white hover:scale-105 shadow-lg"
                  }`}
                >
                  {saved ? "✓ Enregistré !" : editingProduct ? "Mettre à jour le produit" : "Ajouter le produit"}
                </button>
                <button
                  type="button"
                  onClick={() => { resetForm(); setTab("products"); }}
                  className="px-6 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Orders Tab ─────────────────────────────────────────────── */}
        {tab === "orders" && (
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Chiffre d'affaires estimé</h3>
                <span className="text-2xl font-black text-orange-500">{formatPrice(totalRevenue)}</span>
              </div>
              <p className="text-xs text-gray-400">Basé sur {orders.length} commande(s) enregistrée(s)</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
                <div className="text-6xl mb-3">📋</div>
                <p className="font-bold text-gray-700 mb-1">Aucune commande pour l'instant</p>
                <p className="text-gray-400 text-sm">Les commandes Wave, Orange Money, Free Money et WhatsApp apparaîtront ici</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-black text-gray-900 text-sm font-mono">{order.id}</p>
                          {/* Badge méthode paiement */}
                          {order.paymentMethod && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              order.paymentMethod === "wave"
                                ? "bg-blue-100 text-blue-700"
                                : order.paymentMethod === "orange_money"
                                ? "bg-orange-100 text-orange-700"
                                : order.paymentMethod === "free_money"
                                ? "bg-green-100 text-green-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {order.paymentMethod === "wave" && "�� Wave"}
                              {order.paymentMethod === "orange_money" && "🟠 Orange Money"}
                              {order.paymentMethod === "free_money" && "🟢 Free Money"}
                              {order.paymentMethod === "whatsapp" && "💬 WhatsApp"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">
                          👤 {order.customerName} • 📱 {order.customerPhone}
                        </p>
                        {order.customerAddress && (
                          <p className="text-xs text-gray-400 mt-0.5">📍 {order.customerAddress}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.date).toLocaleDateString("fr-FR", {
                            year: "numeric", month: "long", day: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                        {order.affiliateCode && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-full">
                            🤝 Affilié: {order.affiliateCode}
                          </span>
                        )}
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as "pending" | "confirmed" | "delivered")}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer flex-shrink-0 ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "paid"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        <option value="pending">⏳ En attente</option>
                        <option value="confirmed">✅ Confirmée</option>
                        <option value="paid">💳 Payée</option>
                        <option value="delivered">🚀 Livrée</option>
                      </select>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-gray-600">
                          <span>{item.product.name} × {item.quantity} ({item.size})</span>
                          <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Total</span>
                        {order.paymentRef && (
                          <span className="text-xs text-gray-400 font-mono">Réf: {order.paymentRef}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`https://wa.me/${order.customerPhone.replace(/\D/g,"").replace(/^0/,"221")}?text=${encodeURIComponent(`Bonjour ${order.customerName} ! Votre commande Sama Butik (${order.id}) est confirmée. Merci 🙏`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                          Contacter
                        </a>
                        <span className="font-black text-orange-500">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

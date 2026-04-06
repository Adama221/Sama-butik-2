import { Product } from "../types";

export const INITIAL_PRODUCTS: Product[] = [
  // ══════════════════════════════════════════
  // 🆕 NOUVEAUX ARRIVAGES
  // ══════════════════════════════════════════
  {
    id: "na-1",
    name: "Boubou Bazin Brodé Or 2025",
    price: 52000,
    description:
      "Dernière collection 2025. Boubou en bazin riche avec broderies dorées exclusives sur le col et les manches. Tissu importé de qualité supérieure. Livré avec pantalon assorti.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    stock: 15,
    category: "nouveaux-arrivages",
    isNew: true,
    isFeatured: true,
    affiliateRef: "SB-NA-001",
    commissionRate: 12,
  },
  {
    id: "na-2",
    name: "Senator Premium Ankara 2025",
    price: 29000,
    description:
      "Senator deux pièces nouvelle collection 2025 en tissu Ankara géométrique. Coupe slim moderne, parfait pour l'homme africain contemporain.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    category: "nouveaux-arrivages",
    isNew: true,
    isFeatured: true,
    affiliateRef: "SB-NA-002",
    commissionRate: 10,
    commissionFixed: 2800,
  },
  {
    id: "na-3",
    name: "Kaftan Lin Naturel Moderne",
    price: 34000,
    description:
      "Kaftan en lin naturel, nouvelle tendance 2025. Légèreté et élégance pour toutes occasions. Disponible en beige, blanc et bleu nuit.",
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 12,
    category: "nouveaux-arrivages",
    isNew: true,
    affiliateRef: "SB-NA-003",
    commissionRate: 10,
  },
  {
    id: "na-4",
    name: "Babouches Cuir Premium Gold",
    price: 18000,
    description:
      "Babouches artisanales en cuir véritable avec finition dorée. Nouvelles en 2025, confort exceptionnel. Fabriquées par des artisans sénégalais.",
    images: [
      "https://images.unsplash.com/photo-1603808033176-9d134e6f4571?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    stock: 25,
    category: "nouveaux-arrivages",
    isNew: true,
    affiliateRef: "SB-NA-004",
    commissionFixed: 1500,
  },

  // ══════════════════════════════════════════
  // 👘 BOUBOU HOMME
  // ══════════════════════════════════════════
  {
    id: "bh-1",
    name: "Boubou Grand Bazin Brodé Classique",
    price: 45000,
    description:
      "Magnifique boubou en bazin riche brodé main, parfait pour les grandes occasions. Coupe ample et élégante, reflets chatoyants, broderies dorées sur le col et les manches.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL", "3XL"],
    stock: 12,
    category: "boubou-homme",
    isFeatured: true,
    affiliateRef: "SB-BH-001",
    commissionRate: 12,
  },
  {
    id: "bh-2",
    name: "Boubou Agbada Royal 3 Pièces",
    price: 75000,
    description:
      "Agbada royal composé de 3 pièces (grand boubou, chemise, pantalon) en bazin de qualité premium. Broderies faites à la main par nos artisans. L'habit des grandes cérémonies.",
    images: [
      "https://images.unsplash.com/photo-1520975867049-56e0b2f4d8a1?w=600&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
    ],
    sizes: ["L", "XL", "XXL", "3XL"],
    stock: 5,
    category: "boubou-homme",
    isFeatured: true,
    affiliateRef: "SB-BH-002",
    commissionRate: 15,
  },
  {
    id: "bh-3",
    name: "Boubou Bazin Bleu Royal",
    price: 38000,
    description:
      "Boubou en bazin bleu royal avec broderies argentées. Tissu de haute qualité avec finitions soignées. Idéal pour cérémonies et fêtes religieuses.",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    stock: 8,
    category: "boubou-homme",
    affiliateRef: "SB-BH-003",
    commissionRate: 12,
  },
  {
    id: "bh-4",
    name: "Boubou Kaftan Moderne Slim",
    price: 32000,
    description:
      "Kaftan contemporain alliant tradition et modernité. Tissu léger de qualité supérieure avec coupe slim. Idéal pour le quotidien et les cérémonies.",
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 15,
    category: "boubou-homme",
    affiliateRef: "SB-BH-004",
    commissionRate: 10,
  },
  {
    id: "bh-5",
    name: "Boubou Dashiki Tie-Dye Artisanal",
    price: 18000,
    description:
      "Dashiki coloré fait à la main avec technique tie-dye traditionnelle. Tissu 100% coton respirant, parfait pour le quotidien et les sorties décontractées.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 20,
    category: "boubou-homme",
    affiliateRef: "SB-BH-005",
    commissionRate: 8,
    commissionFixed: 1200,
  },

  // ══════════════════════════════════════════
  // 🎉 KORITÉ & TABASKI
  // ══════════════════════════════════════════
  {
    id: "kt-1",
    name: "Boubou Korité Bazin Extra Riche",
    price: 65000,
    description:
      "Collection spéciale Korité & Tabaski. Boubou en bazin extra riche avec broderies dorées exclusives. Livré avec le pantalon assorti et le bonnet. La tenue parfaite pour la fête.",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    stock: 10,
    category: "korite-tabaski",
    isNew: true,
    isFeatured: true,
    affiliateRef: "SB-KT-001",
    commissionRate: 13,
  },
  {
    id: "kt-2",
    name: "Grand Boubou Tabaski Blanc Or",
    price: 72000,
    description:
      "Grand boubou blanc immaculé avec broderies or pour la Tabaski. 3 pièces complètes (boubou, chemise, pantalon). Tissu bazin luxe importé. La tenue des jours bénis.",
    images: [
      "https://images.unsplash.com/photo-1520975867049-56e0b2f4d8a1?w=600&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    ],
    sizes: ["L", "XL", "XXL", "3XL"],
    stock: 7,
    category: "korite-tabaski",
    isNew: true,
    isFeatured: true,
    affiliateRef: "SB-KT-002",
    commissionRate: 15,
  },
  {
    id: "kt-3",
    name: "Senator Korité Collection Spéciale",
    price: 35000,
    description:
      "Senator deux pièces édition spéciale Korité. Tissu Ankara aux couleurs festives, coupe élégante. Parfait pour passer la fête en beauté.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 14,
    category: "korite-tabaski",
    isNew: true,
    affiliateRef: "SB-KT-003",
    commissionRate: 10,
    commissionFixed: 3200,
  },
  {
    id: "kt-4",
    name: "Kaftan Bazin Korité Brodé",
    price: 48000,
    description:
      "Kaftan en bazin riche spécial Korité avec broderies traditionnelles multicolores. Finition artisanale haut de gamme. La touche d'élégance pour votre fête.",
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 9,
    category: "korite-tabaski",
    affiliateRef: "SB-KT-004",
    commissionRate: 12,
  },

  // ══════════════════════════════════════════
  // 💍 TENUES MARIAGE
  // ══════════════════════════════════════════
  {
    id: "mg-1",
    name: "Agbada Mariage Prestige Or",
    price: 120000,
    description:
      "La tenue de mariage ultime. Agbada 3 pièces en bazin prestige avec broderies or faites main par nos meilleurs artisans. Comprend grand boubou, chemise brodée et pantalon. Sur commande.",
    images: [
      "https://images.unsplash.com/photo-1520975867049-56e0b2f4d8a1?w=600&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    stock: 3,
    category: "mariage",
    isFeatured: true,
    affiliateRef: "SB-MG-001",
    commissionRate: 15,
  },
  {
    id: "mg-2",
    name: "Grand Boubou Marié Bazin Luxe",
    price: 85000,
    description:
      "Grand boubou de marié en bazin luxe ivoire. Broderies dorées fines sur le col, manches et devant. Livré complet avec bonnet et babouches assorties.",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
      "https://images.unsplash.com/photo-1520975867049-56e0b2f4d8a1?w=600&q=80",
    ],
    sizes: ["L", "XL", "XXL", "3XL"],
    stock: 4,
    category: "mariage",
    isFeatured: true,
    affiliateRef: "SB-MG-002",
    commissionRate: 15,
  },
  {
    id: "mg-3",
    name: "Senator Mariage Premium",
    price: 55000,
    description:
      "Senator de mariage en tissu Ankara de luxe. Coupe parfaite pour le grand jour. Finitions brodées sur les poignets et le col. Tenue complète pantalon + chemise.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 6,
    category: "mariage",
    affiliateRef: "SB-MG-003",
    commissionRate: 13,
  },
  {
    id: "mg-4",
    name: "Kaftan Marié Blanc Brodé",
    price: 68000,
    description:
      "Kaftan blanc immaculé pour le marié. Broderies argentées sur l'ensemble du vêtement. Tissu bazin de première qualité. Personnalisation possible sur commande.",
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b1f34?w=600&q=80",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stock: 5,
    category: "mariage",
    affiliateRef: "SB-MG-004",
    commissionRate: 14,
  },

  // ══════════════════════════════════════════
  // 👡 BABOUCHES
  // ══════════════════════════════════════════
  {
    id: "bb-1",
    name: "Babouches Cuir Naturel Artisanales",
    price: 15000,
    description:
      "Babouches traditionnelles en cuir naturel 100% sénégalais. Fabriquées à la main par nos artisans de HLM 5. Confort et durabilité garantis. Semelle épaisse anti-fatigue.",
    images: [
      "https://images.unsplash.com/photo-1603808033176-9d134e6f4571?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
    stock: 30,
    category: "babouches",
    isFeatured: true,
    affiliateRef: "SB-BB-001",
    commissionFixed: 1200,
  },
  {
    id: "bb-2",
    name: "Babouches Brodées Dorées Prestige",
    price: 22000,
    description:
      "Babouches en cuir avec broderies dorées artisanales. Idéales pour les mariages et cérémonies. Finition luxueuse, semelle intérieure rembourrée pour un confort maximal.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1603808033176-9d134e6f4571?w=600&q=80",
    ],
    sizes: ["40", "41", "42", "43", "44", "45", "46"],
    stock: 20,
    category: "babouches",
    isFeatured: true,
    affiliateRef: "SB-BB-002",
    commissionFixed: 2000,
  },
  {
    id: "bb-3",
    name: "Babouches Korité Blanc Or",
    price: 18500,
    description:
      "Babouches blanches avec détails dorés, spécial Korité et Tabaski. Cuir souple et résistant, parfaites pour compléter votre grand boubou.",
    images: [
      "https://images.unsplash.com/photo-1603808033176-9d134e6f4571?w=600&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    stock: 18,
    category: "babouches",
    isNew: true,
    affiliateRef: "SB-BB-003",
    commissionFixed: 1600,
  },
  {
    id: "bb-4",
    name: "Babouches Mariage Luxe Personnalisées",
    price: 28000,
    description:
      "Babouches de mariage sur mesure, personnalisables avec initiales ou motifs. Cuir de première qualité, entièrement faites main. Commande minimum 7 jours à l'avance.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      "https://images.unsplash.com/photo-1603808033176-9d134e6f4571?w=600&q=80",
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45", "46"],
    stock: 10,
    category: "babouches",
    affiliateRef: "SB-BB-004",
    commissionFixed: 2500,
  },

  // ══════════════════════════════════════════
  // 💎 ACCESSOIRES
  // ══════════════════════════════════════════
  {
    id: "ac-1",
    name: "Ceinture Cuir Artisanale Dorée",
    price: 8500,
    description:
      "Ceinture en cuir véritable fabriquée par des artisans sénégalais. Boucle dorée, multiple tailles disponibles. Parfaite pour compléter votre tenue africaine.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: 35,
    category: "accessoires",
    affiliateRef: "SB-AC-001",
    commissionFixed: 600,
  },
  {
    id: "ac-2",
    name: "Bonnet Bazin Brodé Assorti",
    price: 5000,
    description:
      "Bonnet traditionnel en bazin brodé pour compléter votre boubou. Disponible en plusieurs coloris pour s'assortir à votre tenue. Artisanat local de qualité.",
    images: [
      "https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    ],
    sizes: ["Unique"],
    stock: 40,
    category: "accessoires",
    affiliateRef: "SB-AC-002",
    commissionFixed: 400,
  },
  {
    id: "ac-3",
    name: "Chapelet Bois de Santal Luxe",
    price: 7500,
    description:
      "Chapelet artisanal en bois de santal précieux avec perles dorées. Parfait comme accessoire de prière ou cadeau. Fabriqué à la main, chaque pièce est unique.",
    images: [
      "https://images.unsplash.com/photo-1576473574-d5dbf29fd9e7?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    ],
    sizes: ["Unique"],
    stock: 50,
    category: "accessoires",
    affiliateRef: "SB-AC-003",
    commissionFixed: 600,
  },
  {
    id: "ac-4",
    name: "Sac Cuir Porte-Coran Brodé",
    price: 12000,
    description:
      "Pochette porte-Coran en cuir véritable avec broderies islamiques. Fermeture zippée, doublure intérieure. Idéal pour la prière du vendredi et les cérémonies religieuses.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      "https://images.unsplash.com/photo-1576473574-d5dbf29fd9e7?w=600&q=80",
    ],
    sizes: ["Unique"],
    stock: 22,
    category: "accessoires",
    isNew: true,
    affiliateRef: "SB-AC-004",
    commissionFixed: 1000,
  },
];

// ── Catégories principales (menu de navigation) ──────────────────
export const CATEGORIES = [
  { value: "nouveaux-arrivages", label: "Nouveaux Arrivages",    icon: "🆕", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "boubou-homme",       label: "Boubou Homme",          icon: "👘", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: "korite-tabaski",     label: "Korité & Tabaski",      icon: "🎉", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { value: "mariage",            label: "Tenues Mariage",        icon: "💍", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "babouches",          label: "Babouches",             icon: "👡", color: "bg-orange-50 text-orange-600 border-orange-200" },
  { value: "accessoires",        label: "Accessoires",           icon: "💎", color: "bg-gray-100 text-gray-700 border-gray-300" },
];

// ── Utilitaire : calculer la commission d'un produit ─────────────
export function getProductCommission(product: Product, affiliateDefaultRate: number = 10): number {
  if (product.commissionFixed && product.commissionFixed > 0) {
    return product.commissionFixed;
  }
  const rate = product.commissionRate ?? affiliateDefaultRate;
  return Math.round(product.price * (rate / 100));
}

// Retourner le taux effectif affiché (en %)
export function getProductCommissionRate(product: Product, affiliateDefaultRate: number = 10): number {
  if (product.commissionFixed && product.commissionFixed > 0) {
    return Math.round((product.commissionFixed / product.price) * 100 * 10) / 10;
  }
  return product.commissionRate ?? affiliateDefaultRate;
}

// Générer une référence automatique basée sur la catégorie
export function generateAffiliateRef(category: string, existingRefs: string[]): string {
  const prefix = `SB-${category.toUpperCase().slice(0, 3)}-`;
  let num = 1;
  while (existingRefs.includes(`${prefix}${String(num).padStart(3, "0")}`)) {
    num++;
  }
  return `${prefix}${String(num).padStart(3, "0")}`;
}

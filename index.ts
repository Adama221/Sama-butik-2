export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  sizes: string[];
  stock: number;
  category: Category;
  isNew?: boolean;
  isFeatured?: boolean;
  // ── Affiliation par produit ──────────────────────────────────
  affiliateRef?: string;      // Référence unique du produit (ex: "SB-BOU-001")
  commissionRate?: number;    // % de commission spécifique à ce produit (ex: 12)
  commissionFixed?: number;   // Commission fixe en FCFA (si définie, prioritaire sur %)
}

export type Category =
  | "nouveaux-arrivages"
  | "boubou-homme"
  | "korite-tabaski"
  | "mariage"
  | "babouches"
  | "accessoires"
  | "boubou"
  | "kaftan"
  | "senator"
  | "dashiki"
  | "agbada";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export type PaymentMethod = "wave" | "orange_money" | "free_money" | "whatsapp";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  date: string;
  status: "pending" | "confirmed" | "delivered" | "paid";
  affiliateCode?: string;
  paymentMethod?: PaymentMethod;
  paymentRef?: string;
}

// ─── Détail d'un produit dans une commission affilié ────────────
export interface CommissionProductLine {
  productId: string;
  productName: string;
  affiliateRef: string;
  quantity: number;
  unitPrice: number;
  commissionRate: number;       // taux appliqué
  commissionAmount: number;     // montant commission pour ce produit
  isFixedRate: boolean;         // true si commission fixe FCFA
}

// ─── Affiliation ────────────────────────────────────────────────
export interface Affiliate {
  id: string;
  name: string;
  phone: string;
  email: string;
  code: string;           // code unique de parrainage
  commissionRate: number; // % de commission globale par défaut (si produit n'a pas de taux)
  status: "pending" | "active" | "suspended";
  joinDate: string;
  totalEarnings: number;
  totalSales: number;
  balance: number;        // solde non versé
}

export interface AffiliateReferral {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  orderId: string;
  orderTotal: number;
  commissionAmount: number;
  date: string;
  status: "pending" | "validated" | "paid";
  customerPhone: string;
  // ── Détail par produit ────────────────────────────────────────
  productLines: CommissionProductLine[];   // détail commission par produit
}

export interface AffiliateWithdrawal {
  id: string;
  affiliateId: string;
  amount: number;
  date: string;
  status: "pending" | "paid";
  method: "wave" | "orange_money" | "free_money";
  phoneNumber: string;
}

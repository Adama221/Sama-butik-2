import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Product, CartItem, Order, Affiliate, AffiliateReferral,
  AffiliateWithdrawal, CommissionProductLine
} from "../types";
import { INITIAL_PRODUCTS } from "../data/products";

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  // Affiliation
  affiliates: Affiliate[];
  referrals: AffiliateReferral[];
  withdrawals: AffiliateWithdrawal[];
  registerAffiliate: (data: Omit<Affiliate, "id" | "code" | "status" | "joinDate" | "totalEarnings" | "totalSales" | "balance">) => Affiliate;
  updateAffiliateStatus: (id: string, status: Affiliate["status"]) => void;
  updateAffiliateCommissionRate: (id: string, rate: number) => void;
  getAffiliateByCode: (code: string) => Affiliate | undefined;
  getAffiliateById: (id: string) => Affiliate | undefined;
  validateReferral: (referralId: string) => void;
  markReferralPaid: (referralId: string) => void;
  requestWithdrawal: (affiliateId: string, amount: number, method: AffiliateWithdrawal["method"], phoneNumber: string) => void;
  approveWithdrawal: (withdrawalId: string) => void;
  getReferralsByAffiliate: (affiliateId: string) => AffiliateReferral[];
  getWithdrawalsByAffiliate: (affiliateId: string) => AffiliateWithdrawal[];
  affiliateStats: {
    totalAffiliates: number;
    activeAffiliates: number;
    totalCommissionsPaid: number;
    totalCommissionsPending: number;
    totalSalesViaAffiliation: number;
  };
  // Utilitaire commission produit
  calcProductCommission: (product: Product, affiliateDefaultRate?: number) => number;
  calcProductCommissionRate: (product: Product, affiliateDefaultRate?: number) => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

// Helper – génère un code unique basé sur le nom + aléatoire
function generateCode(name: string): string {
  const base = name
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z]/g, "")
    .slice(0, 4);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${base}${rand}`;
}

// ── Calcule la commission d'un produit pour un affilié ─────────────────────────
function calcProductCommission(product: Product, affiliateDefaultRate: number = 10): number {
  // Commission fixe FCFA → priorité absolue
  if (product.commissionFixed && product.commissionFixed > 0) {
    return product.commissionFixed;
  }
  // Taux du produit ou taux par défaut de l'affilié
  const rate = product.commissionRate ?? affiliateDefaultRate;
  return Math.round(product.price * (rate / 100));
}

function calcProductCommissionRate(product: Product, affiliateDefaultRate: number = 10): number {
  if (product.commissionFixed && product.commissionFixed > 0) {
    return Math.round((product.commissionFixed / product.price) * 1000) / 10;
  }
  return product.commissionRate ?? affiliateDefaultRate;
}

// ── Calcule les lignes de commission par produit pour une commande ─────────────
function buildProductLines(
  items: CartItem[],
  affiliate: Affiliate
): { lines: CommissionProductLine[]; totalCommission: number } {
  let totalCommission = 0;
  const lines: CommissionProductLine[] = items.map((item) => {
    const isFixed = !!(item.product.commissionFixed && item.product.commissionFixed > 0);
    const unitCommission = calcProductCommission(item.product, affiliate.commissionRate);
    const lineCommission = unitCommission * item.quantity;
    const rate = calcProductCommissionRate(item.product, affiliate.commissionRate);
    totalCommission += lineCommission;
    return {
      productId: item.product.id,
      productName: item.product.name,
      affiliateRef: item.product.affiliateRef ?? `REF-${item.product.id}`,
      quantity: item.quantity,
      unitPrice: item.product.price,
      commissionRate: rate,
      commissionAmount: lineCommission,
      isFixedRate: isFixed,
    };
  });
  return { lines, totalCommission };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // ── Products ──────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("sb_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // ── Cart ──────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("sb_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Orders ────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("sb_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Affiliation ───────────────────────────────────────────────
  const [affiliates, setAffiliates] = useState<Affiliate[]>(() => {
    const saved = localStorage.getItem("sb_affiliates");
    return saved ? JSON.parse(saved) : [];
  });

  const [referrals, setReferrals] = useState<AffiliateReferral[]>(() => {
    const saved = localStorage.getItem("sb_referrals");
    return saved ? JSON.parse(saved) : [];
  });

  const [withdrawals, setWithdrawals] = useState<AffiliateWithdrawal[]>(() => {
    const saved = localStorage.getItem("sb_withdrawals");
    return saved ? JSON.parse(saved) : [];
  });

  // ── Persist ───────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("sb_products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("sb_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("sb_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("sb_affiliates", JSON.stringify(affiliates)); }, [affiliates]);
  useEffect(() => { localStorage.setItem("sb_referrals", JSON.stringify(referrals)); }, [referrals]);
  useEffect(() => { localStorage.setItem("sb_withdrawals", JSON.stringify(withdrawals)); }, [withdrawals]);

  // ── Cart Methods ──────────────────────────────────────────────
  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, size }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId, size); return; }
    setCart((prev) =>
      prev.map((i) => i.product.id === productId && i.size === size ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Product Methods ───────────────────────────────────────────
  const addProduct = (product: Omit<Product, "id">) => {
    setProducts((prev) => [{ ...product, id: Date.now().toString() }, ...prev]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Order Methods ─────────────────────────────────────────────
  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: "ORD-" + Date.now(),
      date: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Si commande avec code affilié → créer un référral pending avec détail par produit
    if (order.affiliateCode) {
      const affiliate = affiliates.find(
        (a) => a.code === order.affiliateCode && a.status === "active"
      );
      if (affiliate) {
        // Calculer commission produit par produit
        const { lines, totalCommission } = buildProductLines(order.items, affiliate);

        const newReferral: AffiliateReferral = {
          id: "REF-" + Date.now(),
          affiliateId: affiliate.id,
          affiliateCode: affiliate.code,
          orderId: newOrder.id,
          orderTotal: newOrder.total,
          commissionAmount: totalCommission,
          date: new Date().toISOString(),
          status: "pending",
          customerPhone: order.customerPhone,
          productLines: lines,
        };
        setReferrals((prev) => [newReferral, ...prev]);

        // Mettre à jour le total des ventes de l'affilié
        setAffiliates((prev) =>
          prev.map((a) =>
            a.id === affiliate.id
              ? { ...a, totalSales: a.totalSales + newOrder.total }
              : a
          )
        );
      }
    }
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ── Affiliation Methods ───────────────────────────────────────
  const registerAffiliate = (
    data: Omit<Affiliate, "id" | "code" | "status" | "joinDate" | "totalEarnings" | "totalSales" | "balance">
  ): Affiliate => {
    const newAffiliate: Affiliate = {
      ...data,
      id: "AFF-" + Date.now(),
      code: generateCode(data.name),
      status: "pending",
      joinDate: new Date().toISOString(),
      totalEarnings: 0,
      totalSales: 0,
      balance: 0,
    };
    setAffiliates((prev) => [newAffiliate, ...prev]);
    return newAffiliate;
  };

  const updateAffiliateStatus = (id: string, status: Affiliate["status"]) => {
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const updateAffiliateCommissionRate = (id: string, rate: number) => {
    setAffiliates((prev) =>
      prev.map((a) => (a.id === id ? { ...a, commissionRate: rate } : a))
    );
  };

  const getAffiliateByCode = (code: string) =>
    affiliates.find((a) => a.code === code);

  const getAffiliateById = (id: string) =>
    affiliates.find((a) => a.id === id);

  const validateReferral = (referralId: string) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== referralId || r.status !== "pending") return r;
        // Ajouter la commission au solde de l'affilié
        setAffiliates((affs) =>
          affs.map((a) =>
            a.id === r.affiliateId
              ? {
                  ...a,
                  balance: a.balance + r.commissionAmount,
                  totalEarnings: a.totalEarnings + r.commissionAmount,
                }
              : a
          )
        );
        return { ...r, status: "validated" as const };
      })
    );
  };

  const markReferralPaid = (referralId: string) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId ? { ...r, status: "paid" as const } : r
      )
    );
  };

  const requestWithdrawal = (
    affiliateId: string,
    amount: number,
    method: AffiliateWithdrawal["method"],
    phoneNumber: string
  ) => {
    const affiliate = affiliates.find((a) => a.id === affiliateId);
    if (!affiliate || affiliate.balance < amount) return;
    const newWithdrawal: AffiliateWithdrawal = {
      id: "WIT-" + Date.now(),
      affiliateId,
      amount,
      date: new Date().toISOString(),
      status: "pending",
      method,
      phoneNumber,
    };
    setWithdrawals((prev) => [newWithdrawal, ...prev]);
    setAffiliates((prev) =>
      prev.map((a) =>
        a.id === affiliateId ? { ...a, balance: a.balance - amount } : a
      )
    );
  };

  const approveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId ? { ...w, status: "paid" as const } : w
      )
    );
  };

  const getReferralsByAffiliate = (affiliateId: string) =>
    referrals.filter((r) => r.affiliateId === affiliateId);

  const getWithdrawalsByAffiliate = (affiliateId: string) =>
    withdrawals.filter((w) => w.affiliateId === affiliateId);

  // ── Computed Stats ─────────────────────────────────────────────
  const affiliateStats = {
    totalAffiliates: affiliates.length,
    activeAffiliates: affiliates.filter((a) => a.status === "active").length,
    totalCommissionsPaid: referrals
      .filter((r) => r.status === "paid")
      .reduce((s, r) => s + r.commissionAmount, 0),
    totalCommissionsPending: referrals
      .filter((r) => r.status === "pending" || r.status === "validated")
      .reduce((s, r) => s + r.commissionAmount, 0),
    totalSalesViaAffiliation: referrals.reduce((s, r) => s + r.orderTotal, 0),
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        affiliates,
        referrals,
        withdrawals,
        registerAffiliate,
        updateAffiliateStatus,
        updateAffiliateCommissionRate,
        getAffiliateByCode,
        getAffiliateById,
        validateReferral,
        markReferralPaid,
        requestWithdrawal,
        approveWithdrawal,
        getReferralsByAffiliate,
        getWithdrawalsByAffiliate,
        affiliateStats,
        calcProductCommission,
        calcProductCommissionRate,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

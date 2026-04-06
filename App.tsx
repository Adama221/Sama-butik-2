import { HashRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Affiliation from "./pages/Affiliation";
import AdminAffiliation from "./pages/AdminAffiliation";
import Login from "./pages/Login";
import WhatsAppFloat from "./components/WhatsAppFloat";

// Capte le ?ref=CODE dans l'URL et le stocke en session
function AffiliateTracker() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");
  if (refCode) {
    sessionStorage.setItem("sb_ref", refCode.toUpperCase());
  }
  return null;
}

// Layout principal (avec Navbar + Footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <AffiliateTracker />
      <Routes>
        {/* ── Page de connexion (sans Navbar/Footer) ── */}
        <Route path="/login" element={<Login />} />

        {/* ── Pages admin protégées (sans Footer public) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <Admin />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/affiliation"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <AdminAffiliation />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* ── Pages publiques ── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/boutique" element={<PublicLayout><Shop /></PublicLayout>} />
        <Route path="/produit/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/panier" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/confirmation" element={<OrderConfirmation />} />
        <Route path="/a-propos" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/affiliation" element={<PublicLayout><Affiliation /></PublicLayout>} />

        {/* ── 404 → Accueil ── */}
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </AuthProvider>
    </HashRouter>
  );
}

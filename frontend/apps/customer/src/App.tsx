import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { Navbar } from "./components/navbar/Navbar";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { SignUpModal } from "./components/SignUpModal";
import { LiveChatWidget } from "./components/LiveChatWidget";
import { DepositPage } from "./pages/DepositPage";
import { HomePage } from "./pages/HomePage";
import { PaymentHistoryPage } from "./pages/PaymentHistoryPage";
import { DepositSuccessPage } from "./pages/DepositSuccessPage";
import { WithdrawPage } from "./pages/WithdrawPage";
import { useAuthStore } from "./store/auth.store";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-12 text-center max-w-xl mx-auto mt-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">{title} Portal</h1>
      <p className="text-zinc-400 text-sm">
        This section is currently under development.
      </p>
    </div>
  );
}

export function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-slate-100 font-sans selection:bg-red-600 selection:text-white pb-16">
        <Toaster position="bottom-right" richColors />

        {/* Navbar now handles its own auth state via useAuthStore */}
        <Navbar
          onLoginClick={() => setIsLoginOpen(true)}
          onSignUpClick={() => setIsSignUpOpen(true)}
        />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/deposit-success" element={<DepositSuccessPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/history" element={<PaymentHistoryPage />} />
            <Route
              path="/promotion"
              element={<PlaceholderPage title="Promotion" />}
            />
            <Route
              path="/more"
              element={<PlaceholderPage title="More Options" />}
            />
          </Routes>
        </main>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToSignUp={() => {
            setIsLoginOpen(false);
            setIsSignUpOpen(true);
          }}
        />

        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
          onSwitchToLogin={() => {
            setIsSignUpOpen(false);
            setIsLoginOpen(true);
          }}
        />

        <Footer />
        <LiveChatWidget />
      </div>
    </Router>
  );
}

export default App;

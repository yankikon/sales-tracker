import React, { useMemo, useState } from "react";
import { Building2, Home, Settings, Users, Receipt, Boxes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Executives } from "./pages/Executives";
import { Sales } from "./pages/Sales";
import { SettingsPage } from "./pages/Settings";
import { UnderPerfCard } from "./components/UnderPerfCard";
import { InventoryPage } from "./pages/Inventory";
import { useStore, ThemeCtx } from "./context/Store";
import { useAuth } from "./context/Auth";
import { SignIn } from "./pages/SignIn";

const NAV: Array<{ key: Route; label: string; icon: LucideIcon }> = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "executives", label: "Executives", icon: Users },
  { key: "sales", label: "Sales", icon: Receipt },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "settings", label: "Settings", icon: Settings },
];
export type Route = "dashboard" | "executives" | "sales" | "inventory" | "settings";

export default function App(): JSX.Element {
  const { state } = useStore();
  const { user, signOutUser, loading } = useAuth();
  const [route, setRoute] = useState<Route>("dashboard");
  const theme = "light";
  const ctxTheme = useMemo(() => theme, [theme]);

  if (!user && !loading) {
    return <SignIn />;
  }

  return (
    <ThemeCtx.Provider value={ctxTheme}>
      <div className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            {state.business.logo ? (
              <img 
                src={state.business.logo} 
                alt="Business Logo" 
                className="w-8 h-8 object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-6 h-6 text-emerald-600" />
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-900">{state.business.name || "Sales Executive Performance Tracker"}</h1>
              {state.business.address && <p className="text-xs text-slate-600">{state.business.address}</p>}
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 truncate max-w-[140px]">{user.email || user.displayName || "Signed in"}</span>
                <button 
                  onClick={signOutUser} 
                  className="inline-flex items-center gap-2 text-xs border border-slate-300 rounded-xl px-2 py-1 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-6">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <nav className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
              {NAV.map((n) => (
                <button 
                  key={n.key} 
                  onClick={() => setRoute(n.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left ${
                    route === n.key 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <n.icon className={`w-4 h-4 ${route === n.key ? "text-emerald-600" : "text-slate-500"}`} />
                  <span className="text-sm">{n.label}</span>
                </button>
              ))}
            </nav>
            <UnderPerfCard className="mt-4" />
          </aside>
          <section className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
            {route === "dashboard" && <Dashboard />}
            {route === "executives" && <Executives />}
            {route === "sales" && <Sales />}
            {route === "inventory" && <InventoryPage />}
            {route === "settings" && <SettingsPage />}
          </section>
        </main>

        <footer className="text-center text-xs text-slate-600 py-6">© {new Date().getFullYear()} Sales Tracker – Local demo build</footer>
      </div>
    </ThemeCtx.Provider>
  );
}

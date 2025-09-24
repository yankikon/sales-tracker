import React, { useMemo, useState } from "react";
import { Building2, Home, Settings, Users, Receipt, Moon, Sun, Boxes } from "lucide-react";
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
import { colors } from "./lib/colors";

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
  const [dark, setDark] = useState(false);
  const theme = dark ? "dark" : "light";
  const ctxTheme = useMemo(() => theme, [theme]);

  if (!user && !loading) {
    return <SignIn />;
  }

  return (
    <ThemeCtx.Provider value={ctxTheme}>
      <div style={{ backgroundColor: colors.background, color: colors.foreground }} className="min-h-screen">
        <header style={{ backgroundColor: colors.card, borderColor: colors.border }} className="sticky top-0 z-20 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            {state.business.logo ? (
              <img 
                src={state.business.logo} 
                alt="Business Logo" 
                className="w-8 h-8 object-cover rounded-lg"
              />
            ) : (
              <Building2 className="w-6 h-6" style={{ color: colors.primary }} />
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold" style={{ color: colors.foreground }}>{state.business.name || "Sales Executive Performance Tracker"}</h1>
              {state.business.address && <p className="text-xs" style={{ color: colors.mutedForeground }}>{state.business.address}</p>}
            </div>
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-xs truncate max-w-[140px]" style={{ color: colors.mutedForeground }}>{user.email || user.displayName || "Signed in"}</span>
                <button 
                  onClick={signOutUser} 
                  className="inline-flex items-center gap-2 text-xs border rounded-xl px-2 py-1"
                  style={{ 
                    backgroundColor: colors.surface, 
                    borderColor: colors.border, 
                    color: colors.foreground 
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
            <button 
              onClick={() => setDark(!dark)} 
              className="inline-flex items-center gap-2 text-xs border rounded-xl px-2 py-1"
              style={{ 
                backgroundColor: colors.surface, 
                borderColor: colors.border, 
                color: colors.foreground 
              }}
            >
              {dark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
              {dark ? "Light" : "Dark"} Mode
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto grid grid-cols-12 gap-4 px-4 py-6">
          <aside className="col-span-12 md:col-span-3 lg:col-span-2">
            <nav style={{ backgroundColor: colors.card, borderColor: colors.border }} className="border rounded-2xl p-2">
              {NAV.map((n) => (
                <button 
                  key={n.key} 
                  onClick={() => setRoute(n.key)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left"
                  style={{ 
                    backgroundColor: route === n.key ? colors.accent : 'transparent',
                    color: colors.foreground
                  }}
                  onMouseEnter={(e) => {
                    if (route !== n.key) {
                      e.currentTarget.style.backgroundColor = colors.muted;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (route !== n.key) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <n.icon className="w-4 h-4" style={{ color: route === n.key ? colors.primary : colors.mutedForeground }} />
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

        <footer className="text-center text-xs py-6" style={{ color: colors.mutedForeground }}>© {new Date().getFullYear()} Sales Tracker – Local demo build</footer>
      </div>
    </ThemeCtx.Provider>
  );
}

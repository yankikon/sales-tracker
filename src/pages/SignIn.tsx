import React, { useState } from "react";
import { useAuth } from "../context/Auth";

export function SignIn(): JSX.Element {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err?.message || "Failed");
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-lg font-semibold mb-4 text-slate-900">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-slate-600">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder-slate-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs text-slate-600">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-900 placeholder-slate-500" 
              required 
            />
          </div>
          <button 
            disabled={loading} 
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <div className="my-3 text-center text-xs text-slate-500">or</div>
        <button 
          onClick={handleGoogle} 
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        >
          Continue with Google
        </button>
        <div className="mt-4 text-xs text-center">
          {mode === "signin" ? (
            <button onClick={() => setMode("signup")} className="underline text-slate-600 hover:text-slate-900">Create an account</button>
          ) : (
            <button onClick={() => setMode("signin")} className="underline text-slate-600 hover:text-slate-900">Have an account? Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}



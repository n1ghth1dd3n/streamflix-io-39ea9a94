import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

function safeNext(next: string): string {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — StreamFlix" },
      { name: "description", content: "Sign in or create a StreamFlix account to stream movies and connect apps." },
      { property: "og:title", content: "Sign in — StreamFlix" },
      { property: "og:description", content: "Sign in or create a StreamFlix account to stream movies and connect apps." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search["next"] === "string" ? (search["next"] as string) : "/",
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const target = safeNext(next);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.assign(target);
    });
  }, [target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + target },
      });
      setBusy(false);
      setMessage(error ? error.message : "Check your email to confirm your account.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setMessage(error.message);
    window.location.assign(target);
  }

  async function oauth(provider: "google" | "apple") {
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin + target,
    });
    if (result.error) return setMessage(`${provider === "apple" ? "Apple" : "Google"} sign-in failed.`);
    if (result.redirected) return;
    window.location.assign(target);
  }


  return (
    <main style={{ background: "#141414", color: "white", minHeight: "100vh", fontFamily: "Arial, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1c1c1c", padding: 32, borderRadius: 10, width: "100%", maxWidth: 380 }}>
        <div style={{ color: "#E50914", fontSize: "1.8rem", fontWeight: "bold", marginBottom: 20 }}>StreamFlix</div>
        <h1 style={{ fontSize: "1.3rem", marginBottom: 16 }}>{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <input type="email" required placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: 10, borderRadius: 5, border: "none" }} />
          <input type="password" required minLength={6} placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 10, borderRadius: 5, border: "none" }} />
          <button type="submit" disabled={busy} style={{ background: "#E50914", color: "white", border: "none", padding: 12, borderRadius: 5, cursor: "pointer" }}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <button onClick={() => oauth("google")} style={{ width: "100%", marginTop: 12, background: "#333", color: "white", border: "none", padding: 12, borderRadius: 5, cursor: "pointer" }}>
          Continue with Google
        </button>
        <button onClick={() => oauth("apple")} style={{ width: "100%", marginTop: 8, background: "#000", color: "white", border: "1px solid #444", padding: 12, borderRadius: 5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
          Continue with Apple
        </button>
        {message && <p role="alert" style={{ marginTop: 12, color: "#f5a" }}>{message}</p>}


        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} style={{ marginTop: 16, background: "none", border: "none", color: "#aaa", cursor: "pointer" }}>
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
        <button onClick={() => navigate({ to: "/", search: { q: "" } })} style={{ marginTop: 8, background: "none", border: "none", color: "#666", cursor: "pointer", display: "block" }}>
          Back to browsing
        </button>
      </div>
    </main>
  );
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthResult = {
  client?: { name?: string; client_id?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
  scope?: string;
  redirect_uri?: string;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthResult | null; error: Error | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: Error | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: Error | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  // Browser-only: the session lives in localStorage, absent during SSR.
  ssr: false,
  head: () => ({
    meta: [
      { title: "Authorize app — StreamFlix" },
      { name: "description", content: "Approve or deny an app requesting access to your StreamFlix account." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s["authorization_id"] === "string" ? (s["authorization_id"] as string) : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { next: location.pathname + location.searchStr } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  errorComponent: ({ error }) => (
    <main style={shell}>
      <p role="alert">Could not load this authorization request: {String((error as Error)?.message ?? error)}</p>
    </main>
  ),
  component: Consent,
});

const shell: React.CSSProperties = {
  background: "#141414",
  color: "white",
  minHeight: "100vh",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main style={shell}>
      <div style={{ background: "#1c1c1c", padding: 32, borderRadius: 10, width: "100%", maxWidth: 420 }}>
        <div style={{ color: "#E50914", fontSize: "1.6rem", fontWeight: "bold", marginBottom: 16 }}>StreamFlix</div>
        <h1 style={{ fontSize: "1.3rem", marginBottom: 12 }}>Connect {clientName} to your account</h1>
        <p style={{ color: "#bbb", marginBottom: 8 }}>
          {clientName} will be able to use StreamFlix&apos;s movie tools while you are signed in.
        </p>
        {details?.redirect_uri && (
          <p style={{ color: "#777", fontSize: "0.85rem", marginBottom: 8 }}>Redirects to {details.redirect_uri}</p>
        )}
        <p style={{ color: "#777", fontSize: "0.85rem", marginBottom: 20 }}>
          This does not bypass StreamFlix&apos;s permissions or backend policies.
        </p>
        {error && <p role="alert" style={{ color: "#f5a", marginBottom: 12 }}>{error}</p>}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            style={{ flex: 1, background: "#E50914", color: "white", border: "none", padding: 12, borderRadius: 5, cursor: "pointer" }}
          >
            Approve
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            style={{ flex: 1, background: "#333", color: "white", border: "none", padding: 12, borderRadius: 5, cursor: "pointer" }}
          >
            Cancel connection
          </button>
        </div>
      </div>
    </main>
  );
}

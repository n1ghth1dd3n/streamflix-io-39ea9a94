import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getHomeFeed, searchMovies, type TmdbMovie, type GenreRow } from "@/lib/tmdb.functions";

type HomeFeed = { featured: TmdbMovie | null; trending: TmdbMovie[]; rows: GenreRow[] };
import { TMDB_IMAGE } from "@/lib/streams";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamFlix — Stream Trending Movies" },
      { name: "description", content: "Browse trending movies by genre, search thousands of titles, and stream instantly on StreamFlix." },
      { property: "og:title", content: "StreamFlix — Stream Trending Movies" },
      { property: "og:description", content: "Browse trending movies by genre, search thousands of titles, and stream instantly on StreamFlix." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({ q: (search["q"] as string) || "" }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ deps }) => {
    if (deps.q.trim()) {
      const results: TmdbMovie[] = await searchMovies({ data: { query: deps.q } });
      return { results, feed: null as HomeFeed | null };
    }
    const feed: HomeFeed = await getHomeFeed();
    return { results: null as TmdbMovie[] | null, feed };
  },
  errorComponent: ({ error }) => (
    <div role="alert" style={{ background: "#141414", color: "white", minHeight: "100vh", padding: 40 }}>
      Couldn't load movies: {error.message}
    </div>
  ),
  notFoundComponent: () => <div>No movies found.</div>,
  component: HomePage,
});

function Poster({ movie, onPlay }: { movie: TmdbMovie; onPlay: (id: number) => void }) {
  return (
    <div
      style={{ background: "#222", borderRadius: 10, overflow: "hidden", transition: "0.3s", cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onClick={() => onPlay(movie.id)}
    >
      <img
        src={TMDB_IMAGE(movie.poster_path)}
        alt={`${movie.title} poster`}
        loading="lazy"
        style={{ width: "100%", aspectRatio: "2 / 3", objectFit: "cover", display: "block" }}
      />
      <h3 style={{ padding: 10, fontSize: "0.95rem" }}>{movie.title}</h3>
    </div>
  );
}

function HomePage() {
  const { results, feed } = Route.useLoaderData();
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(q);

  useEffect(() => {
    const t = setTimeout(() => {
      if (input !== q) navigate({ to: "/", search: { q: input }, replace: true });
    }, 400);
    return () => clearTimeout(t);
  }, [input, q, navigate]);

  const play = (id: number) => navigate({ to: "/watch/$movieId", params: { movieId: String(id) } });
  const featured = feed?.featured;

  return (
    <div style={{ background: "#141414", color: "white", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, background: "#000" }}>
        <div style={{ color: "#E50914", fontSize: "2rem", fontWeight: "bold" }}>StreamFlix</div>
        <input
          type="text"
          placeholder="Search movies..."
          aria-label="Search movies"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: 10, border: "none", borderRadius: 5, width: 250 }}
        />
      </header>

      {results ? (
        <section style={{ padding: 20 }}>
          <h1 style={{ marginBottom: 15 }}>Results for “{q}”</h1>
          {results.length === 0 ? (
            <p style={{ color: "#888" }}>No movies matched your search.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 15 }}>
              {results.map((m) => (
                <Poster key={m.id} movie={m} onPlay={play} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {featured && (
            <div
              style={{
                height: "60vh",
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url('${TMDB_IMAGE(featured.backdrop_path, "original")}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                padding: 50,
              }}
            >
              <div style={{ maxWidth: 560 }}>
                <h1 style={{ fontSize: "3rem", marginBottom: 10 }}>{featured.title}</h1>
                <p style={{ marginBottom: 20, color: "#ddd" }}>{featured.overview}</p>
                <button
                  onClick={() => play(featured.id)}
                  style={{ background: "#E50914", color: "white", border: "none", padding: "12px 24px", borderRadius: 5, cursor: "pointer" }}
                >
                  Watch Now
                </button>
              </div>
            </div>
          )}

          {[{ id: 0, name: "Trending Now", movies: feed?.trending ?? [] }, ...(feed?.rows ?? [])].map((row) => (
            <section key={row.name} style={{ padding: "10px 20px 20px" }}>
              <h2 style={{ marginBottom: 12 }}>{row.name}</h2>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                {row.movies.map((m) => (
                  <div key={m.id} style={{ flex: "0 0 180px" }}>
                    <Poster movie={m} onPlay={play} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <footer style={{ textAlign: "center", padding: 20, marginTop: 30, color: "#888" }}>© 2026 StreamFlix</footer>
    </div>
  );
}

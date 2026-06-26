import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { MOVIES, FEATURED } from "@/lib/movies";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamFlix" },
      { name: "description", content: "Watch the latest blockbuster movies and TV shows on StreamFlix." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [query, setQuery] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const navigate = useNavigate();

  const filtered = useMemo(
    () => MOVIES.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const play = (id: string) => navigate({ to: "/watch/$movieId", params: { movieId: id } });

  const addToWatchlist = (title: string) => {
    if (!watchlist.includes(title)) {
      setWatchlist([...watchlist, title]);
      alert(`${title} added to Watchlist!`);
    }
  };

  return (
    <div style={{ background: "#141414", color: "white", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 20, background: "#000" }}>
        <div style={{ color: "#E50914", fontSize: "2rem", fontWeight: "bold" }}>StreamFlix</div>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, border: "none", borderRadius: 5, width: 250 }}
        />
      </header>

      <div
        style={{
          height: "60vh",
          backgroundImage: "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          padding: 50,
        }}
      >
        <div style={{ maxWidth: 500 }}>
          <h1 style={{ fontSize: "3rem", marginBottom: 10 }}>{FEATURED.title}</h1>
          <p style={{ marginBottom: 20 }}>Watch the latest blockbuster movies and TV shows.</p>
          <button
            onClick={() => play(FEATURED.id)}
            style={{ background: "#E50914", color: "white", border: "none", padding: "12px 24px", borderRadius: 5, cursor: "pointer" }}
          >
            Watch Now
          </button>
        </div>
      </div>

      <section style={{ padding: 20 }}>
        <h2>Trending Now</h2>
        <br />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 15 }}>
          {filtered.map((movie) => (
            <div
              key={movie.id}
              style={{ background: "#222", borderRadius: 10, overflow: "hidden", transition: "0.3s", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={movie.image}
                alt={movie.title}
                onClick={() => play(movie.id)}
                style={{ width: "100%", height: 250, objectFit: "cover" }}
              />
              <h3 onClick={() => play(movie.id)} style={{ padding: 10 }}>{movie.title}</h3>
              <button
                onClick={() => addToWatchlist(movie.title)}
                style={{ width: "100%", background: "#333", color: "white", border: "none", padding: "12px 24px", cursor: "pointer" }}
              >
                + Watchlist
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: 20, marginTop: 30, color: "#888" }}>© 2026 StreamFlix</footer>
    </div>
  );
}

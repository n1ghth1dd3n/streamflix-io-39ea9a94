import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StreamFlix" },
      { name: "description", content: "Watch the latest blockbuster movies and TV shows on StreamFlix." },
    ],
  }),
  component: HomePage,
});

type Movie = { title: string; image: string };

const MOVIES: Movie[] = [
  { title: "Action Hero", image: "https://picsum.photos/300/450?random=1" },
  { title: "Space Adventure", image: "https://picsum.photos/300/450?random=2" },
  { title: "Mystery Night", image: "https://picsum.photos/300/450?random=3" },
  { title: "Fast Drive", image: "https://picsum.photos/300/450?random=4" },
  { title: "The Kingdom", image: "https://picsum.photos/300/450?random=5" },
  { title: "Future World", image: "https://picsum.photos/300/450?random=6" },
];

function HomePage() {
  const [query, setQuery] = useState("");
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const filtered = useMemo(
    () => MOVIES.filter((m) => m.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

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
          <h1 style={{ fontSize: "3rem", marginBottom: 10 }}>Featured Movie</h1>
          <p style={{ marginBottom: 20 }}>Watch the latest blockbuster movies and TV shows.</p>
          <button style={{ background: "#E50914", color: "white", border: "none", padding: "12px 24px", borderRadius: 5, cursor: "pointer" }}>
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
              key={movie.title}
              style={{ background: "#222", borderRadius: 10, overflow: "hidden", transition: "0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img src={movie.image} alt={movie.title} style={{ width: "100%", height: 250, objectFit: "cover" }} />
              <h3 style={{ padding: 10 }}>{movie.title}</h3>
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

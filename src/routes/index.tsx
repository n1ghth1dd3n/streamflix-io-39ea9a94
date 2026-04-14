import { createFileRoute } from "@tanstack/react-router";
import { getTrending, getPopular, getTopRated, getUpcoming } from "@/lib/tmdb.functions";
import { HeroBanner } from "@/components/HeroBanner";
import { MovieRow } from "@/components/MovieRow";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Streamflix — Stream Movies & TV" },
      { name: "description", content: "Discover and stream trending movies and TV shows on Streamflix." },
      { property: "og:title", content: "Streamflix — Stream Movies & TV" },
      { property: "og:description", content: "Discover and stream trending movies and TV shows on Streamflix." },
    ],
  }),
  loader: async () => {
    const [trending, popular, topRated, upcoming] = await Promise.all([
      getTrending(),
      getPopular(),
      getTopRated(),
      getUpcoming(),
    ]);
    return { trending, popular, topRated, upcoming };
  },
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center max-w-md px-4">
        <h1 className="font-display text-4xl text-netflix-red mb-4">STREAMFLIX</h1>
        <p className="text-muted-foreground mb-2">Something went wrong loading movies.</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function HomePage() {
  const { trending, popular, topRated, upcoming } = Route.useLoaderData();
  const heroMovie = trending[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {heroMovie && <HeroBanner movie={heroMovie} />}
      <div className="-mt-24 relative z-10 pb-16">
        <MovieRow title="Trending Now" movies={trending} />
        <MovieRow title="Popular on Streamflix" movies={popular} />
        <MovieRow title="Top Rated" movies={topRated} />
        <MovieRow title="Coming Soon" movies={upcoming} />
      </div>
    </div>
  );
}

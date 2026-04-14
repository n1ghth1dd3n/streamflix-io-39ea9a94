import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { useMyList } from "@/lib/my-list";

export const Route = createFileRoute("/my-list")({
  head: () => ({
    meta: [
      { title: "My List — Streamflix" },
      { name: "description", content: "Your saved movies and shows on Streamflix." },
    ],
  }),
  component: MyListPage,
});

function MyListPage() {
  const { list } = useMyList();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 px-4 md:px-12 pb-16">
        <h1 className="font-display text-4xl md:text-5xl tracking-wide mb-8">My List</h1>
        {list.length === 0 ? (
          <p className="text-muted-foreground text-lg">
            You haven't added anything to your list yet. Browse movies and click the + button to add them.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {list.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

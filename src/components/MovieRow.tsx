import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "@/lib/tmdb.functions";
import { MovieCard } from "./MovieCard";

export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <div className="relative group/row px-4 md:px-12 mb-8">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-full bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div ref={rowRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-1">
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-full bg-background/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Movie } from "@/lib/tmdb.functions";
import { posterUrl } from "@/lib/tmdb.functions";
import { useMyList } from "@/lib/my-list";

export function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  const { isInList, addToList, removeFromList } = useMyList();
  const inList = isInList(movie.id);
  const poster = posterUrl(movie.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex-shrink-0 w-[140px] md:w-[180px] rounded-md overflow-hidden cursor-pointer"
    >
      <Link to="/watch/$movieId" params={{ movieId: String(movie.id) }}>
        {poster ? (
          <img
            src={poster}
            alt={movie.title || movie.name || "Movie"}
            className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-surface flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </Link>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-1.5 mb-1">
          <Link
            to="/watch/$movieId"
            params={{ movieId: String(movie.id) }}
            className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center hover:bg-foreground/80 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-background text-background" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              inList ? removeFromList(movie.id) : addToList(movie);
            }}
            className="w-7 h-7 rounded-full border border-muted-foreground/50 flex items-center justify-center hover:border-foreground transition-colors"
          >
            {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-xs font-medium truncate">{movie.title || movie.name}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="text-primary font-semibold">{Math.round((movie.vote_average || 0) * 10)}% Match</span>
        </div>
      </div>
    </motion.div>
  );
}

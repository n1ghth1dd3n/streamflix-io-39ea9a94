import { motion } from "framer-motion";
import { Play, Plus, Check, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Movie } from "@/lib/tmdb.functions";
import { backdropUrl } from "@/lib/tmdb.functions";
import { useMyList } from "@/lib/my-list";

export function HeroBanner({ movie }: { movie: Movie }) {
  const { isInList, addToList, removeFromList } = useMyList();
  const inList = isInList(movie.id);
  const bg = backdropUrl(movie.backdrop_path);

  return (
    <div className="relative w-full h-[85vh] min-h-[500px]">
      {bg && (
        <img
          src={bg}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="absolute bottom-[15%] left-4 md:left-12 max-w-xl z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl tracking-wide leading-none mb-4"
        >
          {movie.title || movie.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm md:text-base text-muted-foreground line-clamp-3 mb-6"
        >
          {movie.overview}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex items-center gap-3"
        >
          <Link
            to="/watch/$movieId"
            params={{ movieId: String(movie.id) }}
            className="flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-2.5 rounded-md hover:bg-foreground/80 transition-colors text-sm md:text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            Play
          </Link>
          <button
            onClick={() => inList ? removeFromList(movie.id) : addToList(movie)}
            className="flex items-center gap-2 bg-muted/60 backdrop-blur-sm text-foreground font-semibold px-5 py-2.5 rounded-md hover:bg-muted/80 transition-colors text-sm md:text-base"
          >
            {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            My List
          </button>
          <Link
            to="/watch/$movieId"
            params={{ movieId: String(movie.id) }}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-muted-foreground/50 hover:border-foreground transition-colors"
          >
            <Info className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

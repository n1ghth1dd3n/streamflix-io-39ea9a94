import { createServerFn } from "@tanstack/react-start";
import { tmdb, pick, GENRES, type TmdbMovie, type GenreRow } from "./tmdb-api";

export type { TmdbMovie, GenreRow };

export const getHomeFeed = createServerFn({ method: "GET" }).handler(async () => {
  const trending = await tmdb<{ results: TmdbMovie[] }>("/trending/movie/week", {
    language: "en-US",
  });

  const rows: GenreRow[] = await Promise.all(
    GENRES.map(async (g) => {
      const data = await tmdb<{ results: TmdbMovie[] }>("/discover/movie", {
        language: "en-US",
        sort_by: "popularity.desc",
        include_adult: "false",
        with_genres: String(g.id),
      });
      return { ...g, movies: data.results.slice(0, 14).map(pick) };
    }),
  );

  return {
    featured: trending.results[0] ? pick(trending.results[0]) : null,
    trending: trending.results.slice(0, 14).map(pick),
    rows,
  };
});

export const searchMovies = createServerFn({ method: "GET" })
  .inputValidator((data: { query: string }) => ({ query: String(data.query ?? "").slice(0, 100) }))
  .handler(async ({ data }) => {
    if (!data.query.trim()) return [] as TmdbMovie[];
    const res = await tmdb<{ results: TmdbMovie[] }>("/search/movie", {
      language: "en-US",
      include_adult: "false",
      query: data.query,
    });
    return res.results.slice(0, 24).map(pick);
  });

export const getMovie = createServerFn({ method: "GET" })
  .inputValidator((data: { id: number }) => ({ id: Number(data.id) }))
  .handler(async ({ data }) => {
    const m = await tmdb<TmdbMovie>(`/movie/${data.id}`, { language: "en-US" });
    return pick(m);
  });

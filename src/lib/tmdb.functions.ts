import { createServerFn } from "@tanstack/react-start";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

async function tmdbFetch(path: string) {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY not configured");
  const res = await fetch(`${TMDB_BASE}${path}${path.includes("?") ? "&" : "?"}api_key=${key}`);
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  genre_ids?: number[];
}

export const posterUrl = (path: string | null, size = "w342") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path: string | null, size = "original") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const getTrending = createServerFn({ method: "GET" }).handler(async () => {
  const data = await tmdbFetch("/trending/movie/week");
  return data.results as Movie[];
});

export const getPopular = createServerFn({ method: "GET" }).handler(async () => {
  const data = await tmdbFetch("/movie/popular");
  return data.results as Movie[];
});

export const getTopRated = createServerFn({ method: "GET" }).handler(async () => {
  const data = await tmdbFetch("/movie/top_rated");
  return data.results as Movie[];
});

export const getUpcoming = createServerFn({ method: "GET" }).handler(async () => {
  const data = await tmdbFetch("/movie/upcoming");
  return data.results as Movie[];
});

export const getMovieDetails = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const movie = await tmdbFetch(`/movie/${data.id}?append_to_response=videos,similar`);
    return movie;
  });

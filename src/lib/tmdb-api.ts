export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
};

export type GenreRow = { id: number; name: string; movies: TmdbMovie[] };

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
];

export async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = process.env["TMDB_API_KEY"];
  if (!key) throw new Error("TMDB_API_KEY is not configured");
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers: Record<string, string> = { accept: "application/json" };
  // Support both v4 read access tokens and v3 api keys.
  if (key.startsWith("ey")) headers["Authorization"] = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);

  const res = await fetch(url.toString(), { headers });
  if (res.status === 401) throw new Error("TMDB rejected the API key. Please add a valid TMDB API key.");
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return (await res.json()) as T;
}

export const pick = (m: TmdbMovie): TmdbMovie => ({
  id: m.id,
  title: m.title,
  overview: m.overview ?? "",
  poster_path: m.poster_path ?? null,
  backdrop_path: m.backdrop_path ?? null,
  vote_average: m.vote_average ?? 0,
  release_date: m.release_date ?? null,
});

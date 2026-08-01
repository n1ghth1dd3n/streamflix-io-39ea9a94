import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { tmdb, pick, GENRES, type TmdbMovie } from "../../tmdb-api";

export default defineTool({
  name: "list_genre_movies",
  title: "List movies by genre",
  description: "List popular Streamflix movies for one of the home page genre rows: Action, Comedy, Horror, Romance, or Sci-Fi.",
  inputSchema: {
    genre: z.enum(["Action", "Comedy", "Horror", "Romance", "Sci-Fi"]).describe("Genre row name."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ genre }) => {
    const match = GENRES.find((g) => g.name === genre);
    if (!match) {
      return { content: [{ type: "text" as const, text: `Unknown genre: ${genre}` }], isError: true };
    }
    const res = await tmdb<{ results: TmdbMovie[] }>("/discover/movie", {
      language: "en-US",
      sort_by: "popularity.desc",
      include_adult: "false",
      with_genres: String(match.id),
    });
    const movies = res.results.slice(0, 20).map(pick);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(movies) }],
      structuredContent: { genre, movies },
    };
  },
});

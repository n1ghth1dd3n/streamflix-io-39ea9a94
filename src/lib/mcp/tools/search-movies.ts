import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { tmdb, pick, type TmdbMovie } from "../../tmdb-api";

export default defineTool({
  name: "search_movies",
  title: "Search movies",
  description: "Search the Streamflix catalog (TMDB) for movies by title and return matching titles with their IDs.",
  inputSchema: {
    query: z.string().min(1).describe("Movie title or keywords to search for."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query }) => {
    const res = await tmdb<{ results: TmdbMovie[] }>("/search/movie", {
      language: "en-US",
      include_adult: "false",
      query,
    });
    const movies = res.results.slice(0, 20).map(pick);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(movies) }],
      structuredContent: { movies },
    };
  },
});

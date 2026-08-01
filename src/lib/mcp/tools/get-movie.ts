import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { tmdb, pick, type TmdbMovie } from "../../tmdb-api";

export default defineTool({
  name: "get_movie",
  title: "Get movie details",
  description: "Get details for one Streamflix movie by its TMDB id, plus the watch URL for streaming it in the app.",
  inputSchema: {
    id: z.number().int().positive().describe("TMDB movie id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ id }) => {
    const movie = pick(await tmdb<TmdbMovie>(`/movie/${id}`, { language: "en-US" }));
    const result = { ...movie, watch_path: `/watch/${movie.id}` };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
});

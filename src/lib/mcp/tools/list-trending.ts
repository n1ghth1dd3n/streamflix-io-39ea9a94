import { defineTool } from "@lovable.dev/mcp-js";
import { tmdb, pick, type TmdbMovie } from "../../tmdb-api";

export default defineTool({
  name: "list_trending",
  title: "List trending movies",
  description: "List the movies trending this week on Streamflix, in the same order the home page shows them.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    const res = await tmdb<{ results: TmdbMovie[] }>("/trending/movie/week", { language: "en-US" });
    const movies = res.results.slice(0, 20).map(pick);
    return {
      content: [{ type: "text" as const, text: JSON.stringify(movies) }],
      structuredContent: { movies },
    };
  },
});

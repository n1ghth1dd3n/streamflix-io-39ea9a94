import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchMoviesTool from "./tools/search-movies";
import listTrendingTool from "./tools/list-trending";
import listGenreMoviesTool from "./tools/list-genre-movies";
import getMovieTool from "./tools/get-movie";

// The OAuth issuer must be the direct auth host, not the published proxy URL.
const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "streamflix-dreams",
  title: "Streamflix Dreams",
  version: "0.1.0",
  instructions:
    "Tools for Streamflix, a movie streaming app. Use `search_movies` to find titles, `list_trending` for this week's trending movies, `list_genre_movies` for a genre row, and `get_movie` for details and the in-app watch path.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchMoviesTool, listTrendingTool, listGenreMoviesTool, getMovieTool],
});

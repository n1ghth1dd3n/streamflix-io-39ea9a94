import { createFileRoute } from "@tanstack/react-router";
import { getMovieDetails } from "@/lib/tmdb.functions";
import { VideoPlayer } from "@/components/VideoPlayer";

export const Route = createFileRoute("/watch/$movieId")({
  head: () => ({
    meta: [
      { title: "Now Playing — Streamflix" },
    ],
  }),
  loader: async ({ params }) => {
    const movie = await getMovieDetails({ data: { id: params.movieId } });
    return { movie };
  },
  component: WatchPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center bg-black text-foreground">
      <p>Could not load this title. {error.message}</p>
    </div>
  ),
});

function WatchPage() {
  const { movie } = Route.useLoaderData();

  // Check for a YouTube trailer key in videos
  const trailer = movie.videos?.results?.find(
    (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <VideoPlayer
      title={movie.title || movie.name || "Streamflix"}
      // HLS demo stream — in production, replace with actual content URL
    />
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/VideoPlayer";
import { getMovie } from "@/lib/tmdb.functions";
import { streamForMovie } from "@/lib/streams";

export const Route = createFileRoute("/watch/$movieId")({
  head: () => ({
    meta: [
      { title: "Watch — StreamFlix" },
      { name: "description", content: "Stream your selected movie in HD with HLS playback on StreamFlix." },
      { property: "og:title", content: "Watch — StreamFlix" },
      { property: "og:description", content: "Stream your selected movie in HD with HLS playback on StreamFlix." },
    ],
  }),
  loader: ({ params }) => getMovie({ data: { id: Number(params.movieId) } }),
  errorComponent: ({ error }) => (
    <div role="alert" style={{ background: "#000", color: "white", minHeight: "100vh", padding: 40 }}>
      Couldn't load this movie: {error.message}
    </div>
  ),
  notFoundComponent: () => <div>Movie not found.</div>,
  component: WatchPage,
});

function WatchPage() {
  const movie = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <VideoPlayer
      src={streamForMovie(movie.id)}
      title={movie.title}
      onBack={() => navigate({ to: "/" })}
    />
  );
}

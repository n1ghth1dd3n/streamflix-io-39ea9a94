import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VideoPlayer } from "@/components/VideoPlayer";
import { MOVIES } from "@/lib/movies";

export const Route = createFileRoute("/watch/$movieId")({
  head: () => ({ meta: [{ title: "Watch — StreamFlix" }] }),
  component: WatchPage,
});

function WatchPage() {
  const { movieId } = Route.useParams();
  const navigate = useNavigate();
  const movie = MOVIES.find((m) => m.id === movieId) ?? MOVIES[0];

  return (
    <VideoPlayer
      src={movie.hls}
      title={movie.title}
      onBack={() => navigate({ to: "/" })}
    />
  );
}

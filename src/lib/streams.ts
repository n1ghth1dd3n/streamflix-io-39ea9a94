// Public HLS test streams used as stand-in playback sources for TMDB titles.
const STREAMS = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
];

export function streamForMovie(id: number | string): string {
  const n = Number(id) || 0;
  return STREAMS[n % STREAMS.length];
}

export const TMDB_IMAGE = (path: string | null, size: "w500" | "original" = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.svg";

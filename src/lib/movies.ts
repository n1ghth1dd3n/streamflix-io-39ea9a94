export type Movie = {
  id: string;
  title: string;
  image: string;
  hls: string;
};

// Public HLS test streams
const TEARS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const BIPBOP = "https://test-streams.mux.dev/test_001/stream.m3u8";
const SINTEL = "https://test-streams.mux.dev/pts_shift/master.m3u8";

export const MOVIES: Movie[] = [
  { id: "1", title: "Action Hero", image: "https://picsum.photos/300/450?random=1", hls: TEARS },
  { id: "2", title: "Space Adventure", image: "https://picsum.photos/300/450?random=2", hls: SINTEL },
  { id: "3", title: "Mystery Night", image: "https://picsum.photos/300/450?random=3", hls: BIPBOP },
  { id: "4", title: "Fast Drive", image: "https://picsum.photos/300/450?random=4", hls: TEARS },
  { id: "5", title: "The Kingdom", image: "https://picsum.photos/300/450?random=5", hls: SINTEL },
  { id: "6", title: "Future World", image: "https://picsum.photos/300/450?random=6", hls: BIPBOP },
];

export const FEATURED = MOVIES[0];

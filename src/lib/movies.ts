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
 {
  title: "John Wick",
  year: 2014,
  image: "johnwick.jpg"
}

export const FEATURED = MOVIES[0];

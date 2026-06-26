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
 export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "John Wick",
    image: "johnwick.jpg",
    hls: TEARS,
  },
  {
    id: "2",
    title: "The Dark Knight",
    image: "darkknight.jpg",
    hls: BIPBOP,
  },
  {
    id: "3",
    title: "Inception",
    image: "inception.jpg",
    hls: SINTEL,
  },
  {
    id: "4",
    title: "Interstellar",
    image: "interstellar.jpg",
    hls: TEARS,
  },
  {
    id: "5",
    title: "Avatar",
    image: "avatar.jpg",
    hls: BIPBOP,
  }
];

export const FEATURED = MOVIES[0];
}

export const FEATURED = MOVIES[0];

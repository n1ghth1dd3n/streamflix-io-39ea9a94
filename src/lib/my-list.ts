import { useState, useEffect, useCallback } from "react";
import type { Movie } from "./tmdb.functions";

const STORAGE_KEY = "streamflix-my-list";

function getList(): Movie[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveList(list: Movie[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("mylist-change"));
}

export function useMyList() {
  const [list, setList] = useState<Movie[]>([]);

  useEffect(() => {
    setList(getList());
    const handler = () => setList(getList());
    window.addEventListener("mylist-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mylist-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const addToList = useCallback((movie: Movie) => {
    const current = getList();
    if (!current.find((m) => m.id === movie.id)) {
      saveList([...current, movie]);
    }
  }, []);

  const removeFromList = useCallback((movieId: number) => {
    saveList(getList().filter((m) => m.id !== movieId));
  }, []);

  const isInList = useCallback(
    (movieId: number) => list.some((m) => m.id === movieId),
    [list]
  );

  return { list, addToList, removeFromList, isInList };
}

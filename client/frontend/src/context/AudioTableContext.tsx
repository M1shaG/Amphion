import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Song } from "./../songsTable/types";
import { GetSongs } from "./../../wailsjs/go/main/App";
const SongsContext = createContext<SongsContextType | null>(null);

type SongsContextType = {
  songs: Song[];
  loadingSongs: boolean;
};

export function SongsProvider({ children }: { children: ReactNode }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoading] = useState(true);
  useEffect(() => {
    GetSongs()
      .then(setSongs)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SongsContext.Provider value={{ songs, loadingSongs }}>
      {children}
    </SongsContext.Provider>
  );
}

export const useSongTable = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error("NULL");
  }
  return context;
};

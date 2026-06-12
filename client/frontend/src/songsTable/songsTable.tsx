import { useEffect, useState } from "react";
import { GetSongs } from "../../wailsjs/go/main/App";
import placeholder1 from "./../assets/images/1.jpg";
import styles from "./songsTable.module.css";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useAudio } from "./../context/AudioContext";
import { Song } from "./types";

export default function SongsTable() {
  const { setAudioID } = useAudio();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    GetSongs()
      .then(setSongs)
      .catch((err) => setError(err?.message ?? "Failed to load songs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.status}>Loading songs...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <>
      <div className={styles.playlistDesc}>
        <img src={placeholder1} alt="" width="150px" height="150px" />
        <div className={styles.playlistDescName}>
          <div className={styles.playlistName}>Серега Пират Лучшее</div>
          <div className={styles.playlistInfo}>
            {songs.length} songs • TODO min
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table aria-label="Songs list">
          <thead>
            <tr>
              <th></th>
              <th>Author</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr key={song.song_id}>
                <td className={styles.btnCol}>
                  <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => setAudioID(song.song_id)}
                  >
                    <IconPlayerPlay size={16} /> Play
                  </button>
                </td>
                <td>{song.song_author}</td>
                <td>{song.song_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

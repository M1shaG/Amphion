import { useEffect, useState } from "react"
import { GetSongs } from "../../wailsjs/go/main/App";
import placeholder1 from './../assets/images/1.jpg'
import styles from './songsTable.module.css'
import { IconPlayerPlay, IconHeart, IconPlus } from '@tabler/icons-react';

interface Song {
    id: number;
    author: string;
    title: string;
}

export default function SongsTable() {
    const [songs, setSongs] = useState<Song[]>([]);

    useEffect(() => {
        GetSongs().then(setSongs).catch(console.error);
    }, [])

    console.log(songs)
    return (
        <>
            <div className={styles.playlistDesc}>
                <img src={placeholder1} alt="" width="150px" height="150px" />
                <div className={styles.playlistDescName}>
                    <div className={styles.playlistName}>Серега Пират Лучшее</div>
                    <div className={styles.playlistInfo}>2 songs • 24min</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Author</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song) => (
                        <tr key={song.id}>
                            <td className={styles.btnCol}>
                                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                                    <IconPlayerPlay size={16} /> Play
                                </button>
                            </td>
                            <td>{song.author}</td>
                            <td>{song.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

import placeholder1 from './../assets/images/1.jpg'
import placeholder2 from './../assets/images/2.jpg'
import placeholder3 from './../assets/images/3.jpg'
import styles from './playlists.module.css';


export default function playlists() {
    return <>
        <div className={styles.playlistElement}>
            <img src={placeholder1} alt="" width="55px" height="55px" />
            <div className={styles.playlistText}>
                <div className={styles.playlistName}>Серега Пират Лучшее</div>
                <div className={styles.playlistDescription}>Playlist</div>
            </div>
        </div>
        <div className={styles.playlistElement}>
            <img src={placeholder2} alt="" width="55px" height="55px" />
            <div className={styles.playlistText}>
                <div className={styles.playlistName}>Серега Пират Подборка</div>
                <div className={styles.playlistDescription}>Playlist</div>
            </div>
        </div>
        <div className={styles.playlistElement}>
            <img src={placeholder3} alt="" width="55px" height="55px" />
            <div className={styles.playlistText}>
                <div className={styles.playlistName}>Серега Пират Хиты</div>
                <div className={styles.playlistDescription}>Playlist</div>
            </div>
        </div>
    </>
}
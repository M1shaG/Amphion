import styles from './App.module.css';
import SongsTable from './songsTable/songsTable'
import Player from './player/player';
import Header from './header/header';
import Playlists from './playlists/playlists';
export default function App() {
    return (
        <div className={styles.Container}>
            <header className={styles.mainHeader}><Header /></header>
            <section className={styles.mainContainer}>
                <aside className={styles.mainSide}><Playlists /></aside>
                <div className={styles.mainContent}><SongsTable /></div>
            </section>
            <footer className={styles.mainFooter}><Player /></footer>
        </div>
    );
}
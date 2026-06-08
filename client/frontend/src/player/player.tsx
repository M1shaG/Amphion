// Player.tsx
import { useEffect, useRef, useState } from "react";
import {
    IconPlayerPlay, IconPlayerPause, IconPlayerSkipBack,
    IconPlayerSkipForward, IconArrowsShuffle, IconRepeat,
    IconHeart, IconVolume, IconVolume2, IconVolumeOff, IconList
} from '@tabler/icons-react';
import { GetMusic } from "../../wailsjs/go/main/App";
import styles from "./player.module.css";

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioUrl, setAudioUrl] = useState("");
    const [loading, setLoading] = useState(true);

    const [playing, setPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [volume, setVolume] = useState(80);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        GetMusic()
            .then((base64: string) => {
                setAudioUrl(`data:audio/ogg;base64,${base64}`);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        if (playing) audioRef.current.play();
        else audioRef.current.pause();
    }, [playing]);

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        if (repeat && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else {
            setPlaying(false);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setProgress(val);
        if (audioRef.current) {
            audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
        }
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = String(Math.floor(sec % 60)).padStart(2, "0");
        return `${m}:${s}`;
    };

    const VolumeIcon = () => {
        if (volume === 0) return <IconVolumeOff size={18} />;
        if (volume < 50) return <IconVolume2 size={18} />;
        return <IconVolume size={18} />;
    };

    if (loading) return <footer className={styles.player}><span className={styles.loading}>Loading...</span></footer>;

    return (
        <div className={styles.player}>
            <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
            />

            <div className={styles.trackInfo}>
                <div className={styles.cover}>
                    <IconList size={20} color="#565b66" />
                </div>
                <div>
                    <div className={styles.trackTitle}>Серега Пират</div>
                    <div className={styles.trackAuthor}>Солевар</div>
                </div>
                <button
                    onClick={() => setLiked(!liked)}
                    className={`${styles.likeBtn} ${liked ? styles.liked : ""}`}
                    aria-label="Like"
                >
                    <IconHeart size={18} />
                </button>
            </div>

            <div className={styles.controls}>
                <div className={styles.controlsBtns}>
                    <button
                        onClick={() => setShuffle(!shuffle)}
                        className={`${styles.ctrlBtn} ${shuffle ? styles.active : ""}`}
                        aria-label="Shuffle"
                    >
                        <IconArrowsShuffle size={16} />
                    </button>
                    <button className={styles.ctrlBtn} aria-label="Previous">
                        <IconPlayerSkipBack size={18} />
                    </button>
                    <button
                        onClick={() => setPlaying(!playing)}
                        className={styles.playBtn}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                    </button>
                    <button className={styles.ctrlBtn} aria-label="Next">
                        <IconPlayerSkipForward size={18} />
                    </button>
                    <button
                        onClick={() => setRepeat(!repeat)}
                        className={`${styles.ctrlBtn} ${repeat ? styles.active : ""}`}
                        aria-label="Repeat"
                    >
                        <IconRepeat size={16} />
                    </button>
                </div>
                <div className={styles.progressRow}>
                    <span className={styles.time}>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress}
                        onChange={handleProgressChange}
                        className={styles.progressSlider}
                    />
                    <span className={styles.time}>{formatTime(duration)}</span>
                </div>
            </div>

            <div className={styles.extras}>
                <button className={styles.ctrlBtn} aria-label="Queue">
                    <IconList size={18} />
                </button>
                <div className={styles.volWrap}>
                    <span className={styles.ctrlBtn}><VolumeIcon /></span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={e => setVolume(Number(e.target.value))}
                        className={styles.volSlider}
                    />
                </div>
            </div>
        </div>
    );
}
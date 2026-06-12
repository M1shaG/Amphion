    import { createContext, useContext, useState, ReactNode } from "react"

    const AudioContext = createContext<{
        audioID: number;
        setAudioID: (id: number) => void;
    } | null>(null)

    export const AudioProvider = ({children}: {children: ReactNode}) => {
        const [audioID, setAudioID] = useState(1)
        return (
            <AudioContext.Provider value={{ audioID, setAudioID }}>
                {children}
            </AudioContext.Provider>
        )
    }

    export const useAudio = () => useContext(AudioContext)!


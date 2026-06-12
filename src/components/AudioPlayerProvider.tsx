'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface Track {
  id: string;
  title: string;
  src: string;
}

const tracks: Track[] = [
  { id: 'ethereal-sounds', title: 'Ethereal Sounds', src: '/audio/ethereal-sounds.mp3' },
  { id: 'agentic-loop', title: 'Agentic Loop', src: '/audio/agentic-loop.mp3' },
  { id: 'kaffeina', title: 'Kaffeina', src: '/audio/kaffeina.mp3' },
];

let sharedAudio: HTMLAudioElement | null = null;
let sharedTrackIndex = 0;
let sharedIsPlaying = false;

function getSharedAudio() {
  if (!sharedAudio) {
    sharedAudio = new Audio(tracks[sharedTrackIndex].src);
    sharedAudio.preload = 'auto';
  }

  return sharedAudio;
}

interface AudioPlayerContextValue {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayer(): AudioPlayerContextValue {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return ctx;
}

export default function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(sharedIsPlaying);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(sharedTrackIndex);

  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = useCallback(() => {
    const audio = getSharedAudio();

    if (sharedIsPlaying) {
      audio.pause();
      sharedIsPlaying = false;
      setIsPlaying(false);
      return;
    }

    audio.play().then(() => {
      sharedIsPlaying = true;
      setIsPlaying(true);
    }).catch(() => {
      sharedIsPlaying = false;
      setIsPlaying(false);
    });
  }, []);

  const nextTrack = useCallback(() => {
    const nextIndex = (sharedTrackIndex + 1) % tracks.length;
    const audio = getSharedAudio();

    sharedTrackIndex = nextIndex;
    audio.src = tracks[nextIndex].src;
    setCurrentTrackIndex(nextIndex);

    if (sharedIsPlaying) {
      audio.play().catch(() => {
        sharedIsPlaying = false;
        setIsPlaying(false);
      });
    }
  }, []);

  const previousTrack = useCallback(() => {
    const previousIndex = (sharedTrackIndex - 1 + tracks.length) % tracks.length;
    const audio = getSharedAudio();

    sharedTrackIndex = previousIndex;
    audio.src = tracks[previousIndex].src;
    setCurrentTrackIndex(previousIndex);

    if (sharedIsPlaying) {
      audio.play().catch(() => {
        sharedIsPlaying = false;
        setIsPlaying(false);
      });
    }
  }, []);

  useEffect(() => {
    const audio = getSharedAudio();

    const handleEnded = () => {
      const nextIndex = (sharedTrackIndex + 1) % tracks.length;

      sharedTrackIndex = nextIndex;
      audio.src = tracks[nextIndex].src;
      setCurrentTrackIndex(nextIndex);

      if (sharedIsPlaying) {
        audio.play().catch(() => {
          sharedIsPlaying = false;
          setIsPlaying(false);
        });
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        togglePlayPause,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

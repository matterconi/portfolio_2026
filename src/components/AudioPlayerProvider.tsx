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
  description: string;
  src: string;
  artwork?: string;
}

const tracks: Track[] = [
  {
    id: 'ethereal-sounds',
    title: 'Ethereal Sounds',
    description: 'Ambient textures',
    src: '/audio/ethereal-sounds.mp3',
    artwork: '/images/ethereal-sounds.webp',
  },
  {
    id: 'agentic-loop',
    title: 'Agentic Loop',
    description: 'Synthetic rhythm',
    src: '/audio/agentic-loop.mp3',
    artwork: '/images/agentic-loop.webp',
  },
  {
    id: 'kaffeina',
    title: 'Kaffeina',
    description: 'Late-night pulse',
    src: '/audio/kaffeina.mp3',
    artwork: '/images/kaffeina.webp',
  },
];

let sharedAudio: HTMLAudioElement | null = null;
let sharedTrackIndex = 0;
let sharedIsPlaying = false;
let sharedShuffleEnabled = false;
let sharedRepeatEnabled = false;

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
  currentTime: number;
  duration: number;
  shuffleEnabled: boolean;
  repeatEnabled: boolean;
  seekTo: (time: number) => void;
  play: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(sharedShuffleEnabled);
  const [repeatEnabled, setRepeatEnabled] = useState(sharedRepeatEnabled);

  const currentTrack = tracks[currentTrackIndex];

  const getNextTrackIndex = useCallback(() => {
    if (!sharedShuffleEnabled || tracks.length <= 1) {
      return (sharedTrackIndex + 1) % tracks.length;
    }

    let nextIndex = sharedTrackIndex;
    while (nextIndex === sharedTrackIndex) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    }
    return nextIndex;
  }, []);

  const playTrackAtIndex = useCallback((index: number) => {
    const audio = getSharedAudio();

    sharedTrackIndex = index;
    audio.src = tracks[index].src;
    setCurrentTrackIndex(index);
    setCurrentTime(0);

    if (sharedIsPlaying) {
      audio.play().catch(() => {
        sharedIsPlaying = false;
        setIsPlaying(false);
      });
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    const audio = getSharedAudio();
    if (!Number.isFinite(time)) return;

    const nextTime = Math.min(Math.max(time, 0), Number.isFinite(audio.duration) ? audio.duration : time);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const play = useCallback(() => {
    const audio = getSharedAudio();

    audio.play().then(() => {
      sharedIsPlaying = true;
      setIsPlaying(true);
    }).catch(() => {
      sharedIsPlaying = false;
      setIsPlaying(false);
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    sharedShuffleEnabled = !sharedShuffleEnabled;
    if (sharedShuffleEnabled) {
      sharedRepeatEnabled = false;
      setRepeatEnabled(false);
    }
    setShuffleEnabled(sharedShuffleEnabled);
  }, []);

  const toggleRepeat = useCallback(() => {
    sharedRepeatEnabled = !sharedRepeatEnabled;
    if (sharedRepeatEnabled) {
      sharedShuffleEnabled = false;
      setShuffleEnabled(false);
    }
    setRepeatEnabled(sharedRepeatEnabled);
  }, []);

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
    playTrackAtIndex(getNextTrackIndex());
  }, [getNextTrackIndex, playTrackAtIndex]);

  const previousTrack = useCallback(() => {
    const previousIndex = (sharedTrackIndex - 1 + tracks.length) % tracks.length;
    playTrackAtIndex(previousIndex);
  }, [playTrackAtIndex]);

  useEffect(() => {
    const audio = getSharedAudio();

    const handleEnded = () => {
      if (sharedRepeatEnabled) {
        audio.currentTime = 0;
      } else {
        const nextIndex = getNextTrackIndex();
        sharedTrackIndex = nextIndex;
        audio.src = tracks[nextIndex].src;
        setCurrentTrackIndex(nextIndex);
      }

      if (sharedIsPlaying) {
        audio.play().catch(() => {
          sharedIsPlaying = false;
          setIsPlaying(false);
        });
      }
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    handleTimeUpdate();
    handleLoadedMetadata();

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [getNextTrackIndex]);

  return (
    <AudioPlayerContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        shuffleEnabled,
        repeatEnabled,
        seekTo,
        play,
        toggleShuffle,
        toggleRepeat,
        togglePlayPause,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

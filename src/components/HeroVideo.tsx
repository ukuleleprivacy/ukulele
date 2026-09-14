import { ChangeEvent, useEffect, useRef, useState } from 'react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import VolumeOffRounded from '@mui/icons-material/VolumeOffRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const INTRO_PAUSE_TIME = 3;
const SKIP_TIME = 5;
const VIDEO_SRC = '/Videos/fiducaro-hero-web.mp4';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const introPauseComplete = useRef(false);
  const pausedAtPreview = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || connection?.saveData) {
      introPauseComplete.current = true;
      pausedAtPreview.current = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5 || document.hidden) return;
        observer.disconnect();
        setMediaReady(true);
        if (!video.getAttribute('src')) video.src = VIDEO_SRC;
        video.play().catch(() => setIsPlaying(false));
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Cached video metadata can load before React attaches its event handlers.
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration)) setDuration(video.duration);
    setCurrentTime(video.currentTime);
    setIsPlaying(!video.paused);
  }, []);

  useEffect(() => {
    if (!isExpanded) return undefined;
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        videoRef.current?.pause();
        setIsExpanded(false);
      }
      if (event.key === 'Tab') {
        const controls = stageRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
      else expandRef.current?.focus();
    };
  }, [isExpanded]);

  const takeControl = () => {
    introPauseComplete.current = true;
    setMediaReady(true);
    if (videoRef.current && !videoRef.current.getAttribute('src')) videoRef.current.src = VIDEO_SRC;
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    takeControl();
    if (video.paused) {
      if (video.ended || pausedAtPreview.current) {
        video.currentTime = 0;
        video.muted = false;
        setCurrentTime(0);
        setIsMuted(false);
        pausedAtPreview.current = false;
      }
      await video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const skipBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    takeControl();
    pausedAtPreview.current = false;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0);
    setCurrentTime(video.currentTime);
  };

  const seekTo = (event: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    takeControl();
    pausedAtPreview.current = false;
    video.currentTime = Number(event.target.value);
    setCurrentTime(video.currentTime);
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!introPauseComplete.current && video.currentTime >= INTRO_PAUSE_TIME) {
      introPauseComplete.current = true;
      pausedAtPreview.current = true;
      video.currentTime = INTRO_PAUSE_TIME;
      video.pause();
    }
    setCurrentTime(video.currentTime);
  };

  const closeExpandedPlayer = () => {
    videoRef.current?.pause();
    setIsExpanded(false);
  };

  const openExpandedPlayer = () => {
    const video = videoRef.current;
    if (!video) return;

    takeControl();
    pausedAtPreview.current = false;
    video.currentTime = 0;
    video.muted = false;
    setCurrentTime(0);
    setIsMuted(false);
    setIsExpanded(true);
    video.play().catch(() => setIsPlaying(false));
  };

  return (
    <>
      {isExpanded && (
        <Box
          className="hero-video-backdrop"
          onClick={closeExpandedPlayer}
        />
      )}
      <Box
        ref={stageRef}
        className={`hero-video-stage${isExpanded ? ' is-expanded' : ''}`}
        role={isExpanded ? 'dialog' : undefined}
        aria-modal={isExpanded ? true : undefined}
        aria-label={isExpanded ? 'Fiducaro film' : undefined}
      >
        {isExpanded && (
          <IconButton
            ref={closeRef}
            type="button"
            aria-label="Close expanded video"
            onClick={closeExpandedPlayer}
            className="hero-video-close"
          >
            <CloseRounded />
          </IconButton>
        )}
        <Box
          ref={videoRef}
          component="video"
          className="privacy-portrait-video"
          src={mediaReady ? VIDEO_SRC : undefined}
          poster="/brand/fiducaro-dark-wallpaper.webp"
          aria-label="Fiducaro brand video — Spend Freely. Prove Everything. Reveal Nothing."
          muted={isMuted}
          playsInline
          preload="none"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onDurationChange={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={handleTimeUpdate}
        />
        {!isExpanded && (
          <Box
            ref={expandRef}
            component="button"
            type="button"
            className="hero-video-expand-hit-area"
            aria-label="Expand video"
            onClick={openExpandedPlayer}
          />
        )}
        <Box
          className="hero-video-controls"
          aria-label="Video controls"
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            type="button"
            aria-label="Skip back 5 seconds"
            disabled={!duration}
            onClick={() => skipBy(-SKIP_TIME)}
          >
            <FastRewindRounded />
          </IconButton>
          <IconButton
            type="button"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            onClick={togglePlayback}
            className="hero-video-play-button"
          >
            {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
          <IconButton
            type="button"
            aria-label="Skip forward 5 seconds"
            disabled={!duration}
            onClick={() => skipBy(SKIP_TIME)}
          >
            <FastForwardRounded />
          </IconButton>
          <Box
            component="input"
            className="hero-video-scrubber"
            type="range"
            min={0}
            max={duration || 30}
            step="0.01"
            value={currentTime}
            disabled={!duration}
            aria-label="Video position"
            onChange={seekTo}
          />
          <Typography
            className="hero-video-time"
            aria-live="off"
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
          <IconButton
            type="button"
            aria-label={isMuted ? 'Turn sound on' : 'Mute video'}
            onClick={toggleMuted}
          >
            {isMuted ? <VolumeOffRounded /> : <VolumeUpRounded />}
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

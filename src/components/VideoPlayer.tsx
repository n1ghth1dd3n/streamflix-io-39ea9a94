import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft } from "lucide-react";

export function VideoPlayer({ src, title, onBack }: { src: string; title: string; onBack?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    return () => {
      hls?.destroy();
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setCurrent(video.currentTime);
    const onDur = () => setDuration(video.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onDur);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onDur);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    const val = Number(e.target.value);
    setVolume(val);
    if (v) {
      v.volume = val;
      v.muted = val === 0;
      setMuted(v.muted);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };

  const showThenHide = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black"
      onMouseMove={showThenHide}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black"
        autoPlay
        playsInline
        onClick={togglePlay}
      />

      <div
        className={`absolute inset-0 flex flex-col justify-between pointer-events-none transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 p-5 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
          {onBack && (
            <button onClick={onBack} className="text-white hover:opacity-80">
              <ArrowLeft className="w-7 h-7" />
            </button>
          )}
          <h1 className="text-white text-xl font-semibold">{title}</h1>
        </div>

        <div className="p-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={onSeek}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex items-center gap-4 mt-3 text-white">
            <button onClick={togglePlay} className="hover:opacity-80">
              {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current" />}
            </button>
            <button onClick={toggleMute} className="hover:opacity-80">
              {muted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={onVolume}
              className="w-24 accent-white cursor-pointer"
            />
            <span className="text-sm tabular-nums">
              {fmt(current)} / {fmt(duration)}
            </span>
            <div className="flex-1" />
            <button onClick={toggleFullscreen} className="hover:opacity-80">
              <Maximize className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

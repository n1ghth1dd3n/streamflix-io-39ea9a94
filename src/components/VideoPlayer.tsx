import { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import { ArrowLeft, Play, Pause, Maximize, Volume2, VolumeX } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

// Demo HLS stream (Big Buck Bunny)
const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export function VideoPlayer({ title, hlsUrl }: { title: string; hlsUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const src = hlsUrl || DEMO_HLS_URL;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => setPlaying(true)).catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        video.play().then(() => setPlaying(true)).catch(() => {});
      });
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black cursor-none"
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      <video ref={videoRef} className="w-full h-full object-contain" muted={muted} playsInline />

      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); router.history.back(); }}
            className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg font-semibold">{title}</span>
          </button>
        </div>

        {/* Center play */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors"
          >
            {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
          <div className="w-full h-1 bg-muted/40 rounded-full mb-4 cursor-pointer" onClick={(e) => { e.stopPropagation(); seekTo(e); }}>
            <div className="h-full bg-netflix-red rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}>
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

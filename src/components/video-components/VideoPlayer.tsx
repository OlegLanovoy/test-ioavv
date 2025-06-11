import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { TimeBar } from "./TimeBar";
import { ControlBar } from "./ControlBar";
import type { VideoPlayerProps } from "../types/player";

export default function VideoPlayer({ src, chapters = [] }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isQualitySettingsOpen, setIsQualitySettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentResolution, setCurrentResolution] = useState("720p");
  const [availableResolutions, setAvailableResolutions] = useState<
    { label: string; index: number }[]
  >([]);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setAvailableResolutions(
          data.levels.map((lvl, index) => ({
            label: `${lvl.height}p`,
            index,
          }))
        );
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    setShowControls(isHovering || isQualitySettingsOpen);
  }, [isHovering, isQualitySettingsOpen]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleResolutionChange = (index: number) => {
    setCurrentResolution(availableResolutions[index].label);
    hlsRef.current.currentLevel = index;
  };

  return (
    <div className="relative h-full max-w-[960px] max-h-[541px] mx-auto bg-black rounded-lg overflow-hidden group">
      <div className="relative aspect-video mx-auto bg-black rounded-lg overflow-hidden group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <TimeBar
            chapters={chapters}
            duration={duration}
            currentTime={currentTime}
            formatTime={formatTime}
          />

          <ControlBar
            isPlaying={isPlaying}
            duration={duration}
            currentTime={currentTime}
            currentResolution={currentResolution}
            availableResolutions={availableResolutions}
            togglePlay={togglePlay}
            handleResolutionChange={handleResolutionChange}
            formatTime={formatTime}
            setIsQualitySettingsOpen={setIsQualitySettingsOpen}
          />
        </div>
      </div>
    </div>
  );
}

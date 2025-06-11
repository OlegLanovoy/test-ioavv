import { useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DropDownCom } from "./DropDownCom";
import type { ControlBarProps } from "../types/player";

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  currentResolution,
  availableResolutions,
  duration,
  currentTime,
  togglePlay,
  handleResolutionChange,
  formatTime,
  setIsQualitySettingsOpen,
}) => {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    const video = document.querySelector("video") as HTMLVideoElement;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = document.querySelector("video") as HTMLVideoElement;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={togglePlay}>
          {isPlaying ? (
            <Pause className="h-6 w-6 text-white" />
          ) : (
            <Play className="h-6 w-6 text-white" />
          )}
        </Button>

        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </Button>

          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0"
            />
          </div>
        </div>
      </div>

      <DropDownCom
        currentResolution={currentResolution}
        availableResolutions={availableResolutions}
        handleResolutionChange={handleResolutionChange}
        setIsQualitySettingsOpen={setIsQualitySettingsOpen}
      />
    </div>
  );
};

import { useRef, useState, useEffect, useCallback } from "react";
import type { TimeBarProps } from "../types/player";

export const TimeBar: React.FC<TimeBarProps> = ({
  chapters,
  duration,
  currentTime,
  formatTime,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [hoveredChapter, setHoveredChapter] = useState<
    (typeof chapters)[0] | null
  >(null);

  useEffect(() => {
    const tooltip = tooltipRef.current;
    const timeline = timelineRef.current;

    if (!tooltip || !timeline || hoveredTime === null || duration === 0) return;

    const percent = hoveredTime / duration;
    const timelineWidth = timeline.offsetWidth;
    const tooltipWidth = tooltip.offsetWidth;

    const rawLeft = percent * timelineWidth;
    const clampedLeft = Math.min(
      timelineWidth - tooltipWidth / 2,
      Math.max(tooltipWidth / 2, rawLeft)
    );

    tooltip.style.left = `${clampedLeft}px`;
    tooltip.style.transform = "translateX(-50%)";
  }, [hoveredTime, duration]);

  const handleTimelineHover = useCallback(
    (e: React.MouseEvent) => {
      const timeline = timelineRef.current;
      if (!timeline || duration === 0) return;

      const rect = timeline.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const time = percentage * duration;

      setHoveredTime(time);
      const chapter = chapters.find((ch, i) => {
        const isLast = i === chapters.length - 1;
        return isLast
          ? time >= ch.startTime && time <= ch.endTime
          : time >= ch.startTime && time < chapters[i + 1].startTime;
      });

      setHoveredChapter(chapter || null);
    },
    [duration, chapters]
  );

  const handleTimelineClick = (e: React.MouseEvent) => {
    const timeline = timelineRef.current;
    if (!timeline || duration === 0) return;

    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;

    const video = document.querySelector("video") as HTMLVideoElement;
    if (video) video.currentTime = time;
  };

  return (
    <div className="relative mb-4">
      <div className="absolute inset-0 z-0 flex w-full pointer-events-none">
        {chapters.map((chapter) => {
          const chapterDuration = chapter.endTime - chapter.startTime;
          const widthPercent = (chapterDuration / duration) * 100;
          const chapterProgress =
            currentTime <= chapter.startTime
              ? 0
              : currentTime >= chapter.endTime
              ? 100
              : ((currentTime - chapter.startTime) / chapterDuration) * 100;
          const isHovered = hoveredChapter?.id === chapter.id;

          return (
            <div
              key={chapter.id}
              className="relative h-1 mx-[1px] rounded-full overflow-visible"
              style={{ width: `${widthPercent}%` }}
            >
              <div className="absolute inset-0 rounded-full bg-white/30" />
              <div
                className="absolute left-0 top-0 rounded-full h-full bg-white transition-all duration-100"
                style={{ width: `${chapterProgress}%` }}
              />
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "rgba(118, 164, 249, 1)" }}
                />
              )}
            </div>
          );
        })}

        <div
          className="absolute top-[-6px] bottom-[-2px] w-[4px] bg-white z-10"
          style={{
            left: `${(currentTime / duration) * 100}%`,
            transform: "translateX(-3px)",
          }}
        />
      </div>

      <div
        ref={timelineRef}
        className="relative z-10 h-2 bg-transparent rounded-full cursor-pointer"
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => {
          setHoveredTime(null);
          setHoveredChapter(null);
        }}
        onClick={handleTimelineClick}
      >
        {hoveredTime !== null && (
          <>
            <div
              ref={tooltipRef}
              className="absolute bottom-6 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
            >
              <div>{formatTime(hoveredTime)}</div>
              {hoveredChapter && (
                <div className="text-xs opacity-75">{hoveredChapter.title}</div>
              )}
            </div>

            <div
              className="absolute bottom-[14px] w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black z-50 pointer-events-none"
              style={{
                left: `${(hoveredTime / duration) * 100}%`,
                transform: "translateX(-50%)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

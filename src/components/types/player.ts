export interface Chapter {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
}

export interface TimeBarProps {
  chapters: Chapter[];
  duration: number;
  currentTime: number;

  formatTime: (time: number) => string;
}

export interface VideoPlayerProps {
  src: string;
  chapters?: Chapter[];
  title?: string;
}

export interface Resolution {
  label: string;
  index: number;
}

export interface ControlBarProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  currentResolution: string;
  availableResolutions: Resolution[];
  togglePlay: () => void;
  handleResolutionChange: (index: number) => void;
  formatTime: (time: number) => string;
  setIsQualitySettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DropDownComProps {
  currentResolution: string;
  availableResolutions: Resolution[];
  handleResolutionChange: (index: number) => void;
  setIsQualitySettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

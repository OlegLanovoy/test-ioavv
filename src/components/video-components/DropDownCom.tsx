import { Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { DropDownComProps } from "../types/player";

export const DropDownCom: React.FC<DropDownComProps> = ({
  currentResolution,
  availableResolutions,
  handleResolutionChange,
  setIsQualitySettingsOpen,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <DropdownMenu onOpenChange={(open) => setIsQualitySettingsOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="h-5 w-5 text-white " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          sideOffset={8}
          align="end"
          className="w-40 rounded-md border border-white/10 bg-zinc-900 p-2 text-sm shadow-lg"
        >
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Quality
          </div>
          {availableResolutions.map((resolution) => (
            <DropdownMenuItem
              key={resolution.index}
              onClick={() => handleResolutionChange(resolution.index)}
              className="flex items-center justify-between px-2 py-1.5 rounded-md text-white"
            >
              <span>{resolution.label}</span>
              {currentResolution === resolution.label && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

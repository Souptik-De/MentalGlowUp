import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface BreathingControlsProps {
  isActive: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onSettings: () => void;
}

const BreathingControls = ({
  isActive,
  onStartPause,
  onReset,
  onSettings,
}: BreathingControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main Control Button */}
      <Button
        onClick={onStartPause}
        size="lg"
        className="w-48 h-14 text-lg font-semibold rounded-full shadow-button-glow"
      >
        {isActive ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start
          </>
        )}
      </Button>

      {/* Secondary Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          size="default"
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={onSettings}
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default BreathingControls;

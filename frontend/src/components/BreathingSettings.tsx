import { useState } from 'react';
import { BreathingSettings as Settings } from '@/pages/Breathe';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface BreathingSettingsProps {
  settings: Settings;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

const BreathingSettings = ({ settings, onClose, onSave }: BreathingSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const durationOptions = [3, 4, 5, 6];
  const roundOptions = [3, 5, 10, 20];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">
            Breathing Duration (seconds per phase)
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {durationOptions.map((duration) => (
              <button
                key={duration}
                onClick={() => setLocalSettings({ ...localSettings, duration })}
                className={`
                  py-3 rounded-lg font-medium transition-colors
                  ${
                    localSettings.duration === duration
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }
                `}
              >
                {duration}s
              </button>
            ))}
          </div>
        </div>

        {/* Rounds Selection */}
        <div className="mb-6">
          <Label className="text-base font-semibold mb-3 block">Number of Rounds</Label>
          <div className="grid grid-cols-4 gap-2">
            {roundOptions.map((rounds) => (
              <button
                key={rounds}
                onClick={() => setLocalSettings({ ...localSettings, rounds })}
                className={`
                  py-3 rounded-lg font-medium transition-colors
                  ${
                    localSettings.rounds === rounds
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }
                `}
              >
                {rounds}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-toggle" className="text-base font-medium">
              Sound Notifications
            </Label>
            <Switch
              id="sound-toggle"
              checked={localSettings.soundEnabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, soundEnabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="haptic-toggle" className="text-base font-medium">
              Haptic Feedback
            </Label>
            <Switch
              id="haptic-toggle"
              checked={localSettings.hapticEnabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, hapticEnabled: checked })
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => onSave(localSettings)} className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BreathingSettings;

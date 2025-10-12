import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BreathingCircle from '@/components/BreathingCircle';
import BreathingControls from '@/components/BreathingControls';
import BreathingSettings from '@/components/BreathingSettings';
import PostBreathingMood from '@/components/PostBreathingMood';

export type BreathPhase = 'inhale' | 'hold-top' | 'exhale' | 'hold-bottom';

export interface BreathingSettings {
  duration: number;
  rounds: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

const Breathe = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<BreathingSettings>({
    duration: 4,
    rounds: 5,
    soundEnabled: false,
    hapticEnabled: false,
  });

  const phases: BreathPhase[] = ['inhale', 'hold-top', 'exhale', 'hold-bottom'];
  const phaseIndex = phases.indexOf(currentPhase);

  useEffect(() => {
    if (!isActive || isCompleted) return;

    const interval = setInterval(() => {
      setPhaseProgress((prev) => {
        const newProgress = prev + (100 / (settings.duration * 10));
        
        if (newProgress >= 100) {
          const nextPhaseIndex = (phaseIndex + 1) % phases.length;
          
          // Haptic feedback at phase change
          if (settings.hapticEnabled && 'vibrate' in navigator) {
            navigator.vibrate(50);
          }
          
          // Check if cycle completed
          if (nextPhaseIndex === 0) {
            if (currentRound >= settings.rounds) {
              setIsCompleted(true);
              setIsActive(false);
              return 0;
            }
            setCurrentRound((r) => r + 1);
          }
          
          setCurrentPhase(phases[nextPhaseIndex]);
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, phaseIndex, currentRound, settings, isCompleted]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setCurrentRound(1);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    navigate('/');
  };

  const handleStartAgain = () => {
    setIsCompleted(false);
    handleReset();
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
        <Navigation />
        <PostBreathingMood onComplete={handleComplete} onStartAgain={handleStartAgain} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16 bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Box Breathing</h1>
          <p className="text-muted-foreground mt-1">4-4-4-4 Technique</p>
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center justify-center my-12">
          <BreathingCircle
            phase={currentPhase}
            progress={phaseProgress}
            duration={settings.duration}
          />
          
          {/* Round Counter */}
          <p className="text-lg font-medium text-muted-foreground mt-8">
            Round {currentRound} of {settings.rounds}
          </p>
        </div>

        {/* Controls */}
        <BreathingControls
          isActive={isActive}
          onStartPause={handleStartPause}
          onReset={handleReset}
          onSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <BreathingSettings
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(newSettings) => {
            setSettings(newSettings);
            setShowSettings(false);
            handleReset();
          }}
        />
      )}
    </div>
  );
};

export default Breathe;

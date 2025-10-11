import { BreathPhase } from '@/pages/Breathe';

interface BreathingCircleProps {
  phase: BreathPhase;
  progress: number;
  duration: number;
}

const phaseConfig = {
  'inhale': {
    text: 'Breathe In',
    scale: 1.4,
    gradient: 'from-[#42A5F5] to-[#1E88E5]',
    ringColor: 'stroke-[#42A5F5]',
  },
  'hold-top': {
    text: 'Hold',
    scale: 1.4,
    gradient: 'from-[#81D4FA] to-[#4FC3F7]',
    ringColor: 'stroke-[#81D4FA]',
  },
  'exhale': {
    text: 'Breathe Out',
    scale: 1.0,
    gradient: 'from-[#AB47BC] to-[#8E24AA]',
    ringColor: 'stroke-[#AB47BC]',
  },
  'hold-bottom': {
    text: 'Hold',
    scale: 1.0,
    gradient: 'from-[#CE93D8] to-[#BA68C8]',
    ringColor: 'stroke-[#CE93D8]',
  },
};

const BreathingCircle = ({ phase, progress, duration }: BreathingCircleProps) => {
  const config = phaseConfig[phase];
  const isExpanding = phase === 'inhale';
  const isContracting = phase === 'exhale';
  
  // Calculate scale based on phase and progress
  let currentScale = 1.0;
  if (isExpanding) {
    currentScale = 1.0 + (0.4 * (progress / 100));
  } else if (isContracting) {
    currentScale = 1.4 - (0.4 * (progress / 100));
  } else {
    currentScale = config.scale;
  }

  const circumference = 2 * Math.PI * 140;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Progress Ring */}
      <svg className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="140"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx="50%"
          cy="50%"
          r="140"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${config.ringColor} transition-all duration-300`}
          strokeLinecap="round"
        />
      </svg>

      {/* Breathing Circle */}
      <div
        className={`
          w-[250px] h-[250px] md:w-[280px] md:h-[280px]
          rounded-full bg-gradient-to-br ${config.gradient}
          shadow-2xl flex items-center justify-center
          transition-all ease-in-out
        `}
        style={{
          transform: `scale(${currentScale})`,
          transitionDuration: `${duration}s`,
          opacity: isExpanding ? 0.6 + (0.4 * (progress / 100)) : isContracting ? 1.0 - (0.4 * (progress / 100)) : 1.0,
        }}
      >
        {/* Pulse Effect for Hold Phases */}
        {(phase === 'hold-top' || phase === 'hold-bottom') && (
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${config.gradient} animate-ping opacity-20`}
          />
        )}
        
        {/* Instruction Text */}
        <p className="text-white text-2xl md:text-3xl font-bold z-10 animate-fade-in">
          {config.text}
        </p>
      </div>
    </div>
  );
};

export default BreathingCircle;

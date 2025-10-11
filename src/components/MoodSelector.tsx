import { useState } from 'react';
import { MoodType, MoodOption } from '@/types/mood';
import { submitMoodEntry } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const moodOptions: MoodOption[] = [
  { id: 'Amazing', label: 'Amazing', emoji: '😄', color: 'mood-amazing' },
  { id: 'Good', label: 'Good', emoji: '😊', color: 'mood-good' },
  { id: 'Okay', label: 'Okay', emoji: '😐', color: 'mood-okay' },
  { id: 'Down', label: 'Down', emoji: '😔', color: 'mood-down' },
  { id: 'Stressed', label: 'Stressed', emoji: '😫', color: 'mood-stressed' },
];

interface MoodSelectorProps {
  onMoodSelected: (mood: MoodType) => void;
}

const MoodSelector = ({ onMoodSelected }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    setIsSubmitting(true);

    // Store in sessionStorage for journal page
    sessionStorage.setItem('currentMood', mood);

    // Submit to backend
    const result = await submitMoodEntry({
      user_id: 'user_' + Date.now(), // Generate temporary user ID
      emoji: mood,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(`Mood logged: ${mood}`);
      onMoodSelected(mood);
    } else {
      toast.error(result.message || 'Failed to log mood');
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-card-soft p-8 md:p-10 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
          How are you feeling today?
        </h2>
        <p className="text-muted-foreground text-lg">
          Tap an icon to log your mood
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            disabled={isSubmitting}
            className={`
              flex flex-col items-center gap-3 p-4 rounded-2xl transition-all
              ${selectedMood === mood.id
                ? `bg-${mood.color}/10 ring-2 ring-${mood.color} scale-105`
                : 'hover:bg-muted hover:scale-105'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-4xl md:text-5xl
                border-4 transition-colors
                ${selectedMood === mood.id
                  ? `border-${mood.color} bg-${mood.color}/10`
                  : 'border-border'
                }
              `}
            >
              {isSubmitting && selectedMood === mood.id ? (
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              ) : (
                mood.emoji
              )}
            </div>
            <span className={`
              font-medium text-sm md:text-base transition-colors
              ${selectedMood === mood.id ? `text-${mood.color}` : 'text-foreground'}
            `}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;

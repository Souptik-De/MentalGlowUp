import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw } from 'lucide-react';
import { MoodType, MoodOption } from '@/types/mood';
import { submitMoodEntry } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PostBreathingMoodProps {
  onComplete: () => void;
  onStartAgain: () => void;
}

const moodOptions: MoodOption[] = [
  { id: 'Amazing', emoji: '😄', label: 'Amazing', color: 'mood-amazing' },
  { id: 'Good', emoji: '😊', label: 'Good', color: 'mood-good' },
  { id: 'Okay', emoji: '😐', label: 'Okay', color: 'mood-okay' },
  { id: 'Down', emoji: '😔', label: 'Down', color: 'mood-down' },
  { id: 'Stressed', emoji: '😫', label: 'Stressed', color: 'mood-stressed' },
];

const PostBreathingMood = ({ onComplete, onStartAgain }: PostBreathingMoodProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    setIsSubmitting(true);

    try {
      await submitMoodEntry({
        user_id: 'user_breathing_session',
        emoji: mood,
        text: 'Post-breathing exercise mood',
      });

      toast({
        title: 'Mood logged!',
        description: 'Great job completing your breathing exercise.',
      });

      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log mood. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#42A5F5] to-[#AB47BC] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Great Job!
          </h1>
          <p className="text-lg text-muted-foreground">
            You've completed your breathing exercise
          </p>
        </div>

        {/* Mood Selection */}
        <div className="bg-card rounded-2xl shadow-card-soft p-6 md:p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              How are you feeling now?
            </h2>
            <p className="text-muted-foreground">
              Tap an emoji to log your post-exercise mood
            </p>
          </div>

          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={isSubmitting}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl
                  transition-all duration-200 hover:scale-105
                  ${
                    selectedMood === mood.id
                      ? `bg-${mood.color} shadow-lg`
                      : 'bg-muted/50 hover:bg-muted'
                  }
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                aria-label={mood.label}
              >
                <span className="text-3xl md:text-4xl">{mood.emoji}</span>
                <span className="text-xs font-medium text-foreground">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onStartAgain}
            variant="outline"
            size="lg"
            className="flex-1 rounded-full"
            disabled={isSubmitting}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start Again
          </Button>
          <Button
            onClick={onComplete}
            size="lg"
            className="flex-1 rounded-full"
            disabled={isSubmitting}
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostBreathingMood;

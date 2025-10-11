import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { submitMoodEntry } from '@/lib/api';
import { toast } from 'sonner';
import { MoodType } from '@/types/mood';
import { Send, Sparkles } from 'lucide-react';

const Journal = () => {
  const [journalText, setJournalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType | null>(null);

  useEffect(() => {
    const mood = sessionStorage.getItem('currentMood') as MoodType | null;
    setCurrentMood(mood);
  }, []);

  const handleSubmit = async () => {
    if (!journalText.trim()) {
      toast.error('Please write something first');
      return;
    }

    setIsSubmitting(true);

    const result = await submitMoodEntry({
      user_id: 'user_' + Date.now(),
      emoji: currentMood || 'Okay',
      text: journalText,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success('Journal entry saved!');
      setJournalText('');
      sessionStorage.removeItem('currentMood');
    } else {
      toast.error(result.message || 'Failed to save entry');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Journal</h1>
            <p className="text-muted-foreground text-lg">Express your thoughts and feelings</p>
          </div>

          <Card className="shadow-card-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Entry</CardTitle>
                  <CardDescription>
                    {currentMood ? `Feeling ${currentMood} today` : 'How are you feeling?'}
                  </CardDescription>
                </div>
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="What's on your mind? Share your thoughts, feelings, or what happened today..."
                className="min-h-[300px] resize-none text-base"
              />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {journalText.length} characters
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !journalText.trim()}
                  size="lg"
                  className="shadow-button-glow"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="shadow-card-soft mt-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Journaling Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Write freely without judgment - there are no right or wrong entries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Focus on how events made you feel, not just what happened</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Include positive moments, even small ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Be honest with yourself - your journal is a safe space</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Journal;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";

interface QuizWelcomeProps {
  onStart: () => void;
}

export const QuizWelcome = ({ onStart }: QuizWelcomeProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-card-soft">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="w-16 h-16 text-primary animate-pulse" fill="currentColor" />
              <Sparkles className="w-6 h-6 text-secondary absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-bold text-primary">
              Mental Wellness Check-In
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-lg mx-auto">
              Take a moment for yourself. This gentle quiz will help you understand your current mental wellness and provide personalized insights.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/30 border border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p>This quiz takes about 3-5 minutes to complete</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/30 border border-border">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
              <p>Answer honestly - there are no right or wrong answers</p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/30 border border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <p>Your responses are private and not stored anywhere</p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onStart}
              size="lg"
              className="w-full text-lg font-semibold bg-primary hover:bg-primary/90"
            >
              Begin Your Check-In
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Remember: This quiz is for self-reflection only and does not replace professional mental health advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

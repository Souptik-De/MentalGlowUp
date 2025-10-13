import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface ResultData {
  score: number;
  title: string;
  description: string;
  recommendations: string[];
}

interface QuizResultsProps {
  score: number;
  onRestart: () => void;
}

const getResultData = (score: number): ResultData => {
  const percentage = (score / 40) * 100;

  if (percentage >= 75) {
    return {
      score: percentage,
      title: "You're Thriving! ✨",
      description: "Your responses indicate you're in a really positive mental space right now. You're managing stress well and maintaining healthy habits.",
      recommendations: [
        "Keep up your current self-care routine",
        "Share your positive strategies with others",
        "Continue activities that bring you joy",
        "Stay connected with your support network",
      ],
    };
  } else if (percentage >= 50) {
    return {
      score: percentage,
      title: "You're Doing Well 🌟",
      description: "You're managing well overall, though there might be some areas where you could use extra support. You're on a positive path.",
      recommendations: [
        "Identify one area you'd like to improve",
        "Practice mindfulness or meditation regularly",
        "Ensure you're getting enough quality sleep",
        "Stay physically active, even with short walks",
      ],
    };
  } else if (percentage >= 25) {
    return {
      score: percentage,
      title: "You're Managing 💙",
      description: "Things might feel challenging right now. It's okay to not be okay sometimes. Small steps can make a big difference.",
      recommendations: [
        "Talk to someone you trust about how you're feeling",
        "Break tasks into smaller, manageable steps",
        "Prioritize rest and self-compassion",
        "Consider reaching out to a mental health professional",
      ],
    };
  } else {
    return {
      score: percentage,
      title: "Reach Out for Support 🤝",
      description: "You're going through a difficult time, and that's completely valid. Remember that seeking help is a sign of strength, not weakness.",
      recommendations: [
        "Reach out to a mental health professional immediately",
        "Talk to trusted friends or family members",
        "Contact a crisis helpline if you need immediate support",
        "Be gentle with yourself and take things one day at a time",
      ],
    };
  }
};

export const QuizResults = ({ score, onRestart }: QuizResultsProps) => {
  const result = getResultData(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-card-soft">
        <CardHeader className="text-center space-y-6 pb-6">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="w-16 h-16 text-primary" fill="currentColor" />
              <Sparkles className="w-6 h-6 text-secondary absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>

          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold text-primary">
              {result.title}
            </CardTitle>
            <CardDescription className="text-lg text-foreground max-w-lg mx-auto">
              {result.description}
            </CardDescription>
          </div>

          <div className="flex justify-center">
            <div className="bg-primary rounded-2xl px-8 py-4 shadow-button-glow">
              <p className="text-primary-foreground text-sm font-medium">Wellness Score</p>
              <p className="text-primary-foreground text-4xl font-bold">{Math.round(result.score)}%</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Personalized Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-accent/40 border border-border/50 hover:bg-accent/60 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important:</strong> This quiz provides general insights and is not a diagnostic tool.
              If you're experiencing persistent mental health challenges, please consult with a qualified mental health professional.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              onClick={onRestart}
              size="lg"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Take the Quiz Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

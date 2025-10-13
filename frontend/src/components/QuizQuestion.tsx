import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface Option {
  text: string;
  value: number;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (value: number) => void;
}

export const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-card-soft">
        <CardHeader className="space-y-4 pb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Question {currentQuestion} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2 pt-4">
            <CardTitle className="text-2xl leading-relaxed">{question.text}</CardTitle>
            <CardDescription className="text-base">
              Choose the option that best reflects how you've been feeling
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option.value)}
              className={`w-full p-5 rounded-xl text-left transition-all duration-300 border-2 ${
                selectedOption === option.value
                  ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                  : "border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedOption === option.value
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {selectedOption === option.value && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </div>
                <span className="text-base">{option.text}</span>
              </div>
            </button>
          ))}

          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              size="lg"
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

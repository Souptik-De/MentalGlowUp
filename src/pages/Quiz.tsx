import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Brain, Heart, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Quiz = () => {
  const quizzes = [
    {
      title: 'Stress Assessment',
      description: 'Understand your current stress levels',
      icon: Brain,
      color: 'text-mood-stressed',
      bgColor: 'bg-mood-stressed/10',
    },
    {
      title: 'Mood Check-in',
      description: 'Quick emotional wellness evaluation',
      icon: Smile,
      color: 'text-mood-good',
      bgColor: 'bg-mood-good/10',
    },
    {
      title: 'Anxiety Screening',
      description: 'Identify anxiety patterns',
      icon: Heart,
      color: 'text-mood-okay',
      bgColor: 'bg-mood-okay/10',
    },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Mental Health Quizzes</h1>
            <p className="text-muted-foreground text-lg">
              Self-assessment tools to understand your mental wellness
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz, index) => (
              <Card key={index} className="shadow-card-soft hover:shadow-lg transition-all">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${quiz.bgColor} flex items-center justify-center mb-4`}>
                    <quiz.icon className={`w-7 h-7 ${quiz.color}`} />
                  </div>
                  <CardTitle className="text-xl">{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Card */}
          <Card className="shadow-card-soft mt-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-primary mt-1" />
                <div>
                  <CardTitle className="text-lg">About These Assessments</CardTitle>
                  <CardDescription className="mt-2">
                    These quizzes are screening tools, not diagnostic tests. They can help you understand
                    your mental health better, but cannot replace professional evaluation.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you're experiencing persistent mental health concerns, please consider speaking with
                a qualified mental health professional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

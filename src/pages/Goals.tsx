import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Goals = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Goals</h1>
            <p className="text-muted-foreground text-lg">Set and track your wellness objectives</p>
          </div>

          <Card className="shadow-card-soft">
            <CardHeader>
              <CardTitle>Your Wellness Goals</CardTitle>
              <CardDescription>Create goals to improve your mental health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start setting wellness goals to track your progress and stay motivated on your journey
                </p>
                <Button size="lg" className="shadow-button-glow">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Goals */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              'Journal 3 times a week',
              'Practice breathing exercises daily',
              'Maintain a 7-day mood tracking streak',
              'Complete a mental health quiz',
            ].map((goal, index) => (
              <Card key={index} className="shadow-card-soft hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{goal}</h4>
                      <p className="text-sm text-muted-foreground">Suggested goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;

import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Heart, Zap } from 'lucide-react';

const Progress = () => {
  const stats = [
    { label: 'Current Streak', value: '7 days', icon: Zap, color: 'text-mood-amazing' },
    { label: 'Total Entries', value: '42', icon: Heart, color: 'text-mood-good' },
    { label: 'This Month', value: '18', icon: Calendar, color: 'text-mood-okay' },
    { label: 'Avg Mood', value: 'Good', icon: TrendingUp, color: 'text-mood-good' },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Progress</h1>
            <p className="text-muted-foreground text-lg">Track your emotional wellness journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-card-soft">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mood Chart Placeholder */}
          <Card className="shadow-card-soft">
            <CardHeader>
              <CardTitle>Mood Over Time</CardTitle>
              <CardDescription>Your emotional patterns this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chart visualization coming soon</p>
                  <p className="text-sm mt-1">Track your mood patterns over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="shadow-card-soft mt-6">
            <CardHeader>
              <CardTitle>This Week's Summary</CardTitle>
              <CardDescription>How you've been feeling lately</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Amazing', 'Good', 'Okay', 'Down', 'Stressed'].map((mood, index) => (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-foreground">{mood}</span>
                    <div className="flex-1 mx-4 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-mood-${mood.toLowerCase()} transition-all`}
                        style={{ width: `${Math.random() * 80 + 10}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm w-12 text-right">
                      {Math.floor(Math.random() * 10)}x
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;

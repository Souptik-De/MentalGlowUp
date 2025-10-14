import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, Heart, Zap } from 'lucide-react';
import { api } from '@/services/api';
const calculateStats = (series: any[]) => {
  if (!series || series.length === 0) {
    return [
      { label: 'Current Streak', value: '0 days', icon: Zap, color: 'text-mood-amazing' },
      { label: 'Total Entries', value: '0', icon: Heart, color: 'text-mood-good' },
      { label: 'This Month', value: '0', icon: Calendar, color: 'text-mood-okay' },
      { label: 'Avg Mood', value: 'N/A', icon: TrendingUp, color: 'text-mood-good' },
    ];
  }

  const totalEntries = series.length;

  // Calculate current streak (consecutive days with entries)
  let currentStreak = 0;
  const today = new Date();
  const todayStr = today.toDateString();

  for (let i = series.length - 1; i >= 0; i--) {
    const entryDate = new Date(series[i].timestamp);
    const entryDateStr = entryDate.toDateString();

    if (entryDateStr === todayStr ||
        (i === series.length - 1 && Math.abs(today.getTime() - entryDate.getTime()) <= 24 * 60 * 60 * 1000)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate this month's entries
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEntries = series.filter(entry => new Date(entry.timestamp) >= thisMonth).length;

  // Calculate average mood (weighted_mood average)
  const avgMood = series.reduce((sum, entry) => sum + (entry.weighted_mood || 0), 0) / series.length;
  const moodLabel = avgMood > 0.5 ? 'Amazing' : avgMood > 0 ? 'Good' : avgMood > -0.5 ? 'Okay' : 'Down';

  return [
    { label: 'Current Streak', value: `${currentStreak} days`, icon: Zap, color: 'text-mood-amazing' },
    { label: 'Total Entries', value: totalEntries.toString(), icon: Heart, color: 'text-mood-good' },
    { label: 'This Month', value: thisMonthEntries.toString(), icon: Calendar, color: 'text-mood-okay' },
    { label: 'Avg Mood', value: moodLabel, icon: TrendingUp, color: 'text-mood-good' },
  ];
};

// Helper function to calculate weekly mood counts
const calculateWeeklyMoodCounts = (series: any[]) => {
  if (!series || series.length === 0) {
    return [
      { mood: 'Amazing', count: 0, percentage: 0 },
      { mood: 'Good', count: 0, percentage: 0 },
      { mood: 'Okay', count: 0, percentage: 0 },
      { mood: 'Down', count: 0, percentage: 0 },
      { mood: 'Stressed', count: 0, percentage: 0 },
    ];
  }

  // Get entries from the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentEntries = series.filter(entry => new Date(entry.timestamp) >= oneWeekAgo);

  // Count moods
  const moodCounts: { [key: string]: number } = {};
  recentEntries.forEach(entry => {
    const mood = entry.emoji || 'Okay';
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;
  });

  // Convert to array and calculate percentages
  const total = recentEntries.length;
  return Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0,
  })).sort((a, b) => b.count - a.count);
};

const Progress = () => {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, use a placeholder user_id - this should come from auth context
      const data = await api.getUserProgress('user123');
      console.log('Progress API Response:', data); // Debug: Log the full response
      if (data && data.series && data.series.length > 0) {
        console.log('Last entry top_emotions:', data.series[data.series.length - 1].top_emotions); // Debug: Check last entry emotions
      }
      setProgressData(data);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we need to refresh (e.g., after a journal entry)
    const lastRefresh = sessionStorage.getItem('lastJournalEntry');
    if (lastRefresh) {
      sessionStorage.removeItem('lastJournalEntry'); // Clear the flag
      console.log('Detected journal entry flag, refreshing data...'); // Debug: Confirm refresh trigger
    }

    fetchProgress();
  }, [refreshTrigger]);

  // Function to manually refresh data (for debugging)
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Calculate stats from real data
  const stats = progressData ? calculateStats(progressData.series) : [
    { label: 'Current Streak', value: '0 days', icon: Zap, color: 'text-mood-amazing' },
    { label: 'Total Entries', value: '0', icon: Heart, color: 'text-mood-good' },
    { label: 'This Month', value: '0', icon: Calendar, color: 'text-mood-okay' },
    { label: 'Avg Mood', value: 'N/A', icon: TrendingUp, color: 'text-mood-good' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
        <Navigation />
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="text-muted-foreground">Loading progress data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
        <Navigation />
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Progress</h1>
            <p className="text-muted-foreground text-lg">Track your emotional wellness journey</p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
              Refresh Data
            </Button>
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

          {/* Weekly Summary */}
          <Card className="shadow-card-soft mt-6">
            <CardHeader>
              <CardTitle>This Week's Summary</CardTitle>
              <CardDescription>How you've been feeling lately</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData ? calculateWeeklyMoodCounts(progressData.series).map((item: any) => (
                  <div key={item.mood} className="flex items-center justify-between">
                    <span className="text-foreground">{item.mood}</span>
                    <div className="flex-1 mx-4 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-mood-${item.mood.toLowerCase()} transition-all`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground text-sm w-12 text-right">
                      {item.count}x
                    </span>
                  </div>
                )) : ['Amazing', 'Good', 'Okay', 'Down', 'Stressed'].map((mood) => (
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

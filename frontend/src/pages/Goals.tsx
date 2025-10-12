import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Goal } from "@/types/goal";
import { api } from "@/services/api";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import { Target, TrendingUp, Flame, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const Goals = () => {
  const { data: goals, refetch } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: api.getGoals,
  });

  const stats = {
    total: goals?.length || 0,
    active: goals?.filter(g => g.progress_percentage < 100).length || 0,
    completed: goals?.filter(g => g.progress_percentage === 100).length || 0,
    avgProgress: goals?.length
      ? Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / goals.length)
      : 0,
    totalStreak: goals?.reduce((sum, g) => sum + g.current_streak, 0) || 0,
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16">
      <Navigation />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-60"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Goal Tracking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Your Wellness Journey
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Track your goals with AI-generated insights and personalized action plans
            </p>
            <div className="pt-4">
              <CreateGoalDialog onGoalCreated={() => refetch()} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Card className="p-4 text-center shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Goals</div>
          </Card>
          <Card className="p-4 text-center shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
          <Card className="p-4 text-center shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <div className="text-xs text-muted-foreground">Avg Progress</div>
          </Card>
          <Card className="p-4 text-center shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <Flame className="h-8 w-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">{stats.totalStreak}</div>
            <div className="text-xs text-muted-foreground">Total Streak</div>
          </Card>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {!goals || goals.length === 0 ? (
            <Card className="p-12 text-center shadow-soft">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first goal to start your wellness journey
              </p>
              <CreateGoalDialog onGoalCreated={() => refetch()} />
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6">Your Goals</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {goals.map((goal) => (
                  <GoalCard key={goal._id} goal={goal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;

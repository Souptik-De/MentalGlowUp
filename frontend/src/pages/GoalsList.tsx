import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Goal } from "@/types/goal";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Flame, Plus, Sparkles } from "lucide-react";
import { format } from "date-fns";

const GoalsList = () => {
  const navigate = useNavigate();

  const { data: goals, isLoading, error } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: api.getGoals,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your goals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-destructive">Error loading goals</h2>
          <p className="text-muted-foreground mb-4">There was a problem fetching your goals.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Goals</h1>
            <p className="text-muted-foreground">
              Track your progress and achieve your aspirations
            </p>
          </div>
          <Button
            onClick={() => navigate("/goals/create")}
            className="gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Create Goal
          </Button>
        </div>

        {/* Goals Grid */}
        {goals && goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <Card
                key={goal._id}
                className="p-6 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-glow transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/goals/${goal._id}`)}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-primary transition-colors">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {goal.description}
                      </p>
                    </div>
                    {goal.current_streak > 0 && (
                      <Badge className="ml-2 gap-1 px-2 py-1 text-xs bg-gradient-primary text-primary-foreground border-0">
                        <Flame className="h-3 w-3" />
                        {goal.current_streak}
                      </Badge>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-semibold text-primary">
                        {goal.progress_percentage}%
                      </span>
                    </div>
                    <Progress value={goal.progress_percentage} className="h-2" />
                  </div>

                  {/* Dates and Info */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(goal.start_date), "MMM dd")} - {format(new Date(goal.end_date), "MMM dd")}
                      </span>
                    </div>
                    {goal.subtasks && goal.subtasks.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>{goal.subtasks.filter(st => st.completed).length}/{goal.subtasks.length} tasks</span>
                      </div>
                    )}
                  </div>

                  {/* AI Summary Preview */}
                  {goal.summary && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-foreground/80 line-clamp-2">
                          {goal.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start your journey towards better mental health by creating your first goal.
              Set achievable targets and track your progress along the way.
            </p>
            <Button
              onClick={() => navigate("/goals/create")}
              className="gap-2"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsList;

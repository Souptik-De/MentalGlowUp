import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Goal } from "@/types/goal";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Calendar, Target, Flame, Sparkles, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: api.getGoals,
  });

  const goal = goals?.find(g => g._id === id);

  const updateSubtaskMutation = useMutation({
    mutationFn: ({ index, completed }: { index: number; completed: boolean }) =>
      api.updateSubtask(id!, index, completed),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast({
        title: "Nice work! 🎉",
        description: message,
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: () => api.deleteGoal(id!),
    onSuccess: () => {
      toast({
        title: "Goal deleted",
        description: "Your goal has been removed.",
      });
      navigate("/");
    },
  });

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Goal not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const startDate = format(new Date(goal.start_date), "MMMM dd, yyyy");
  const endDate = format(new Date(goal.end_date), "MMMM dd, yyyy");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-6 md:p-8 shadow-glow border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{goal.title}</h1>
                <p className="text-muted-foreground text-lg">{goal.description}</p>
              </div>
              {goal.current_streak > 0 && (
                <Badge className="ml-4 gap-2 px-4 py-2 text-lg bg-gradient-primary text-primary-foreground border-0">
                  <Flame className="h-5 w-5" />
                  {goal.current_streak} day streak
                </Badge>
              )}
            </div>

            {goal.summary && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2 text-primary">AI Summary</h3>
                    <p className="text-sm text-foreground/80">{goal.summary}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Start</div>
                  <div className="text-sm font-medium">{startDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-xs text-muted-foreground">End</div>
                  <div className="text-sm font-medium">{endDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Target className="h-5 w-5 text-secondary" />
                <div>
                  <div className="text-xs text-muted-foreground">Reminders</div>
                  <div className="text-sm font-medium capitalize">{goal.reminder_frequency}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress Card */}
          <Card className="p-6 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Overall Progress
              </h2>
              <span className="text-2xl font-bold text-primary">{goal.progress_percentage}%</span>
            </div>
            <Progress value={goal.progress_percentage} className="h-3" />
          </Card>

          {/* Motivation Card */}
          <Card className="p-6 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-3">Why This Matters</h2>
            <p className="text-foreground/80">{goal.relevant}</p>
          </Card>

          {/* Subtasks Card */}
          {goal.subtasks && goal.subtasks.length > 0 && (
            <Card className="p-6 shadow-soft border-border/50 bg-card/80 backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Action Steps
              </h2>
              <div className="space-y-3">
                {goal.subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={(checked) =>
                        updateSubtaskMutation.mutate({ index, completed: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <label
                      className={`flex-1 cursor-pointer ${
                        subtask.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {subtask.description}
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Goal
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your goal and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteGoalMutation.mutate()}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default GoalDetail;

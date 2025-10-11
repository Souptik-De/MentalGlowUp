import { Goal } from "@/types/goal";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Flame } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const startDate = format(new Date(goal.start_date), "MMM dd, yyyy");
  const endDate = format(new Date(goal.end_date), "MMM dd, yyyy");

  return (
    <Link to={`/goal/${goal._id}`}>
      <Card className="group p-6 hover:shadow-glow transition-smooth cursor-pointer border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
              {goal.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {goal.description}
            </p>
          </div>
          {goal.current_streak > 0 && (
            <Badge variant="secondary" className="ml-4 gap-1 bg-gradient-primary text-primary-foreground border-0">
              <Flame className="h-3 w-3" />
              {goal.current_streak}
            </Badge>
          )}
        </div>

        {goal.summary && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-foreground/80 italic">{goal.summary}</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Progress
              </span>
              <span className="text-sm font-semibold text-primary">{goal.progress_percentage}%</span>
            </div>
            <Progress value={goal.progress_percentage} className="h-2" />
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {startDate}
            </div>
            <span>→</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {endDate}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {goal.reminder_frequency}
            </Badge>
            {goal.subtasks && (
              <Badge variant="outline" className="text-xs">
                {goal.subtasks.filter(t => t.completed).length}/{goal.subtasks.length} tasks
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

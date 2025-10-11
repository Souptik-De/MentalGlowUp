export interface SubTask {
  description: string;
  completed: boolean;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  achievable: boolean;
  relevant: string;
  start_date: string;
  end_date: string;
  reminder_frequency: string;
  summary: string;
  subtasks: SubTask[];
  progress_percentage: number;
  current_streak: number;
  last_completion_date?: string;
}

export interface CreateGoalRequest {
  title: string;
  description: string;
  achievable: boolean;
  relevant: string;
  start_date: string;
  end_date: string;
  reminder_frequency: string;
}

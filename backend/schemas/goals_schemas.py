from pydantic import BaseModel, Field
from datetime import date
from typing import List,Optional

# New model for a single subtask
class SubTask(BaseModel):
    description: str
    completed: bool = False  # Status of the subtask
class goal_create(BaseModel):
    title: str
    description: str
    achievable: bool
    relevant: str
    start_date: date
    end_date: date
    reminder_frequency: str  # e.g., "daily", "weekly"
    summary: str = "" # Placeholder for the summary field
    current_streak: int = 0  # Tracks consecutive on-time completions (e.g., in days or goals)
    last_completion_date: Optional[date] = None # Tracks the last time a task contributed to the streak

# New model for updating a subtask status
class SubTaskUpdate(BaseModel):
    # We use the array index to locate the subtask in MongoDB (simpler than a subtask ID for now)
    subtask_index: int
    completed: bool
# New model for the structured data returned by Groq
class GoalAnalysis(BaseModel):
    summary: str = Field(description="A short, motivating summary of the goal and the action plan.")
    tasks: List[SubTask] = Field(description="A list of 3 to 7 small, actionable subtasks derived from the goal.")
# New model for AI feedback messages
class AIFeedback(BaseModel):
    message: str = Field(description="A short (1-2 sentence) encouraging message or personalized suggestion.")
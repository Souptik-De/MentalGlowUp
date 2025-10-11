import { Goal, CreateGoalRequest } from "@/types/goal";

// Update this URL to your FastAPI backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_BASE_URL}/goals/`);
    if (!response.ok) throw new Error("Failed to fetch goals");
    const data = await response.json();
    return data.goals;
  },

  async createGoal(goal: CreateGoalRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/goals/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error("Failed to create goal");
    const data = await response.json();
    return data.goal_id;
  },

  async updateSubtask(goalId: string, subtaskIndex: number, completed: boolean): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/subtask/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtask_index: subtaskIndex, completed }),
    });
    if (!response.ok) throw new Error("Failed to update subtask");
    const data = await response.json();
    return data.message;
  },

  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update goal");
  },

  async deleteGoal(goalId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete goal");
  },
};

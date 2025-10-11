from database import goal_collection
from schemas.goals_schemas import goal_create, SubTask, SubTaskUpdate, GoalAnalysis # Import new models
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os # For API Key
from groq import Groq
import json
from typing import List, Dict
# Initialize Groq client with API key from environment variable
client=Groq()

# --- Utility Functions ---

def calculate_progress(subtasks: List[Dict]) -> int:
    """Calculates progress based on the completion status of subtasks."""
    if not subtasks:
        return 0
    total_tasks = len(subtasks)
    # count tasks where the 'completed' field is True
    completed_tasks = sum(1 for task in subtasks if task.get("completed") is True)
    progress = int((completed_tasks / total_tasks) * 100)
    return progress

async def generate_analysis_with_groq(goal: goal_create) -> GoalAnalysis:
    """Calls Groq API to generate a summary and structured subtasks."""

    # 1. Use Pydantic's built-in schema to get the JSON structure required
    schema = GoalAnalysis.model_json_schema()
    
    # 2. Craft a single, powerful prompt using all goal details
    user_prompt = f"""
    Analyze the following student goal:
    Title: "{goal.title}"
    Description: "{goal.description}"
    Timeline: {goal.start_date} to {goal.end_date}
    Motivation: "{goal.relevant}"
    
    Your task is to generate a JSON object that includes a short, motivating summary 
    and a list of 3 to 7 small, actionable subtasks (the 'tasks' field) derived from this goal.
    Do not suggest subtasks that are too large or vague; they should be clear and achievable steps.
    Do not suggest subtasks for unrealistic, unachievable goals like "Become a millionaire overnight" or unethical goals like "Hack into a bank".
    Don't promote any illegal activities.
    
    Ensure the JSON strictly adheres to this schema:
    
    The output MUST strictly conform to the provided JSON Schema.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert goal-setting coach. Respond only with the requested JSON object."},
                {"role": "user", "content": user_prompt},
            ],
            # Use the correct, working model
            model="llama-3.1-8b-instant", 
            # IMPORTANT: Pass the Pydantic schema for structured output
            response_format={"type": "json_object", "schema": schema},
            temperature=0.6, # Increase temperature slightly for better creativity
        )
        
        json_string = chat_completion.choices[0].message.content
        
        # 3. Parse and Validate: Groq should return clean JSON, which we parse and validate
        analysis_data = json.loads(json_string)
        analysis = GoalAnalysis.model_validate(analysis_data)
        
        return analysis

    except Exception as e:
        print(f"Error calling Groq API for analysis: {e}")
        # Return a fail-safe GoalAnalysis object
        return GoalAnalysis(
            summary="AI breakdown failed. Please review.",
            tasks=[{"description": "Manual breakdown required.", "completed": False}]
        )

# --- Goal CRUD Operations ---

async def create_goal(goal:goal_create):
    try:
        # 1. Generate the full analysis
        analysis: GoalAnalysis = await generate_analysis_with_groq(goal)
        
        goal_dict=goal.model_dump()
        
        # 2. Add new fields from analysis
        goal_dict["subtasks"] = [task.model_dump() for task in analysis.tasks]
        goal_dict["summary"] = analysis.summary  # Add this field to your goal model later!
        goal_dict["status"] = "Not Started"
        goal_dict["progress_percentage"] = 0
        
        # 3. Handle dates and timestamps (existing logic)
        # 1. Convert standard dates to timezone-aware datetime objects for MongoDB
        goal_dict["start_date"] = datetime.combine(goal_dict["start_date"], datetime.min.time(), tzinfo=timezone.utc)
        goal_dict["end_date"] = datetime.combine(goal_dict["end_date"], datetime.min.time(), tzinfo=timezone.utc)
        
        
        if "last_completion_date" in goal_dict and goal_dict["last_completion_date"] is not None:
             # Combine the date object with a time component (midnight) and UTC timezone
             goal_dict["last_completion_date"] = datetime.combine(
                 goal_dict["last_completion_date"], datetime.min.time(), tzinfo=timezone.utc
             )

        # 2. Add created_at and updated_at timestamps
        goal_dict["created_at"] = datetime.now(timezone.utc)
        goal_dict["updated_at"] = datetime.now(timezone.utc)

        result = await goal_collection.insert_one(goal_dict)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating goal: {e}")
        return None
        
# ... existing get_goal function ...
async def get_goal():
    try:
        goals = await goal_collection.find({}).to_list(length=None)
        for g in goals:
            g["_id"]=str(g["_id"])
        return goals
    except Exception as e:
        print(f"Error retrieving goals: {e}")
        return []

# New function to update a subtask status and recalculate progress
async def update_subtask_status(goal_id: str, update_data: SubTaskUpdate):
    
    # 1. Update the specific subtask field (sets completion status)
    subtask_path = f"subtasks.{update_data.subtask_index}.completed"

    # We must update the goal's 'updated_at' field here too for time tracking
    update_result = await goal_collection.update_one(
        {"_id": ObjectId(goal_id)},
        {"$set": {subtask_path: update_data.completed, "updated_at": datetime.now(timezone.utc)}}
    )

    if update_result.modified_count == 0:
        # NOTE: Returning a tuple (False, message) now
        return False, "Failed to update subtask. Goal ID or index may be invalid."

    # 2. Recalculate everything and apply the changes
    updated_goal = await goal_collection.find_one({"_id": ObjectId(goal_id)})
    if updated_goal:
        subtasks = updated_goal.get("subtasks", [])
        new_progress = calculate_progress(subtasks)
        
        # Determine new status
        new_status = "Completed" if new_progress == 100 else ("In Progress" if new_progress > 0 else "Not Started")
        
        updates_to_set = {
            "progress_percentage": new_progress,
            "status": new_status,
            "updated_at": datetime.now(timezone.utc) # Updated again for accurate final timestamp
        }
        
        # --- REMINDER STREAK LOGIC ---
        
        # Only run streak logic if a task was just marked COMPLETE
        if update_data.completed is True:
            
            today_utc = datetime.now(timezone.utc).date()
            last_completion_dt = updated_goal.get("last_completion_date")
            current_streak = updated_goal.get("current_streak", 0)
            frequency = updated_goal.get("reminder_frequency", "never").lower()

            if frequency in ["daily", "weekly"]:
                
                if last_completion_dt is None:
                    # Case 1: First completion starts the streak
                    updates_to_set["current_streak"] = 1
                    updates_to_set["last_completion_date"] = datetime.now(timezone.utc)
                else:
                    last_completion_date = last_completion_dt.date()
                    delta = today_utc - last_completion_date
                    
                    # A. Task already completed TODAY (do nothing to streak, but update date)
                    if last_completion_date == today_utc:
                        pass
                    
                    # B. Check for a CONSECUTIVE completion
                    elif (frequency == "daily" and delta == timedelta(days=1)) or \
                         (frequency == "weekly" and delta.days >= 1 and delta.days <= 7):
                        
                        updates_to_set["current_streak"] = current_streak + 1
                        updates_to_set["last_completion_date"] = datetime.now(timezone.utc)
                        
                    # C. STREAK BROKEN / New Start
                    else:
                        updates_to_set["current_streak"] = 1 # Start a new streak
                        updates_to_set["last_completion_date"] = datetime.now(timezone.utc)

        # --- END STREAK LOGIC ---

        # Apply all accumulated updates (progress, status, streak)
        await goal_collection.update_one(
            {"_id": ObjectId(goal_id)},
            {"$set": updates_to_set}
        )
        
        # --- AI-DRIVEN FEEDBACK LOOP ---
        # Generate the encouraging message based on the new progress/streak
        feedback_message = await generate_feedback_message(updated_goal, update_data.subtask_index)
        
        # Return success AND the message
        return True, feedback_message
        
    # If the goal was deleted or not found between the two database reads
    return False, "Goal data integrity error. Could not calculate progress."

# NOTE: You must ensure 'timedelta' is imported from 'datetime' at the top of CRUD.py:
# from datetime import datetime, timezone, timedelta

async def generate_feedback_message(goal_data: dict, subtask_index: int) -> str:
    """Generates an encouragement message based on current progress."""
    
    # Get relevant data from the updated goal
    progress = goal_data.get("progress_percentage", 0)
    current_streak = goal_data.get("current_streak", 0)
    total_tasks = len(goal_data.get("subtasks", []))
    tasks_left = total_tasks - (total_tasks * progress // 100) # Simple calculation
    
    # Check if the completed task was the first or last
    completion_type = ""
    if progress == 100:
        completion_type = "Goal Completed!"
    elif progress == 0 and tasks_left == total_tasks - 1:
        completion_type = "First Task Complete!"
    
    user_prompt = f"""
    The user just completed subtask #{subtask_index + 1} of their goal: "{goal_data['title']}".
    Current Progress: {progress}%. Tasks Remaining: {tasks_left}. Current Streak: {current_streak}.
    The goal is: "{goal_data['summary']}".

    Generate a brief, friendly, encouraging message (1-2 sentences). 
    Focus on rewarding the streak if it's > 1, celebrating the progress, or gently suggesting the next step.
    If the goal is 100% complete, provide a celebratory message.if streak is 0, you must encourage them to start again.
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a highly positive and encouraging mental health coach. Respond only with a short message."},
                {"role": "user", "content": user_prompt},
            ],
            # Use a fast, single-token model, and use standard string output
            model="llama-3.1-8b-instant", # Ensure this is your known working model
            temperature=0.7,
        )
        
        # The model should return a simple string message
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        print(f"Error generating feedback: {e}")
        return "Keep up the great work! Every step counts." # Safe default
async def update_goal(db, goal_id, updated_data):
    result = await db.goals.update_one({"_id": ObjectId(goal_id)}, {"$set": updated_data})
    return result.modified_count > 0

async def delete_goal(db, goal_id):
    result = await db.goals.delete_one({"_id": ObjectId(goal_id)})
    return result.deleted_count > 0

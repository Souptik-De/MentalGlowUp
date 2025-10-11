from fastapi import FastAPI
from database import db
from database import goal_collection
from bson import ObjectId
from schemas.goals_schemas import goal_create, SubTask, SubTaskUpdate, GoalAnalysis
from fastapi.middleware.cors import CORSMiddleware 
from crud.goals_crud import create_goal,get_goal,update_goal,delete_goal,update_subtask_status,calculate_progress
from fastapi import APIRouter

router = APIRouter(prefix="/goals",
    tags=["Goals"],)

@router.post("/")
async def add_goal(goal: goal_create):
    goal_id = await create_goal(goal)
    if goal_id:
        return {"goal_id": goal_id, "message": "Goal created successfully!"}
    return {"message": "Failed to create goal."}

@router.get("/goals/")
async def list_goals():
    goals = await get_goal()
    return {"goals": goals}

@router.put("/goals/{goal_id}/subtask/")
async def modify_subtask(goal_id: str, subtask_update: SubTaskUpdate):
    # Unpack the new return value: (success: bool, message: str)
    success, message = await update_subtask_status(goal_id, subtask_update)

    if success:
        return {"message": message}  # Return the AI's encouragement message!

    # If failed, return the error message
    return {"message": message if not success and message != "Failed to update subtask." else "Failed to update subtask or goal progress. Check goal_id and index."}

@router.put("/goals/{goal_id}")
async def modify_goal(goal_id: str, updated_data: dict):
    success = await update_goal(db, goal_id, updated_data)
    if success:
        return {"message": "Goal updated successfully!"}
    return {"message": "Failed to update goal."}

@router.delete("/goals/{goal_id}")
async def remove_goal(goal_id: str):
    success = await delete_goal(db, goal_id)
    if success:
        return {"message": "Goal deleted successfully!"}
    return {"message": "Failed to delete goal."}
    # Add any other development/testing URLs here (e.g., if you use the default React port 3000)
    # "http://localhost:3000",


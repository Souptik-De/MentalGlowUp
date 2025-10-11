import { MoodEntry, ApiResponse } from '@/types/mood';

const API_BASE = 'http://localhost:8000/api/v1';

export const submitMoodEntry = async (entry: MoodEntry): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE}/mood/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to submit mood entry:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit entry',
    };
  }
};

import { MoodEntry, ApiResponse } from '@/types/mood';
import { api } from '@/services/api';

export const submitMoodEntry = async (entry: MoodEntry): Promise<ApiResponse> => {
  try {
    const data = await api.submitMoodEntry(entry);
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

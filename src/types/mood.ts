export type MoodType = 'Amazing' | 'Good' | 'Okay' | 'Down' | 'Stressed';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export interface MoodEntry {
  user_id: string;
  emoji: MoodType;
  text?: string;
  timestamp?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface Question {
  _id: string;
  session: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionResponse {
  success: boolean;
  data: Question;
}

export interface QuestionsResponse {
  success: boolean;
  count: number;
  data: Question[];
}

// Get all questions for a session
export const getQuestions = async (sessionId: string): Promise<Question[]> => {
  try {
    const response = await axios.get<QuestionsResponse>(
      `${API_URL}/sessions/${sessionId}/questions`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch questions');
  }
};

// Create a new question
export const createQuestion = async (sessionId: string, text: string): Promise<Question> => {
  try {
    const response = await axios.post<QuestionResponse>(
      `${API_URL}/sessions/${sessionId}/questions`,
      { text },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create question');
  }
};

// Update a question
export const updateQuestion = async (questionId: string, text: string): Promise<Question> => {
  try {
    const response = await axios.put<QuestionResponse>(
      `${API_URL}/questions/${questionId}`,
      { text },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update question');
  }
};

// Delete a question
export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axios.delete(
      `${API_URL}/questions/${questionId}`,
      { withCredentials: true }
    );
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete question');
  }
};

export const questionService = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};

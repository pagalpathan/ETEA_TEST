import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question, Subject } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface GenerateQuestionsParams {
  subject: Subject;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateQuestions(params: GenerateQuestionsParams): Promise<Question[]> {
    const { subject, topic, difficulty, count } = params;
    
    const subjectNames = {
      'biology': 'Biology',
      'physics': 'Physics', 
      'chemistry': 'Chemistry',
      'mathematics': 'Mathematics',
      'english': 'English',
      'general-knowledge': 'General Knowledge'
    };

    const prompt = `Generate ${count} multiple choice questions for ETEA (Educational Testing and Evaluation Agency) test preparation in Pakistan.

Subject: ${subjectNames[subject]}
${topic ? `Topic: ${topic}` : ''}
Difficulty: ${difficulty}

Requirements:
1. Questions should be relevant to Pakistani curriculum and ETEA exam pattern
2. Each question should have exactly 4 options (A, B, C, D)
3. Include detailed explanations for correct answers
4. Questions should be challenging but fair for ${difficulty} level
5. Use proper scientific terminology and Pakistani educational context

Format your response as a JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why this answer is correct",
    "topic": "Specific topic name"
  }
]

Generate exactly ${count} questions. Ensure all questions are unique and educationally valuable.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const generatedQuestions = JSON.parse(jsonMatch[0]);
      
      // Convert to our Question format
      return generatedQuestions.map((q: any, index: number) => ({
        id: `generated-${Date.now()}-${index}`,
        subject,
        topic: q.topic || topic || 'General',
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      throw new Error('Failed to generate questions. Please try again.');
    }
  }

  async generateTopicQuestions(subject: Subject, specificTopic: string, count: number = 5): Promise<Question[]> {
    return this.generateQuestions({
      subject,
      topic: specificTopic,
      difficulty: 'medium',
      count
    });
  }

  async generateMixedDifficultyQuestions(subject: Subject, count: number = 10): Promise<Question[]> {
    const easyCount = Math.ceil(count * 0.4);
    const mediumCount = Math.ceil(count * 0.4);
    const hardCount = count - easyCount - mediumCount;

    const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
      this.generateQuestions({ subject, difficulty: 'easy', count: easyCount }),
      this.generateQuestions({ subject, difficulty: 'medium', count: mediumCount }),
      this.generateQuestions({ subject, difficulty: 'hard', count: hardCount })
    ]);

    return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  }
}

export const geminiService = new GeminiService();
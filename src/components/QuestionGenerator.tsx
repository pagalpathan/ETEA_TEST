import React, { useState } from 'react';
import { Sparkles, RefreshCw, Settings, Zap } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Question, Subject } from '../types';
import { motion } from 'framer-motion';

interface QuestionGeneratorProps {
  subject: Subject;
  onQuestionsGenerated: (questions: Question[]) => void;
}

const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({ 
  subject, 
  onQuestionsGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    count: 5,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    topic: ''
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const questions = await geminiService.generateQuestions({
        subject,
        topic: settings.topic || undefined,
        difficulty: settings.difficulty,
        count: settings.count
      });
      onQuestionsGenerated(questions);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickGenerate = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsGenerating(true);
    try {
      const questions = await geminiService.generateQuestions({
        subject,
        difficulty,
        count: 5
      });
      onQuestionsGenerated(questions);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Question Generator</h3>
            <p className="text-sm text-gray-600">Generate unlimited practice questions with AI</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg p-4 mb-4 space-y-4"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={settings.count}
                onChange={(e) => setSettings(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specific Topic (Optional)
              </label>
              <input
                type="text"
                value={settings.topic}
                onChange={(e) => setSettings(prev => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Cell Biology"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Generating...' : 'Generate Custom Set'}</span>
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => handleQuickGenerate('easy')}
            disabled={isGenerating}
            className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Easy 5</span>
          </button>
          <button
            onClick={() => handleQuickGenerate('medium')}
            disabled={isGenerating}
            className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Medium 5</span>
          </button>
          <button
            onClick={() => handleQuickGenerate('hard')}
            disabled={isGenerating}
            className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Hard 5</span>
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="mt-4 bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="text-sm font-medium text-gray-900">Generating questions...</p>
              <p className="text-xs text-gray-600">AI is creating {settings.count} {settings.difficulty} level questions for you</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
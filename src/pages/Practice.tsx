import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle, Bookmark, ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { subjects, sampleQuestions } from '../data/mockData';
import { Question, Subject } from '../types';
import { motion } from 'framer-motion';
import QuestionGenerator from '../components/QuestionGenerator';

const Practice: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionSource, setQuestionSource] = useState<'sample' | 'generated'>('sample');

  const filteredQuestions = selectedSubject 
    ? (questionSource === 'sample' 
        ? sampleQuestions.filter(q => q.subject === selectedSubject)
        : questions.filter(q => q.subject === selectedSubject))
    : (questionSource === 'sample' ? sampleQuestions : questions);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleQuestionsGenerated = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions);
    setQuestionSource('generated');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Set());
  };

  const switchToSampleQuestions = () => {
    setQuestionSource('sample');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Set());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    setAnsweredQuestions(prev => new Set([...prev, currentQuestionIndex]));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleBookmark = () => {
    if (currentQuestion) {
      setBookmarkedQuestions(prev => {
        const newSet = new Set(prev);
        if (newSet.has(currentQuestion.id)) {
          newSet.delete(currentQuestion.id);
        } else {
          newSet.add(currentQuestion.id);
        }
        return newSet;
      });
    }
  };

  const resetPractice = () => {
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnsweredQuestions(new Set());
    setQuestionSource('sample');
    setQuestions([]);
  };

  if (!selectedSubject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice MCQs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a subject to start practicing. Master each topic with detailed explanations and instant feedback.
          </p>
        </motion.div>

        {/* AI Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold">AI-Powered Question Generation</h2>
              <p className="text-purple-100">Generate unlimited practice questions with artificial intelligence</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Unlimited fresh questions</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>ETEA exam pattern</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Detailed explanations</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedSubject(subject.id)}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`${subject.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {subject.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">
                    {sampleQuestions.filter(q => q.subject === subject.id).length} sample questions
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  AI + Sample Questions
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Tips</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Read Carefully</h3>
                <p className="text-sm text-gray-600">Take your time to understand each question thoroughly.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Bookmark className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Bookmark Difficult</h3>
                <p className="text-sm text-gray-600">Save challenging questions for later review.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Study Explanations</h3>
                <p className="text-sm text-gray-600">Learn from detailed explanations after each answer.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={resetPractice}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Subjects</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className={`${subjects.find(s => s.id === selectedSubject)?.color} w-8 h-8 rounded-lg flex items-center justify-center text-lg`}>
                {subjects.find(s => s.id === selectedSubject)?.icon}
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                {subjects.find(s => s.id === selectedSubject)?.name}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={switchToSampleQuestions}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  questionSource === 'sample' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sample
              </button>
              <button
                onClick={() => setQuestionSource('generated')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  questionSource === 'generated' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                AI Generated
              </button>
            </div>
            <button
              onClick={resetPractice}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredQuestions.length > 0 ? (
              <>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</>
            ) : (
              <>No questions available - Generate some below!</>
            )}
          </div>
          {filteredQuestions.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                Answered: {answeredQuestions.size}/{filteredQuestions.length}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredQuestions.size / filteredQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* AI Question Generator */}
      <QuestionGenerator 
        subject={selectedSubject} 
        onQuestionsGenerated={handleQuestionsGenerated}
      />

      {/* Question Card */}
      {currentQuestion ? (
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {currentQuestion.topic}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQuestion.difficulty}
                </span>
                {questionSource === 'generated' && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Generated</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                {currentQuestion.question}
              </h2>
            </div>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                bookmarkedQuestions.has(currentQuestion.id)
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-red-500 bg-red-50 text-red-900'
                    : showExplanation && index === currentQuestion.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : showExplanation && index === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index
                      ? index === currentQuestion.correctAnswer
                        ? <CheckCircle className="w-4 h-4" />
                        : <XCircle className="w-4 h-4" />
                      : showExplanation && index === currentQuestion.correctAnswer
                      ? <CheckCircle className="w-4 h-4" />
                      : String.fromCharCode(65 + index)
                    }
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 p-4 rounded-lg"
            >
              <h3 className="font-medium text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
          <p className="text-gray-600 mb-4">
            Generate AI-powered questions using the generator above to start practicing!
          </p>
        </div>
      )}

      {/* Navigation */}
      {filteredQuestions.length > 0 && (
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-600">
            {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Practice;
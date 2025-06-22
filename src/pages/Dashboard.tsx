import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Trophy, Target, Clock, TrendingUp, Star, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subjects, recentResults, performanceData } from '../data/mockData';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      icon: Trophy,
      label: 'Tests Completed',
      value: user?.totalTests || 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      icon: Target,
      label: 'Average Score',
      value: `${user?.averageScore || 0}%`,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Study Streak',
      value: `${user?.streak || 0} days`,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      icon: TrendingUp,
      label: 'Questions Solved',
      value: '1,247',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  const pieData = performanceData.map((data, index) => ({
    name: subjects.find(s => s.id === data.subject)?.name || data.subject,
    value: data.accuracy,
    fill: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'][index]
  }));

  const motivationalQuotes = [
    "Success is where preparation and opportunity meet.",
    "The expert in anything was once a beginner.",
    "Every accomplishment starts with the decision to try.",
    "Your future is created by what you do today."
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-8"
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              {todayQuote}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(user?.joinedAt || '').toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Level: {user?.totalTests && user.totalTests > 10 ? 'Advanced' : user?.totalTests && user.totalTests > 5 ? 'Intermediate' : 'Beginner'}</span>
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/practice"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
            >
              <span>Start Practicing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="subject" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value}%`, 
                  name === 'accuracy' ? 'Accuracy' : name
                ]}
              />
              <Bar dataKey="accuracy" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Subject Focus</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
                fontSize={10}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}%`, 'Accuracy']} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Test Results</h2>
            <Link to="/mock-tests" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentResults.slice(0, 3).map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Practice Test #{result.testId}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.score >= 80 ? 'bg-green-100 text-green-800' :
                    result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.score}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
                  <span>{Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s</span>
                  <span>{new Date(result.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/practice"
              className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">Practice MCQs</span>
            </Link>
            <Link
              to="/mock-tests"
              className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="text-green-900 font-medium">Take Mock Test</span>
            </Link>
            <Link
              to="/past-papers"
              className="flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-purple-900 font-medium">Past Papers</span>
            </Link>
            <Link
              to="/bookmarks"
              className="flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Star className="w-5 h-5 text-orange-600" />
              <span className="text-orange-900 font-medium">Bookmarks</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
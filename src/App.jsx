import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Check } from 'lucide-react';

export default function App() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState({});
  const intervalRef = useRef(null);

  const tasks = [
    'ENTER PRICING ID',
    'ENTER WEIGHT',
    'SHUTTLE NEEDED',
    'ENTER REQUIRED PACKING',
    'GET 3RD PARTY COSTS',
    'MINI STORAGE?',
    'add terms',
    'GET COST FOR FULL PACK IF APPLICABLE',
    'TV DISMOUNT CAN BE ADDED FOR',
    'STORAGE CAN BE ADDED FOR',
    'FP COULD BE ADDED FOR'
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      if (timeLeft === 0) {
        setIsRunning(false);
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(20 * 60);
  };

  const selectTask = (task) => {
    setCurrentTask(task);
    resetTimer();
  };

  const toggleTaskCompletion = (task) => {
    setCompletedTasks(prev => ({
      ...prev,
      [task]: !prev[task]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6" />
            20-Minute Task Timer
          </h2>
          
          {currentTask && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-blue-600 font-medium">Current Task:</p>
              <p className="text-blue-800">{currentTask}</p>
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <div className={`text-6xl font-mono font-bold mb-4 ${
            timeLeft <= 60 ? 'text-red-500' : 'text-gray-800'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          {timeLeft === 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Time's up!</p>
              <p>Take a break or move to the next task.</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            disabled={timeLeft === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={resetTimer}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">Tasks:</p>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                currentTask === task 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${completedTasks[task] ? 'opacity-60' : ''}`}
            >
              <button
                onClick={() => toggleTaskCompletion(task)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  completedTasks[task]
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {completedTasks[task] && <Check className="w-3 h-3" />}
              </button>
              
              <button
                onClick={() => selectTask(task)}
                className={`flex-1 text-left transition-colors ${
                  completedTasks[task] 
                    ? 'text-gray-500 line-through' 
                    : currentTask === task 
                      ? 'text-blue-800 font-medium' 
                      : 'text-gray-700'
                }`}
              >
                {task}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

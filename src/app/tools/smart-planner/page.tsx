'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateTaskAnalysis } from '@/lib/gemini';

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  deadline: string;
  timeEstimate: string;
  completed: boolean;
  subtasks: Task[];
}

interface SubtaskAnalysis {
  title: string;
  priority: string;
  deadline: string;
  timeEstimate: string;
}

interface TaskAnalysis {
  category: string;
  priority: string;
  deadline: string;
  timeEstimate: string;
  subtasks: SubtaskAnalysis[];
}

export default function SmartPlannerPage() {
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Work', 'Personal', 'Health', 'Study', 'Shopping', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    setIsLoading(true);
    
    try {
      // Call the Gemini API to analyze the task
      const taskAnalysis: TaskAnalysis = await generateTaskAnalysis(taskInput);
      
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskInput,
        category: taskAnalysis.category,
        priority: taskAnalysis.priority,
        deadline: taskAnalysis.deadline,
        timeEstimate: taskAnalysis.timeEstimate,
        completed: false,
        subtasks: taskAnalysis.subtasks.map((st: SubtaskAnalysis, index: number) => ({
          id: `${Date.now()}-${index}`,
          title: st.title,
          category: taskAnalysis.category,
          priority: st.priority,
          deadline: st.deadline,
          timeEstimate: st.timeEstimate,
          completed: false,
          subtasks: []
        }))
      };

      setTasks(prev => [...prev, newTask]);
      setTaskInput('');
    } catch (error) {
      console.error('Error analyzing task:', error);
      alert('Error analyzing task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Planner</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Task Input Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="task" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter your task or goal
                </label>
                <input
                  type="text"
                  id="task"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g., Prepare presentation for client meeting next week"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !taskInput.trim()}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Add Task'}
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="space-y-6">
            {tasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="space-y-1">
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {task.category}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          Priority: {task.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          Due: {task.deadline}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          Est: {task.timeEstimate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <select
                    value={task.category}
                    onChange={(e) => updateTask(task.id, { category: e.target.value })}
                    className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Subtasks */}
                {task.subtasks.length > 0 && (
                  <div className="mt-4 ml-8 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtasks:</h4>
                    {task.subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleTaskComplete(subtask.id)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <p className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            {subtask.title}
                          </p>
                          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Priority: {subtask.priority}</span>
                            <span>Est: {subtask.timeEstimate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export default function TodoListPage() {
  const [taskInput, setTaskInput] = useState('');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [tasks, setTasks] = useState<Task[]>([]);

  const categories = ['Work', 'Personal', 'Health', 'Study', 'Shopping', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskInput,
      category: taskCategory,
      completed: false
    };

    setTasks(prev => [...prev, newTask]);
    setTaskInput('');
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const updateTaskCategory = (taskId: string, category: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return { ...task, category };
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TO-DO List</h1>
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
                  Add a new task
                </label>
                <input
                  type="text"
                  id="task"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="e.g., Buy groceries"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button
                type="submit"
                disabled={!taskInput.trim()}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add a task to get started!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div>
                        <h3 className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <span className="text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={task.category}
                        onChange={(e) => updateTaskCategory(task.id, e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
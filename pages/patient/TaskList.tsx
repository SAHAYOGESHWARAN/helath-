import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Task } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ClipboardDocumentListIcon, PlusIcon } from '../../components/shared/Icons';

const TaskItem: React.FC<{
  task: Task;
  onToggle: (id: string) => void;
  isJustCompleted: boolean;
  onAnimationEnd: () => void;
}> = ({ task, onToggle, isJustCompleted, onAnimationEnd }) => {
  const isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() : false;

  return (
    <div
      className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
        isJustCompleted ? 'animate-mark-complete' : task.completed ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
      }`}
      onAnimationEnd={onAnimationEnd}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        aria-labelledby={`task-${task.id}`}
      />
      <span
        id={`task-${task.id}`}
        className={`ml-3 flex-grow text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.text}
      </span>
      {task.dueDate && (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            task.completed ? 'text-gray-400' : isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500'
          }`}
        >
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
        </span>
      )}
    </div>
  );
};

const TaskList: React.FC = () => {
  const { user, addTask, toggleTaskCompletion } = useAuth();
  const [newTaskText, setNewTaskText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  const tasks = useMemo(() => user?.tasks || [], [user]);

  const { completedCount, totalCount, progress } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    return {
      completedCount: completed,
      totalCount: total,
      progress: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask({ text: newTaskText, dueDate: newDueDate || undefined });
    setNewTaskText('');
    setNewDueDate('');
  };

  const handleToggle = (taskId: string) => {
    toggleTaskCompletion(taskId);
    setJustCompleted(prev => {
      const newSet = new Set(prev);
      newSet.add(taskId);
      return newSet;
    });
  };

  return (
    <div>
      <PageHeader title="My Tasks" subtitle="Stay on top of your health goals." />

      <Card>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Today's Health Tasks</h3>
            <span className="text-sm font-medium text-gray-500">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {tasks.length > 0 ? (
            tasks
              .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  isJustCompleted={justCompleted.has(task.id)}
                  onAnimationEnd={() =>
                    setJustCompleted(prev => {
                      const newSet = new Set(prev);
                      newSet.delete(task.id);
                      return newSet;
                    })
                  }
                />
              ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="font-semibold">No tasks yet!</p>
              <p>Add a task below to get started.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAddTask} className="border-t pt-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              aria-label="Due date"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10 flex-shrink-0"
              aria-label="Add task"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TaskList;
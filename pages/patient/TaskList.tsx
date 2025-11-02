import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Task, Subtask } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ClipboardDocumentListIcon, PlusIcon, TrashIcon } from '../../components/shared/Icons';

const SubtaskItem: React.FC<{
  task: Task;
  subtask: Subtask;
  onToggle: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string, subtaskId: string) => void;
}> = ({ task, subtask, onToggle, onDelete }) => {
  return (
    <div className="flex items-center group">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={() => onToggle(task.id, subtask.id)}
        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
        aria-labelledby={`subtask-${subtask.id}`}
      />
      <span
        id={`subtask-${subtask.id}`}
        className={`ml-3 flex-grow text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}
      >
        {subtask.text}
      </span>
      <button
        onClick={() => onDelete(task.id, subtask.id)}
        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete subtask: ${subtask.text}`}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};


const TaskItem: React.FC<{
  task: Task;
  onToggle: (id: string) => void;
  onAddSubtask: (taskId: string, text: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  isJustCompleted: boolean;
  onAnimationEnd: () => void;
}> = ({ task, onToggle, onAddSubtask, onToggleSubtask, onDeleteSubtask, isJustCompleted, onAnimationEnd }) => {
  const isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() : false;
  const [newSubtaskText, setNewSubtaskText] = useState('');
  
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    onAddSubtask(task.id, newSubtaskText);
    setNewSubtaskText('');
  };

  const subtaskProgress = useMemo(() => {
    if (!task.subtasks || task.subtasks.length === 0) return 0;
    const completed = task.subtasks.filter(st => st.completed).length;
    return (completed / task.subtasks.length) * 100;
  }, [task.subtasks]);

  return (
    <div
      className={`p-3 rounded-lg transition-all duration-300 ${
        isJustCompleted ? 'animate-mark-complete' : task.completed ? 'bg-gray-100' : 'bg-white border border-gray-200 hover:bg-gray-50'
      }`}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          aria-labelledby={`task-${task.id}`}
        />
        <span
          id={`task-${task.id}`}
          className={`ml-3 flex-grow text-gray-800 ${task.completed ? 'line-through text-gray-500' : 'font-medium'}`}
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
      {/* Subtasks rendering */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="pl-8 pt-2 space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5 my-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${subtaskProgress}%` }} />
          </div>
          {task.subtasks.map(subtask => (
            <SubtaskItem key={subtask.id} task={task} subtask={subtask} onToggle={onToggleSubtask} onDelete={onDeleteSubtask} />
          ))}
        </div>
      )}
      <div className="pl-8 pt-2">
        <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4 text-gray-400"/>
          <input
            type="text"
            value={newSubtaskText}
            onChange={e => setNewSubtaskText(e.target.value)}
            placeholder="Add a subtask..."
            className="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            aria-label={`Add subtask for ${task.text}`}
          />
        </form>
      </div>
    </div>
  );
};

const TaskList: React.FC = () => {
  const { user, addTask, toggleTaskCompletion, addSubtask, toggleSubtaskCompletion, deleteSubtask } = useAuth();
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
                  onAddSubtask={addSubtask}
                  onToggleSubtask={toggleSubtaskCompletion}
                  onDeleteSubtask={deleteSubtask}
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
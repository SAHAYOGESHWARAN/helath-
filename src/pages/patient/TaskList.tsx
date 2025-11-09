import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Task, Subtask, TaskPriority } from '../../types';
import { Card } from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ClipboardDocumentListIcon, PlusIcon, TrashIcon, FlagIcon } from '../../components/shared/Icons';

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

const PriorityIndicator: React.FC<{ priority?: TaskPriority }> = ({ priority = 'Medium' }) => {
    const colorClass = {
        High: 'text-red-500',
        Medium: 'text-amber-500',
        Low: 'text-blue-500',
    }[priority];
    return <FlagIcon className={`w-5 h-5 ${colorClass}`} />;
};

const TaskItem: React.FC<{
  task: Task;
  onToggle: (id: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onAddSubtask: (taskId: string, text: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  isJustCompleted: boolean;
  onAnimationEnd: () => void;
}> = ({ task, onToggle, onUpdateTask, onAddSubtask, onToggleSubtask, onDeleteSubtask, isJustCompleted, onAnimationEnd }) => {
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
        <div className="ml-3 flex items-center gap-2 flex-grow min-w-0">
            <PriorityIndicator priority={task.priority} />
            <span
              id={`task-${task.id}`}
              className={`flex-grow text-gray-800 ${task.completed ? 'line-through text-gray-500' : 'font-medium'}`}
            >
              {task.text}
            </span>
        </div>
        <select 
            value={task.priority || 'Medium'}
            onChange={(e) => onUpdateTask(task.id, { priority: e.target.value as TaskPriority })}
            className="text-xs bg-transparent border-0 rounded-md focus:ring-1 focus:ring-primary-500 p-1 mr-2"
            aria-label={`Priority for ${task.text}`}
        >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
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
  const { user, addTask, updateTask, toggleTaskCompletion, addSubtask, toggleSubtaskCompletion, deleteSubtask } = useAuth();
  const [newTask, setNewTask] = useState({ text: '', dueDate: '', priority: 'Medium' as TaskPriority });
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  const tasks = useMemo(() => user?.tasks || [], [user]);
  
  const priorityOrder: Record<TaskPriority, number> = { High: 1, Medium: 2, Low: 3 };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (!a.completed) {
            const priorityA = priorityOrder[a.priority || 'Medium'];
            const priorityB = priorityOrder[b.priority || 'Medium'];
            if (priorityA !== priorityB) return priorityA - priorityB;
            if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
        }
        if (a.dueDate && b.dueDate) return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });
  }, [tasks]);

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
    if (!newTask.text.trim()) return;
    addTask({
      text: newTask.text,
      dueDate: newTask.dueDate || undefined,
      priority: newTask.priority,
    });
    setNewTask({ text: '', dueDate: '', priority: 'Medium' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewTask(prev => ({...prev, [name]: value}));
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
          {sortedTasks.length > 0 ? (
            sortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onUpdateTask={updateTask}
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
              name="text"
              value={newTask.text}
              onChange={handleInputChange}
              placeholder="Add a new task..."
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
             <select name="priority" value={newTask.priority} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
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

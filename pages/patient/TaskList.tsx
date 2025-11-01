"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Icons_1 = require("../../components/shared/Icons");
var SubtaskItem = function (_a) {
    var task = _a.task, subtask = _a.subtask, onToggle = _a.onToggle, onDelete = _a.onDelete;
    return (<div className="flex items-center group">
      <input type="checkbox" checked={subtask.completed} onChange={function () { return onToggle(task.id, subtask.id); }} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" aria-labelledby={"subtask-".concat(subtask.id)}/>
      <span id={"subtask-".concat(subtask.id)} className={"ml-3 flex-grow text-sm ".concat(subtask.completed ? 'line-through text-gray-400' : 'text-gray-600')}>
        {subtask.text}
      </span>
      <button onClick={function () { return onDelete(task.id, subtask.id); }} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={"Delete subtask: ".concat(subtask.text)}>
        <Icons_1.TrashIcon className="w-4 h-4"/>
      </button>
    </div>);
};
var TaskItem = function (_a) {
    var task = _a.task, onToggle = _a.onToggle, onAddSubtask = _a.onAddSubtask, onToggleSubtask = _a.onToggleSubtask, onDeleteSubtask = _a.onDeleteSubtask, isJustCompleted = _a.isJustCompleted, onAnimationEnd = _a.onAnimationEnd;
    var isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() : false;
    var _b = (0, react_1.useState)(''), newSubtaskText = _b[0], setNewSubtaskText = _b[1];
    var handleAddSubtask = function (e) {
        e.preventDefault();
        if (!newSubtaskText.trim())
            return;
        onAddSubtask(task.id, newSubtaskText);
        setNewSubtaskText('');
    };
    var subtaskProgress = (0, react_1.useMemo)(function () {
        if (!task.subtasks || task.subtasks.length === 0)
            return 0;
        var completed = task.subtasks.filter(function (st) { return st.completed; }).length;
        return (completed / task.subtasks.length) * 100;
    }, [task.subtasks]);
    return (<div className={"p-3 rounded-lg transition-all duration-300 ".concat(isJustCompleted ? 'animate-mark-complete' : task.completed ? 'bg-gray-100' : 'bg-white border border-gray-200 hover:bg-gray-50')} onAnimationEnd={onAnimationEnd}>
      <div className="flex items-center">
        <input type="checkbox" checked={task.completed} onChange={function () { return onToggle(task.id); }} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" aria-labelledby={"task-".concat(task.id)}/>
        <span id={"task-".concat(task.id)} className={"ml-3 flex-grow text-gray-800 ".concat(task.completed ? 'line-through text-gray-500' : 'font-medium')}>
          {task.text}
        </span>
        {task.dueDate && (<span className={"text-xs font-medium px-2 py-1 rounded-full ".concat(task.completed ? 'text-gray-400' : isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500')}>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
          </span>)}
      </div>
      {/* Subtasks rendering */}
      {task.subtasks && task.subtasks.length > 0 && (<div className="pl-8 pt-2 space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5 my-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "".concat(subtaskProgress, "%") }}/>
          </div>
          {task.subtasks.map(function (subtask) { return (<SubtaskItem key={subtask.id} task={task} subtask={subtask} onToggle={onToggleSubtask} onDelete={onDeleteSubtask}/>); })}
        </div>)}
      <div className="pl-8 pt-2">
        <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
          <Icons_1.PlusIcon className="w-4 h-4 text-gray-400"/>
          <input type="text" value={newSubtaskText} onChange={function (e) { return setNewSubtaskText(e.target.value); }} placeholder="Add a subtask..." className="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none" aria-label={"Add subtask for ".concat(task.text)}/>
        </form>
      </div>
    </div>);
};
var TaskList = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, addTask = _a.addTask, toggleTaskCompletion = _a.toggleTaskCompletion, addSubtask = _a.addSubtask, toggleSubtaskCompletion = _a.toggleSubtaskCompletion, deleteSubtask = _a.deleteSubtask;
    var _b = (0, react_1.useState)(''), newTaskText = _b[0], setNewTaskText = _b[1];
    var _c = (0, react_1.useState)(''), newDueDate = _c[0], setNewDueDate = _c[1];
    var _d = (0, react_1.useState)(new Set()), justCompleted = _d[0], setJustCompleted = _d[1];
    var tasks = (0, react_1.useMemo)(function () { return (user === null || user === void 0 ? void 0 : user.tasks) || []; }, [user]);
    var _e = (0, react_1.useMemo)(function () {
        var total = tasks.length;
        var completed = tasks.filter(function (t) { return t.completed; }).length;
        return {
            completedCount: completed,
            totalCount: total,
            progress: total > 0 ? (completed / total) * 100 : 0,
        };
    }, [tasks]), completedCount = _e.completedCount, totalCount = _e.totalCount, progress = _e.progress;
    var handleAddTask = function (e) {
        e.preventDefault();
        if (!newTaskText.trim())
            return;
        addTask({ text: newTaskText, dueDate: newDueDate || undefined });
        setNewTaskText('');
        setNewDueDate('');
    };
    var handleToggle = function (taskId) {
        toggleTaskCompletion(taskId);
        setJustCompleted(function (prev) {
            var newSet = new Set(prev);
            newSet.add(taskId);
            return newSet;
        });
    };
    return (<div>
      <PageHeader_1.default title="My Tasks" subtitle="Stay on top of your health goals."/>

      <Card_1.default>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Today's Health Tasks</h3>
            <span className="text-sm font-medium text-gray-500">
              {completedCount} / {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: "".concat(progress, "%") }}></div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {tasks.length > 0 ? (tasks
            .sort(function (a, b) { return (a.completed === b.completed ? 0 : a.completed ? 1 : -1); })
            .map(function (task) { return (<TaskItem key={task.id} task={task} onToggle={handleToggle} onAddSubtask={addSubtask} onToggleSubtask={toggleSubtaskCompletion} onDeleteSubtask={deleteSubtask} isJustCompleted={justCompleted.has(task.id)} onAnimationEnd={function () {
                return setJustCompleted(function (prev) {
                    var newSet = new Set(prev);
                    newSet.delete(task.id);
                    return newSet;
                });
            }}/>); })) : (<div className="text-center py-10 text-gray-500">
              <Icons_1.ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
              <p className="font-semibold">No tasks yet!</p>
              <p>Add a task below to get started.</p>
            </div>)}
        </div>

        <form onSubmit={handleAddTask} className="border-t pt-4">
          <div className="flex items-center gap-3">
            <input type="text" value={newTaskText} onChange={function (e) { return setNewTaskText(e.target.value); }} placeholder="Add a new task..." className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            <input type="date" value={newDueDate} onChange={function (e) { return setNewDueDate(e.target.value); }} className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" aria-label="Due date"/>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10 flex-shrink-0" aria-label="Add task">
              <Icons_1.PlusIcon className="w-5 h-5"/>
            </button>
          </div>
        </form>
      </Card_1.default>
    </div>);
};
exports.default = TaskList;

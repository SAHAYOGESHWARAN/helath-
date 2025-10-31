
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication, HealthGoal, Task, Subtask, MedicalCondition, Allergy, Appointment } from '../../types';
import { PillIcon, CheckCircleIcon, PlusIcon, HeartIcon, ExclamationTriangleIcon, DocumentDuplicateIcon, ChartBarIcon, BeakerIcon, ShieldCheckIcon, UserGroupIcon, ChevronDownIcon, DumbbellIcon, ClipboardDocumentListIcon, TrashIcon, PencilAltIcon, DownloadIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import Tabs from '../../components/shared/Tabs';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { jsPDF } from 'jspdf';

// --- Medication Management Components (from Medications.tsx) ---

const MedicationCard: React.FC<{ med: Medication, onRequestRefill: (name: string) => void }> = ({ med, onRequestRefill }) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${med.status === 'Active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <PillIcon />
            </div>
            <div>
                <p className="font-bold text-lg text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                 {med.status === 'Active' && typeof med.adherence === 'number' && (
                    <div className="flex items-center text-xs mt-1">
                        <span className="font-semibold mr-1.5">Adherence:</span>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${med.adherence}%` }}></div>
                        </div>
                        <span className="ml-1.5 font-medium text-emerald-700">{med.adherence}%</span>
                    </div>
                 )}
            </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
             {med.status === 'Active' && <button onClick={() => onRequestRefill(med.name)} className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-full">Request Refill</button>}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
        </div>
    </div>
);

const MedicationsTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    
    const handleRequestRefill = (medName: string) => {
        showToast(`Refill requested for ${medName}. Your provider has been notified.`, 'info');
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">My Medication List</h2>
            <div className="space-y-4">
                {user?.medications && user.medications.length > 0 ? user.medications.map(med => <MedicationCard key={med.id} med={med} onRequestRefill={handleRequestRefill}/>) : <p className="text-gray-500 text-center">You have no medications on file.</p>}
            </div>
        </Card>
    );
};

// --- Vitals ---

const VitalsTab: React.FC = () => {
    const { user } = useAuth();
    const vitalsChartData = (user?.vitals || []).slice(0, 7).reverse().map(v => ({
        date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
        'Systolic': parseInt(v.bloodPressure.split('/')[0]),
        'Diastolic': parseInt(v.bloodPressure.split('/')[1]),
        'Heart Rate': v.heartRate
    }));
    return (
        <Card title="Vitals Trend - Blood Pressure & Heart Rate">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'HR (bpm)', angle: -90, position: 'insideRight' }}/>
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Systolic" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="Diastolic" stroke="#3b82f6" />
                    <Line yAxisId="right" type="monotone" dataKey="Heart Rate" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

// --- Lab Results ---

const LabResultsTab: React.FC = () => {
    const { user } = useAuth();
    const labResults = user?.labResults || [];
    const [openResultId, setOpenResultId] = useState<string | null>(labResults.length > 0 ? labResults[0].id : null);

    const toggleResult = (id: string) => {
        setOpenResultId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="space-y-4">
            {labResults.length > 0 ? (
                labResults.map(result => {
                    const isOpen = openResultId === result.id;
                    return (
                        <div key={result.id} className="border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md overflow-hidden">
                            <button
                                onClick={() => toggleResult(result.id)}
                                className="w-full p-4 flex justify-between items-center cursor-pointer text-left"
                                aria-expanded={isOpen}
                                aria-controls={`lab-details-${result.id}`}
                            >
                                <div className="font-bold text-lg text-gray-800">
                                    {result.testName} - {new Date(result.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                id={`lab-details-${result.id}`}
                                className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Component</th>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Value</th>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Reference Range</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {result.components.map(comp => (
                                                        <tr key={comp.name} className={`hover:bg-gray-50 ${comp.isAbnormal ? 'bg-red-50' : 'bg-white'}`}>
                                                            <td className="px-4 py-2 font-medium text-gray-800">{comp.name}</td>
                                                            <td className={`px-4 py-2 font-semibold ${comp.isAbnormal ? 'text-red-600' : 'text-gray-800'}`}>{comp.value}</td>
                                                            <td className="px-4 py-2 text-gray-500">{comp.referenceRange}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <Card>
                    <p className="text-gray-500 text-center">No lab results on file.</p>
                </Card>
            )}
        </div>
    );
};

// --- Health Goals (from HealthGoalsPage.tsx) ---

const GoalCard: React.FC<{
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onDelete: (goal: HealthGoal) => void;
}> = ({ goal, onEdit, onDelete }) => {
  const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
  const isAchieved = goal.current >= goal.target;

  return (
    <Card className={`transition-all duration-300 ${isAchieved ? 'bg-emerald-50 border-emerald-200 shadow-lg' : 'bg-white hover:shadow-md'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{goal.title}</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            {goal.current.toLocaleString()} / <span className="text-xl text-gray-500">{goal.target.toLocaleString()} {goal.unit}</span>
          </p>
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button onClick={() => onEdit(goal)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" aria-label={`Edit goal: ${goal.title}`}><PencilAltIcon className="w-5 h-5"/></button>
          <button onClick={() => onDelete(goal)} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label={`Delete goal: ${goal.title}`}><TrashIcon className="w-5 h-5"/></button>
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all duration-500 ${isAchieved ? 'bg-emerald-500' : 'bg-primary-600'}`}
            style={{ width: `${progress}%` }}
          >
            {progress > 15 && `${progress.toFixed(0)}%`}
          </div>
        </div>
      </div>
      {isAchieved && (
        <div className="mt-3 flex items-center text-emerald-600 font-semibold text-sm">
          <CheckCircleIcon className="w-5 h-5 mr-2"/>
          Goal Achieved! Well done!
        </div>
      )}
    </Card>
  );
};

const HealthGoalsTab: React.FC = () => {
    const { user, addHealthGoal, updateHealthGoal, deleteHealthGoal } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
    const [deletingGoal, setDeletingGoal] = useState<HealthGoal | null>(null);

    const goals = user?.healthGoals || [];

    const handleOpenModal = (goal: HealthGoal | null = null) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleSaveGoal = (values: Omit<HealthGoal, 'id'> | HealthGoal) => {
        if ('id' in values) { updateHealthGoal(values); showToast('Goal updated!', 'success'); } 
        else { addHealthGoal(values); showToast('New goal added!', 'success'); }
        setIsModalOpen(false);
        setEditingGoal(null);
    };

    const handleConfirmDelete = () => {
        if (deletingGoal) { deleteHealthGoal(deletingGoal.id); showToast('Goal deleted.', 'success'); setDeletingGoal(null); }
    };
    
    return (
        <>
            <PageHeader title="Health Goals" subtitle="Set targets and track your progress." buttonText="Add New Goal" onButtonClick={() => handleOpenModal()} />
            {goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => <GoalCard key={goal.id} goal={goal} onEdit={handleOpenModal} onDelete={setDeletingGoal} />)}
                </div>
            ) : (
                <Card><div className="text-center py-12 text-gray-500"><DumbbellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" /><h3 className="text-xl font-semibold text-gray-800">No Goals Set Yet</h3></div></Card>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGoal ? 'Edit Goal' : 'Add New Goal'}>
                <Formik initialValues={editingGoal || { title: '', current: 0, target: 1, unit: '' }} validationSchema={Yup.object().shape({ title: Yup.string().required(), current: Yup.number().min(0).required(), target: Yup.number().positive().required(), unit: Yup.string().required() })} onSubmit={handleSaveGoal}>
                    {({ isSubmitting }) => (
                        <Form className="space-y-4"><Field name="title" placeholder="e.g., Daily Steps" className="w-full p-2 border rounded" /><div className="grid grid-cols-2 gap-4"><Field type="number" name="current" className="w-full p-2 border rounded" /><Field type="number" name="target" className="w-full p-2 border rounded" /></div><Field name="unit" placeholder="e.g., steps, lbs, minutes" className="w-full p-2 border rounded" /><div className="flex justify-end space-x-2"><button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg">Save</button></div></Form>
                    )}
                </Formik>
            </Modal>
            <Modal isOpen={!!deletingGoal} onClose={() => setDeletingGoal(null)} title="Confirm Deletion" footer={<><button onClick={() => setDeletingGoal(null)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button><button onClick={handleConfirmDelete} className="bg-red-600 text-white py-2 px-4 rounded-lg">Delete</button></>}>
                <p>Are you sure you want to delete the goal "<strong>{deletingGoal?.title}</strong>"?</p>
            </Modal>
        </>
    )
}

// --- Tasks (from TaskList.tsx) ---
const SubtaskItem: React.FC<{task: Task; subtask: Subtask; onToggle: (taskId: string, subtaskId: string) => void; onDelete: (taskId: string, subtaskId: string) => void;}> = ({ task, subtask, onToggle, onDelete }) => (
  <div className="flex items-center group"><input type="checkbox" checked={subtask.completed} onChange={() => onToggle(task.id, subtask.id)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" /><span className={`ml-3 flex-grow text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>{subtask.text}</span><button onClick={() => onDelete(task.id, subtask.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4 h-4" /></button></div>
);

const TaskItem: React.FC<{ task: Task; onToggle: (id: string) => void; onAddSubtask: (taskId: string, text: string) => void; onToggleSubtask: (taskId: string, subtaskId: string) => void; onDeleteSubtask: (taskId: string, subtaskId: string) => void; isJustCompleted: boolean; onAnimationEnd: () => void;}> = ({ task, onToggle, onAddSubtask, onToggleSubtask, onDeleteSubtask, isJustCompleted, onAnimationEnd }) => {
  const isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() : false;
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const handleAddSubtask = (e: React.FormEvent) => { e.preventDefault(); if (!newSubtaskText.trim()) return; onAddSubtask(task.id, newSubtaskText); setNewSubtaskText(''); };
  const subtaskProgress = useMemo(() => { if (!task.subtasks || task.subtasks.length === 0) return 0; const completed = task.subtasks.filter(st => st.completed).length; return (completed / task.subtasks.length) * 100; }, [task.subtasks]);

  return (
    <div className={`p-3 rounded-lg transition-all duration-300 ${isJustCompleted ? 'animate-mark-complete' : task.completed ? 'bg-gray-100' : 'bg-white border border-gray-200 hover:bg-gray-50'}`} onAnimationEnd={onAnimationEnd}>
      <div className="flex items-center"><input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer" /><span className={`ml-3 flex-grow text-gray-800 ${task.completed ? 'line-through text-gray-500' : 'font-medium'}`}>{task.text}</span>{task.dueDate && (<span className={`text-xs font-medium px-2 py-1 rounded-full ${task.completed ? 'text-gray-400' : isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500'}`}>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>)}</div>
      {task.subtasks && task.subtasks.length > 0 && (<div className="pl-8 pt-2 space-y-2"><div className="w-full bg-gray-200 rounded-full h-1.5 my-2"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${subtaskProgress}%` }} /></div>{task.subtasks.map(subtask => (<SubtaskItem key={subtask.id} task={task} subtask={subtask} onToggle={onToggleSubtask} onDelete={onDeleteSubtask} />))}</div>)}
      <div className="pl-8 pt-2"><form onSubmit={handleAddSubtask} className="flex items-center gap-2"><PlusIcon className="w-4 h-4 text-gray-400"/><input type="text" value={newSubtaskText} onChange={e => setNewSubtaskText(e.target.value)} placeholder="Add a subtask..." className="flex-grow bg-transparent text-sm placeholder-gray-400 focus:outline-none"/></form></div>
    </div>
  );
};

const TasksTab: React.FC = () => {
    const { user, addTask, toggleTaskCompletion, addSubtask, toggleSubtaskCompletion, deleteSubtask } = useAuth();
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());
    const tasks = user?.tasks || [];
    const { completedCount, totalCount, progress } = useMemo(() => { const total = tasks.length; const completed = tasks.filter(t => t.completed).length; return { completedCount: completed, totalCount: total, progress: total > 0 ? (completed / total) * 100 : 0 }; }, [tasks]);
    const handleAddTask = (e: React.FormEvent) => { e.preventDefault(); if (!newTaskText.trim()) return; addTask({ text: newTaskText, dueDate: newDueDate || undefined }); setNewTaskText(''); setNewDueDate(''); };
    const handleToggle = (taskId: string) => { toggleTaskCompletion(taskId); setJustCompleted(prev => new Set(prev).add(taskId)); };

    return (
         <Card>
            <div className="mb-4"><div className="flex justify-between items-center mb-2"><h3 className="text-lg font-semibold text-gray-700">My Health Tasks</h3><span className="text-sm font-medium text-gray-500">{completedCount} / {totalCount} completed</span></div><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div>
            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
                {tasks.length > 0 ? (tasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)).map(task => (<TaskItem key={task.id} task={task} onToggle={handleToggle} onAddSubtask={addSubtask} onToggleSubtask={toggleSubtaskCompletion} onDeleteSubtask={deleteSubtask} isJustCompleted={justCompleted.has(task.id)} onAnimationEnd={() => setJustCompleted(prev => { const newSet = new Set(prev); newSet.delete(task.id); return newSet; })}/>))) : (<div className="text-center py-10 text-gray-500"><ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" /><p className="font-semibold">No tasks yet!</p><p>Add a task below to get started.</p></div>)}
            </div>
            <form onSubmit={handleAddTask} className="border-t pt-4"><div className="flex items-center gap-3"><input type="text" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Add a new task..." className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" /><input type="date" value={newDueDate} onChange={e => setNewDueDate(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" /><button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold p-2 rounded-lg flex items-center justify-center w-10 h-10 flex-shrink-0"><PlusIcon className="w-5 h-5" /></button></div></form>
        </Card>
    );
};

// --- History (from VisitHistory.tsx) ---
const HistoryTab: React.FC = () => {
    const { user, appointments } = useAuth();
    const pastAppointments = useMemo(() => [...appointments].filter(a => a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [appointments]);
    const handleDownloadPdf = (appt: Appointment) => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Visit Summary', 20, 20);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Patient: ${user?.name}`, 20, 35);
        doc.text(`Provider: ${appt.providerName}`, 20, 42);
        doc.text(`Date of Visit: ${new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 49);
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary & Notes:', 20, 65);
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(appt.visitSummary || 'No summary available.', 170);
        doc.text(summaryLines, 20, 72);
        doc.save(`Visit_Summary_${appt.date}.pdf`);
    };
    return (
        <Card>
            <div className="space-y-4">
                {pastAppointments.length > 0 ? pastAppointments.map(appt => (
                    <details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md">
                        <summary className="p-4 flex justify-between items-center cursor-pointer list-none">
                            <p className="font-bold text-lg text-gray-800">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} - {appt.providerName}</p>
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-4 pb-4 border-t border-gray-200">
                             {appt.visitSummary ? (<div><div className="flex justify-between items-center mb-1"><p className="font-medium text-gray-500">Visit Summary & Notes</p><button onClick={() => handleDownloadPdf(appt)} className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-800"><DownloadIcon className="w-4 h-4 mr-1" /> Download PDF</button></div><p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{appt.visitSummary}</p></div>) : (<p className="text-gray-600">No summary was provided for this visit.</p>)}
                        </div>
                    </details>
                )) : (<p className="text-center text-gray-500 py-8">You have no past appointments.</p>)}
            </div>
        </Card>
    );
};

// --- Conditions & Allergies with Self-Report ---
const ConditionAllergySchema = Yup.object().shape({ type: Yup.string().required(), name: Yup.string().required(), severity: Yup.string().when('type', { is: 'allergy', then: (schema) => schema.required(), otherwise: (schema) => schema.notRequired() }), reaction: Yup.string().when('type', { is: 'allergy', then: (schema) => schema.required(), otherwise: (schema) => schema.notRequired() }) });

const ConditionsAndAllergiesTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelfReport = (values: any) => {
        if (values.type === 'condition') {
            const newCondition: MedicalCondition = { id: `c_${Date.now()}`, name: values.name, status: 'Active' };
            updateUser(u => ({...u, conditions: [...(u.conditions || []), newCondition]}));
            showToast('Condition reported. Your provider will review this information.', 'success');
        } else {
            const newAllergy: Allergy = { id: `a_${Date.now()}`, name: values.name, severity: values.severity, reaction: values.reaction, status: 'Active' };
            updateUser(u => ({...u, allergies: [...(u.allergies || []), newAllergy]}));
            showToast('Allergy reported. Your provider will review this information.', 'success');
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <div className="flex items-center text-primary-600 mb-2"><HeartIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Conditions</h3></div>
                    <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {user?.conditions?.length ? user.conditions.map(c => <li key={c.id}>{c.name} ({c.status})</li>) : <li>None reported</li>}
                    </ul>
                </Card>
                <Card>
                    <div className="flex items-center text-red-600 mb-2"><ExclamationTriangleIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Allergies</h3></div>
                    <ul className="space-y-1 text-gray-700 list-disc list-inside">
                        {user?.allergies?.length ? user.allergies.map(a => <li key={a.id}>{a.name} ({a.severity})</li>) : <li>No known allergies</li>}
                    </ul>
                </Card>
            </div>
             <div className="text-center">
                <button onClick={() => setIsModalOpen(true)} className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-6 rounded-lg text-sm flex items-center justify-center mx-auto">
                    <PlusIcon className="w-4 h-4 mr-2"/> Report a New Condition or Allergy
                </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Self-Report Condition or Allergy">
                <Formik initialValues={{ type: 'condition', name: '', severity: 'Mild', reaction: '' }} validationSchema={ConditionAllergySchema} onSubmit={handleSelfReport}>
                    {({ values, isSubmitting }) => (
                        <Form className="space-y-4">
                            <Field as="select" name="type" className="w-full p-2 border rounded"><option value="condition">Condition</option><option value="allergy">Allergy</option></Field>
                            <Field name="name" placeholder={values.type === 'condition' ? 'Condition name (e.g., Seasonal Allergies)' : 'Allergen name (e.g., Ibuprofen)'} className="w-full p-2 border rounded" />
                            {values.type === 'allergy' && (
                                <div className="space-y-4 animate-fade-in">
                                    <Field as="select" name="severity" className="w-full p-2 border rounded"><option value="Mild">Mild</option><option value="Moderate">Moderate</option><option value="Severe">Severe</option></Field>
                                    <Field name="reaction" placeholder="Reaction (e.g., Hives)" className="w-full p-2 border rounded" />
                                </div>
                            )}
                            <div className="flex justify-end space-x-2"><button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg">Submit for Review</button></div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

// --- Main Component ---

const HealthRecords: React.FC = () => {
  const tabs = [
    { name: 'Conditions & Allergies', icon: <HeartIcon />, content: <ConditionsAndAllergiesTab /> },
    { name: 'Medications', icon: <PillIcon />, content: <MedicationsTab /> },
    { name: 'Vitals', icon: <ChartBarIcon />, content: <VitalsTab /> },
    { name: 'Lab Results', icon: <BeakerIcon />, content: <LabResultsTab /> },
    { name: 'Health Goals', icon: <DumbbellIcon/>, content: <HealthGoalsTab /> },
    { name: 'Tasks', icon: <ClipboardDocumentListIcon/>, content: <TasksTab /> },
    { name: 'Medical History', icon: <DocumentDuplicateIcon />, content: <HistoryTab /> },
  ];

  return (
    <div>
      <PageHeader title="Health Records" subtitle="Your complete electronic medical record." />
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HealthRecords;

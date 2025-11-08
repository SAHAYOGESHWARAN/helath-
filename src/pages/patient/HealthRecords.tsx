
import React, { useState, useMemo } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { VitalsRecord, LabResult, MedicalCondition, Allergy, HealthGoal, Task } from '../../types';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { HeartIcon, PillIcon, ExclamationTriangleIcon, DumbbellIcon, ClipboardDocumentListIcon, BeakerIcon } from '../../components/shared/Icons';
import Card from '../../components/shared/Card';
import Tabs from '../../components/shared/Tabs';
import { useApp } from '../../contexts/AppContext';
import Modal from '../../components/shared/Modal';

const VitalsChart: React.FC<{ data: VitalsRecord[] }> = ({ data }) => {
    const chartData = data.slice(0, 7).reverse().map(v => ({
      date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC'}),
      systolic: parseInt(v.bloodPressure.split('/')[0]),
      diastolic: parseInt(v.bloodPressure.split('/')[1]),
      heartRate: v.heartRate,
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#ef4444" />
                <YAxis yAxisId="right" orientation="right" domain={['dataMin - 10', 'dataMax + 10']} tick={{fontSize: 12}} stroke="#f97316" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f97316" name="Heart Rate (bpm)" />
            </LineChart>
        </ResponsiveContainer>
    );
};

const LabResultCard: React.FC<{ result: LabResult }> = ({ result }) => (
    <Card title={`${result.testName} - ${new Date(result.date).toLocaleDateString('en-US', {timeZone: 'UTC'})}`} className="bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <table className="w-full text-sm">
            <tbody>
                {result.components.map(c => (
                    <tr key={c.name} className={`border-b last:border-b-0 ${c.isAbnormal ? 'font-bold text-red-600' : ''}`}>
                        <td className="py-1">{c.name}</td>
                        <td className="py-1">{c.value}</td>
                        <td className="py-1 text-gray-500">{c.referenceRange}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
);

const ConditionSchema = Yup.object().shape({
  name: Yup.string().required('Condition name is required'),
  ageOfOnset: Yup.number().positive('Age must be a positive number').typeError('Age must be a number'),
});

const AllergySchema = Yup.object().shape({
  name: Yup.string().required('Allergy name is required'),
  severity: Yup.string().required('Severity is required'),
});

const SelfReportModal: React.FC<{isOpen: boolean, onClose: () => void}> = ({ isOpen, onClose }) => {
    const { addCondition, addAllergy } = useAuth();
    const { showToast } = useApp();
    const [reportType, setReportType] = useState<'condition' | 'allergy'>('condition');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Self-Report Condition or Allergy">
            <div className="flex justify-center mb-4 border border-gray-200 rounded-lg p-1">
                <button onClick={() => setReportType('condition')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${reportType === 'condition' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Condition</button>
                <button onClick={() => setReportType('allergy')} className={`w-1/2 py-2 text-sm font-semibold rounded-md ${reportType === 'allergy' ? 'bg-primary-600 text-white' : 'text-gray-600'}`}>Allergy</button>
            </div>
            {reportType === 'condition' ? (
                <Formik
                    initialValues={{ name: '', status: 'Active', ageOfOnset: '', notes: '' }}
                    validationSchema={ConditionSchema}
                    onSubmit={(values) => {
                        addCondition({ ...values, ageOfOnset: values.ageOfOnset ? Number(values.ageOfOnset) : undefined, status: 'Active' });
                        showToast('Condition reported successfully.', 'success');
                        onClose();
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <Field name="name" placeholder="Condition Name (e.g., Asthma)" className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                            <Field name="ageOfOnset" type="number" placeholder="Age of Onset (optional)" className="w-full p-2 border rounded" />
                            <Field name="notes" as="textarea" rows={2} placeholder="Additional notes (optional)" className="w-full p-2 border rounded" />
                            <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit for Review</button></div>
                        </Form>
                    )}
                </Formik>
            ) : (
                <Formik
                    initialValues={{ name: '', severity: 'Mild', reaction: '', notes: '', status: 'Active' }}
                    validationSchema={AllergySchema}
                    onSubmit={(values) => {
                        addAllergy(values as Omit<Allergy, 'id'>);
                        showToast('Allergy reported successfully.', 'success');
                        onClose();
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <Field name="name" placeholder="Allergy Name (e.g., Peanuts)" className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                            <Field as="select" name="severity" className="w-full p-2 border rounded">
                                <option>Mild</option><option>Moderate</option><option>Severe</option>
                            </Field>
                            <Field name="reaction" placeholder="Reaction (optional)" className="w-full p-2 border rounded" />
                            <Field name="notes" as="textarea" rows={2} placeholder="Additional notes (optional)" className="w-full p-2 border rounded" />
                            <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit for Review</button></div>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    );
};

const getSeverityPill = (severity: Allergy['severity']) => {
    switch (severity) {
        case 'Mild': return 'bg-yellow-100 text-yellow-800';
        case 'Moderate': return 'bg-orange-100 text-orange-800';
        case 'Severe': return 'bg-red-100 text-red-800';
    }
};

const GoalProgress: React.FC<{ goal: HealthGoal }> = ({ goal }) => {
    const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-medium text-gray-700 text-sm">{goal.title}</p>
                <p className="text-xs font-semibold text-gray-500">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
        </div>
    );
};

const TaskSummary: React.FC<{ task: Task }> = ({ task }) => {
    const isOverdue = !task.completed && task.dueDate ? new Date(task.dueDate) < new Date() : false;
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center flex-grow min-w-0">
                <input type="checkbox" readOnly checked={task.completed} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0" />
                <span className={`ml-2 truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.text}</span>
            </div>
            {task.dueDate && (
                <span className={`ml-2 flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    task.completed ? 'text-gray-400' : isOverdue ? 'text-red-600 bg-red-100' : 'text-gray-500'
                }`}>
                    {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                </span>
            )}
        </div>
    );
};


const HealthRecords: React.FC = () => {
    const { user } = useAuth();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    
    const clinicalTabs = [
        { name: 'Conditions & Allergies', icon: <HeartIcon/>, content: 
            <div>
                <h4 className="font-semibold mb-2">Conditions</h4>
                <ul className="space-y-2 text-sm mb-4">
                    {(user?.conditions?.length || 0) > 0 ? user?.conditions?.map(c => (
                        <li key={c.id} className="flex justify-between p-2 rounded-md hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{c.name}</span>
                            <span className="font-medium text-gray-500">{c.status}</span>
                        </li>
                    )) : <li className="text-center text-gray-500 py-2">No conditions reported.</li>}
                </ul>
                <h4 className="font-semibold mb-2 pt-4 border-t">Allergies</h4>
                <ul className="space-y-2 text-sm">
                    {(user?.allergies?.length || 0) > 0 ? user?.allergies?.map(a => (
                        <li key={a.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{a.name}</span>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getSeverityPill(a.severity)}`}>{a.severity}</span>
                        </li>
                    )) : <li className="text-center text-gray-500 py-2">No allergies reported.</li>}
                </ul>
            </div>
        },
        { name: 'Medications', icon: <PillIcon />, content:
            <div>
                <ul className="space-y-2 text-sm">
                    {(user?.medications?.filter(m => m.status === 'Active').length || 0) > 0 ? user?.medications?.filter(m => m.status === 'Active').map(m => (
                        <li key={m.id} className="p-2 rounded-md hover:bg-gray-50">
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.dosage}, {m.frequency}</p>
                        </li>
                    )) : <li className="text-center text-gray-500 py-4">No active medications.</li>}
                </ul>
                <Link to="/patient/medications" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage All Medications &rarr;</Link>
            </div>
        },
        { name: 'Vitals History', icon: <HeartIcon />, content: 
            user?.vitals && user.vitals.length > 0 ? <VitalsChart data={user.vitals} /> : <p className="text-center text-gray-500 py-4">No vitals recorded.</p>
        },
    ];

    return (
        <div className="animate-fade-in-up">
            <PageHeader title="EMR Overview" subtitle="A comprehensive summary of your electronic medical record." />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="p-0">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">Clinical Summary</h2>
                            <button onClick={() => setIsReportModalOpen(true)} className="text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full">+ Self-Report</button>
                        </div>
                        <div className="p-6">
                             <Tabs tabs={clinicalTabs} />
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card title="Health Goals">
                        <div className="space-y-3">
                            {(user?.healthGoals?.length || 0) > 0 ? user.healthGoals.map(goal => <GoalProgress key={goal.id} goal={goal} />)
                            : <p className="text-center text-gray-500 text-sm py-2">No goals set.</p>}
                        </div>
                        <Link to="/patient/goals" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage Goals &rarr;</Link>
                    </Card>
                    <Card title="My Tasks">
                         <div className="space-y-3">
                            {(user?.tasks?.length || 0) > 0 ? user.tasks.filter(t => !t.completed).slice(0, 3).map(task => <TaskSummary key={task.id} task={task} />)
                            : <p className="text-center text-gray-500 text-sm py-2">No pending tasks.</p>}
                        </div>
                        <Link to="/patient/tasks" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage All Tasks &rarr;</Link>
                    </Card>
                    <Card title="Recent Lab Results">
                        {user?.labResults && user.labResults.length > 0 ? (
                            <LabResultCard result={user.labResults[0]} />
                        ) : (
                            <p className="text-center text-gray-500 text-sm py-2">No lab results available.</p>
                        )}
                         <Link to="/patient/lab-results" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">View All Lab Results &rarr;</Link>
                    </Card>
                </div>
            </div>

            <SelfReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        </div>
    );
};

export default HealthRecords;
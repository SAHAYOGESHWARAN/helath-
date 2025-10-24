import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { Allergy, FamilyHistoryEntry, ImmunizationRecord, LifestyleInfo, Surgery, User, VitalsRecord, LabResult } from '../../types';
import { SpinnerIcon, PencilAltIcon, TrashIcon, DownloadIcon, PlusIcon, HomeIcon, DocumentTextIcon, ChartBarIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import Tabs from '../../components/shared/Tabs';


const SummaryTab: React.FC<{ user: User | null; onEdit: (tab: EmrTab, item: any) => void; onDelete: (type: EmrListType, id: string) => void; }> = ({ user, onEdit, onDelete }) => (
    <div className="space-y-8">
        <Card title="Medical Conditions">
            <ul className="space-y-2">
                {user?.conditions?.length ? user.conditions.map(c => (
                    <li key={c.id} className="p-2 border rounded-md flex justify-between items-center">
                        <span>{c.name}</span>
                        <div className="space-x-2">
                           <button onClick={() => onEdit('conditions', c)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => onDelete('conditions', c.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No conditions listed.</p>}
            </ul>
        </Card>
        <Card title="Allergies">
            <ul className="space-y-2">
                {user?.allergies?.length ? user.allergies.map(a => (
                    <li key={a.id} className="p-3 border rounded-md flex justify-between items-center">
                        <div>
                          <span>{a.name}</span>
                          <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${a.severity === 'Severe' ? 'bg-red-100 text-red-700' : a.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{a.severity}</span>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => onEdit('allergies', a)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => onDelete('allergies', a.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No allergies listed.</p>}
            </ul>
        </Card>
        <Card title="Surgeries & Procedures">
            <ul className="space-y-2">
                {user?.surgeries?.length ? user.surgeries.map(s => (
                    <li key={s.id} className="p-2 border rounded-md flex justify-between items-center">
                        <div>
                          <span>{s.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({s.date})</span>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => onEdit('surgeries', s)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => onDelete('surgeries', s.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No surgeries listed.</p>}
            </ul>
        </Card>
        <Card title="Immunization Records">
            <ul className="space-y-2">
                {user?.immunizations?.length ? user.immunizations.map(i => (
                    <li key={i.id} className="p-2 border rounded-md flex justify-between items-center">
                        <div>
                          <span>{i.vaccine}</span>
                          <span className="text-gray-500 text-sm ml-2">({i.date})</span>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => onEdit('immunizations', i)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => onDelete('immunizations', i.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No immunizations listed.</p>}
            </ul>
        </Card>
        <Card title="Family History">
            <ul className="space-y-2">
                {user?.familyHistory?.length ? user.familyHistory.map(h => (
                    <li key={h.id} className="p-2 border rounded-md flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{h.relation}:</span>
                          <span className="text-gray-700 ml-2">{h.condition}</span>
                        </div>
                        <div className="space-x-2">
                           <button onClick={() => onEdit('familyHistory', h)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => onDelete('familyHistory', h.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                )) : <p className="text-gray-500 text-sm">No family history listed.</p>}
            </ul>
        </Card>
        <Card title="Lifestyle Information">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div><p className="font-semibold">Diet:</p><p className="text-gray-600">{user?.lifestyle?.diet || 'Not specified'}</p></div>
                     <div><p className="font-semibold">Exercise:</p><p className="text-gray-600">{user?.lifestyle?.exercise || 'Not specified'}</p></div>
                     <div><p className="font-semibold">Smoking:</p><p className="text-gray-600">{user?.lifestyle?.smokingStatus || 'Not specified'}</p></div>
                     <div><p className="font-semibold">Alcohol:</p><p className="text-gray-600">{user?.lifestyle?.alcoholConsumption || 'Not specified'}</p></div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button onClick={() => onEdit('lifestyle', user?.lifestyle)} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800">
                        <PencilAltIcon className="w-4 h-4 mr-2" />
                        Edit Lifestyle Info
                    </button>
                </div>
            </div>
        </Card>
      </div>
);

const VitalsTab: React.FC<{ vitals: VitalsRecord[] }> = ({ vitals }) => {
    const chartData = vitals.map(v => ({
        date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        systolic: parseInt(v.bloodPressure.split('/')[0]),
        diastolic: parseInt(v.bloodPressure.split('/')[1]),
        heartRate: v.heartRate,
        weight: v.weight,
    })).reverse();

    return (
        <div className="space-y-8">
            <Card title="Blood Pressure (mmHg)">
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                        <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Weight (lbs) & Heart Rate (bpm)">
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#10b981" domain={['dataMin - 10', 'dataMax + 10']}/>
                        <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" domain={['dataMin - 10', 'dataMax + 10']}/>
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#10b981" name="Weight" />
                        <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f59e0b" name="Heart Rate" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

const LabResultsTab: React.FC<{ labResults: LabResult[] }> = ({ labResults }) => (
    <div className="space-y-8">
        {labResults.map(result => (
            <Card key={result.id} title={`${result.testName} - ${result.date}`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Range</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {result.components.map(comp => (
                                <tr key={comp.name} className={comp.isAbnormal ? 'bg-red-50' : ''}>
                                    <td className={`px-4 py-3 text-sm ${comp.isAbnormal ? 'font-bold text-red-800' : 'font-medium text-gray-800'}`}>{comp.name}</td>
                                    <td className={`px-4 py-3 text-sm ${comp.isAbnormal ? 'font-bold text-red-800' : 'text-gray-600'}`}>{comp.value}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{comp.referenceRange}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        ))}
    </div>
);

// --- Form Schemas & Components (condensed for brevity) ---
const ConditionSchema = Yup.object().shape({ name: Yup.string().min(2).required('Required') });
const AllergySchema = Yup.object().shape({ name: Yup.string().min(2).required('Required'), severity: Yup.string().required(), reaction: Yup.string().min(3).required() });
const SurgerySchema = Yup.object().shape({ name: Yup.string().min(3).required(), date: Yup.date().max(new Date()).required() });
const ImmunizationSchema = Yup.object().shape({ vaccine: Yup.string().min(3).required(), date: Yup.date().max(new Date()).required() });
const FamilyHistorySchema = Yup.object().shape({ relation: Yup.string().required(), condition: Yup.string().min(2).required() });
const LifestyleSchema = Yup.object().shape({ smokingStatus: Yup.string().required(), alcoholConsumption: Yup.string().required() });

// Unified Form Component for Modals
const GenericForm: React.FC<{ validationSchema: any, initialValues: any, onSubmit: any, onCancel: any, isSubmitting: boolean, fields: any[] }> = ({ validationSchema, initialValues, onSubmit, onCancel, isSubmitting, fields }) => (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                {fields.map(field => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium">{field.label}</label>
                        <Field {...field} className={`w-full p-2 border rounded ${errors[field.name] && touched[field.name] ? 'border-red-500' : 'border-gray-300'}`} />
                        <ErrorMessage name={field.name} component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                ))}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const emrTabConfig = {
    conditions: { schema: ConditionSchema, fields: [{ name: 'name', label: 'Condition Name' }], defaultValues: { id: '', name: '' }, singular: 'Condition' },
    allergies: { schema: AllergySchema, fields: [{ name: 'name', label: 'Allergy Name' }, { name: 'severity', label: 'Severity', as: 'select', children: <><option value="Mild">Mild</option><option value="Moderate">Moderate</option><option value="Severe">Severe</option></> }, { name: 'reaction', label: 'Reaction' }], defaultValues: { id: '', name: '', severity: 'Mild' as const, reaction: '' }, singular: 'Allergy' },
    surgeries: { schema: SurgerySchema, fields: [{ name: 'name', label: 'Surgery/Procedure' }, { name: 'date', label: 'Date', type: 'date' }], defaultValues: { id: '', name: '', date: '' }, singular: 'Surgery' },
    immunizations: { schema: ImmunizationSchema, fields: [{ name: 'vaccine', label: 'Vaccine Name' }, { name: 'date', label: 'Date', type: 'date' }], defaultValues: { id: '', vaccine: '', date: '' }, singular: 'Immunization' },
    familyHistory: { schema: FamilyHistorySchema, fields: [{ name: 'relation', label: 'Relation', as: 'select', children: <><option value="">Select</option><option value="Mother">Mother</option><option value="Father">Father</option><option value="Sibling">Sibling</option><option value="Grandparent">Grandparent</option><option value="Other">Other</option></> }, { name: 'condition', label: 'Condition' }], defaultValues: { id: '', relation: '' as const, condition: '' }, singular: 'Family History' },
    lifestyle: { schema: LifestyleSchema, fields: [{ name: 'diet', as: 'textarea', rows: 2, placeholder: 'Describe diet' }, { name: 'exercise', as: 'textarea', rows: 2, placeholder: 'Describe exercise' }, { name: 'smokingStatus', as: 'select', children: <><option value="Never">Never</option><option value="Former">Former</option><option value="Current">Current</option></> }, { name: 'alcoholConsumption', as: 'select', children: <><option value="None">None</option><option value="Occasional">Occasional</option><option value="Regular">Regular</option></> }], defaultValues: { diet: '', exercise: '', smokingStatus: 'Never' as const, alcoholConsumption: 'None' as const }, singular: 'Lifestyle Info' }
};

type EmrTab = keyof typeof emrTabConfig;
type EmrListType = Exclude<EmrTab, 'lifestyle'>;

const HealthRecords: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ tab: EmrTab, item: any | null } | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: EmrListType, id: string } | null>(null);

    const openModal = (tab: EmrTab, item: any | null = null) => {
        const itemToEdit = tab === 'lifestyle' ? (user?.lifestyle || emrTabConfig.lifestyle.defaultValues) : item;
        setModalConfig({ tab, item: itemToEdit });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalConfig(null);
    };

    const handleSave = async (values: any) => {
        if (!modalConfig) return;
        setIsSubmitting(true);
      
        await updateUser(currentUser => {
            if (modalConfig.tab === 'lifestyle') {
                return { ...currentUser, lifestyle: values };
            }
            const listKey = modalConfig.tab as EmrListType;
            const list = [...(currentUser[listKey] as any[] || [])];
            const id = values.id || `${listKey}_${Date.now()}`;
            const index = list.findIndex(item => item.id === id);

            if (index > -1) {
                list[index] = { ...values, id };
            } else {
                list.push({ ...values, id });
            }
            return { ...currentUser, [listKey]: list };
        });
      
        setIsSubmitting(false);
        showToast('Information saved!', 'success');
        closeModal();
      };
      
      const handleDelete = async () => {
        if (!deleteConfirmation) return;
        setIsSubmitting(true);
        await updateUser(currentUser => {
          const list = currentUser[deleteConfirmation.type] as any[] || [];
          return { ...currentUser, [deleteConfirmation.type]: list.filter(item => item.id !== deleteConfirmation.id) };
        });
        setIsSubmitting(false);
        showToast('Item removed.', 'success');
        setDeleteConfirmation(null);
      };
      
    const handleDownloadEmr = () => { /* ... existing download logic ... */ };
    
    const pageTabs = [
        { name: 'Summary', icon: <HomeIcon />, content: <SummaryTab user={user} onEdit={openModal} onDelete={(type, id) => setDeleteConfirmation({ type, id })} /> },
        { name: 'Vitals', icon: <ChartBarIcon />, content: <VitalsTab vitals={user?.vitals || []} /> },
        { name: 'Lab Results', icon: <DocumentTextIcon />, content: <LabResultsTab labResults={user?.labResults || []} /> },
    ];

  return (
    <div>
        <PageHeader 
            title="My Electronic Medical Record (EMR)" 
            subtitle="Manage your personal health information."
        >
             <div className="flex items-center space-x-3">
                <button onClick={handleDownloadEmr} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 flex items-center">
                    <DownloadIcon className="w-5 h-5 mr-2" /><span>Download EMR</span>
                </button>
                <button onClick={() => openModal('conditions')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm flex items-center">
                    <PlusIcon className="w-5 h-5 mr-2" /><span>Add Record</span>
                </button>
            </div>
        </PageHeader>
      
        <Card className="p-0">
            <Tabs tabs={pageTabs} />
        </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={`${modalConfig?.item?.id ? 'Edit' : 'New'} ${modalConfig ? emrTabConfig[modalConfig.tab].singular : ''}`}
        size="lg"
      >
        {modalConfig && (
            <GenericForm 
                validationSchema={emrTabConfig[modalConfig.tab].schema}
                initialValues={modalConfig.item || emrTabConfig[modalConfig.tab].defaultValues}
                onSubmit={handleSave}
                onCancel={closeModal}
                isSubmitting={isSubmitting}
                fields={emrTabConfig[modalConfig.tab].fields}
            />
        )}
      </Modal>

      <Modal isOpen={!!deleteConfirmation} onClose={() => setDeleteConfirmation(null)} title="Confirm Deletion">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2 pt-4">
             <button onClick={() => setDeleteConfirmation(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Delete'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default HealthRecords;
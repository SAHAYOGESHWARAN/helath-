import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { Allergy, FamilyHistoryEntry, ImmunizationRecord, LifestyleInfo, Surgery, User } from '../../types';
import { SpinnerIcon, PencilAltIcon, TrashIcon, DownloadIcon, PlusIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// --- Form Schemas ---
const ConditionSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too short').required('Condition name is required'),
});

const AllergySchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too short').required('Allergy name is required'),
    severity: Yup.string().oneOf(['Mild', 'Moderate', 'Severe']).required('Severity is required'),
    reaction: Yup.string().min(3, 'Too short').required('Reaction is required'),
});

const SurgerySchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too short').required('Surgery name is required'),
    date: Yup.date().max(new Date(), 'Date cannot be in the future').required('Date of surgery is required'),
});

const FamilyHistorySchema = Yup.object().shape({
    relation: Yup.string().oneOf(['Mother', 'Father', 'Sibling', 'Grandparent', 'Other']).required('Relation is required'),
    condition: Yup.string().min(2, 'Too short').required('Condition name is required'),
});

const ImmunizationSchema = Yup.object().shape({
    vaccine: Yup.string().min(3, 'Too short').required('Vaccine name is required'),
    date: Yup.date().max(new Date(), 'Date cannot be in the future').required('Date of immunization is required'),
});

const LifestyleSchema = Yup.object().shape({
    diet: Yup.string(),
    exercise: Yup.string(),
    smokingStatus: Yup.string().oneOf(['Never', 'Former', 'Current']).required('Smoking status is required'),
    alcoholConsumption: Yup.string().oneOf(['None', 'Occasional', 'Regular']).required('Alcohol consumption is required'),
});

// --- Form Components ---
const ConditionForm: React.FC<{ initialValues: { id?: string, name: string }; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={ConditionSchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Condition Name</label>
                    <Field name="name" className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const AllergyForm: React.FC<{ initialValues: Allergy; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={AllergySchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Allergy Name</label>
                    <Field name="name" className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Severity</label>
                        <Field as="select" name="severity" className={`w-full p-2 border rounded bg-white ${errors.severity && touched.severity ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="Mild">Mild</option><option value="Moderate">Moderate</option><option value="Severe">Severe</option>
                        </Field>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Reaction</label>
                        <Field name="reaction" className={`w-full p-2 border rounded ${errors.reaction && touched.reaction ? 'border-red-500' : 'border-gray-300'}`} />
                        <ErrorMessage name="reaction" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const SurgeryForm: React.FC<{ initialValues: Surgery; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={SurgerySchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Surgery/Procedure</label>
                    <Field name="name" className={`w-full p-2 border rounded ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <Field type="date" name="date" className={`w-full p-2 border rounded ${errors.date && touched.date ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const ImmunizationForm: React.FC<{ initialValues: ImmunizationRecord; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={ImmunizationSchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Vaccine Name</label>
                    <Field name="vaccine" className={`w-full p-2 border rounded ${errors.vaccine && touched.vaccine ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="vaccine" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date Received</label>
                    <Field type="date" name="date" className={`w-full p-2 border rounded ${errors.date && touched.date ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const FamilyHistoryForm: React.FC<{ initialValues: FamilyHistoryEntry; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={FamilyHistorySchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Relation</label>
                    <Field as="select" name="relation" className={`w-full p-2 border rounded bg-white ${errors.relation && touched.relation ? 'border-red-500' : 'border-gray-300'}`}>
                        <option value="">Select Relation</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="relation" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Condition</label>
                    <Field name="condition" className={`w-full p-2 border rounded ${errors.condition && touched.condition ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="condition" component="p" className="text-red-500 text-xs mt-1" />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

const LifestyleForm: React.FC<{ initialValues: LifestyleInfo; onSubmit: (values: any) => void; onCancel: () => void; isSubmitting: boolean }> = ({ initialValues, onSubmit, onCancel, isSubmitting }) => (
    <Formik initialValues={initialValues} validationSchema={LifestyleSchema} onSubmit={onSubmit} enableReinitialize>
        {({ errors, touched }) => (
            <Form className="space-y-4">
                <Field name="diet" as="textarea" rows="2" placeholder="Describe your typical diet..." className="w-full p-2 border rounded" />
                <Field name="exercise" as="textarea" rows="2" placeholder="Describe your exercise habits..." className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Smoking Status</label>
                        <Field as="select" name="smokingStatus" className={`w-full p-2 border rounded bg-white ${errors.smokingStatus && touched.smokingStatus ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="Never">Never</option><option value="Former">Former</option><option value="Current">Current</option>
                        </Field>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Alcohol</label>
                        <Field as="select" name="alcoholConsumption" className={`w-full p-2 border rounded bg-white ${errors.alcoholConsumption && touched.alcoholConsumption ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="None">None</option><option value="Occasional">Occasional</option><option value="Regular">Regular</option>
                        </Field>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-28 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Save'}</button>
                </div>
            </Form>
        )}
    </Formik>
);

// --- Refactored EMR Tab Configuration ---
const emrTabConfig = {
    conditions: {
        Component: ConditionForm,
        defaultValues: { id: '', name: '' },
        singularName: 'Condition',
    },
    allergies: {
        Component: AllergyForm,
        defaultValues: { id: '', name: '', severity: 'Mild' as const, reaction: '' },
        singularName: 'Allergy',
    },
    surgeries: {
        Component: SurgeryForm,
        defaultValues: { id: '', name: '', date: '' },
        singularName: 'Surgery',
    },
    immunizations: {
        Component: ImmunizationForm,
        defaultValues: { id: '', vaccine: '', date: '' },
        singularName: 'Immunization Record',
    },
    familyHistory: {
        Component: FamilyHistoryForm,
        defaultValues: { id: '', relation: '' as const, condition: '' },
        singularName: 'Family History Entry',
    },
    lifestyle: {
        Component: LifestyleForm,
        defaultValues: { diet: '', exercise: '', smokingStatus: 'Never' as const, alcoholConsumption: 'None' as const },
        singularName: 'Lifestyle Information',
    }
};

type EmrTab = keyof typeof emrTabConfig;
type EmrListType = Exclude<EmrTab, 'lifestyle'>;


const HealthRecords: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [isEmrModalOpen, setIsEmrModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<EmrTab>('conditions');
    const [currentItem, setCurrentItem] = useState<any | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ type: EmrListType, id: string } | null>(null);

    const openEmrModal = (tab: EmrTab, itemToEdit: any | null = null) => {
        setActiveTab(tab);
        if (tab === 'lifestyle') {
            setCurrentItem(user?.lifestyle || emrTabConfig.lifestyle.defaultValues);
        } else {
            setCurrentItem(itemToEdit);
        }
        setIsEmrModalOpen(true);
    };

    const closeEmrModal = () => {
        setIsEmrModalOpen(false);
        setCurrentItem(null);
    };

    const switchTab = (tab: EmrTab) => {
        setActiveTab(tab);
        if (tab === 'lifestyle') {
            setCurrentItem(user?.lifestyle || emrTabConfig.lifestyle.defaultValues);
        } else {
            setCurrentItem(null); // Reset to "add new" for list types
        }
    };

    const handleSave = async (values: any) => {
        setIsSubmitting(true);
      
        const updater = (currentUser: User): User => {
          if (activeTab === 'lifestyle') {
            return { ...currentUser, lifestyle: values };
          }
      
          const listKey = activeTab as EmrListType;
          const list = [...(currentUser[listKey] as any[] || [])];
          let updatedList;
      
          if (values.id) { // This is an edit
            const index = list.findIndex(item => item.id === values.id);
            if (index > -1) {
              list[index] = values;
              updatedList = list;
            } else {
              updatedList = [...list, { ...values, id: `${listKey}_${Date.now()}` }];
            }
          } else { // This is a new item
            updatedList = [...list, { ...values, id: `${listKey}_${Date.now()}` }];
          }
          
          return { ...currentUser, [listKey]: updatedList };
        };
      
        await updateUser(updater);
      
        setIsSubmitting(false);
        showToast('Information saved!', 'success');
        closeEmrModal();
      };
      
      const handleDelete = async () => {
        if (!deleteConfirmation) return;
        const { type, id } = deleteConfirmation;
        setIsSubmitting(true);
      
        const updater = (currentUser: User): User => {
          const list = currentUser[type] as any[] || [];
          const updatedList = list.filter(item => item.id !== id);
          return { ...currentUser, [type]: updatedList };
        };
      
        await updateUser(updater);
      
        setIsSubmitting(false);
        showToast('Item removed.', 'success');
        setDeleteConfirmation(null);
      };
      
    const handleDownloadEmr = () => {
        if (!user) return;

        let report = `NovoPath Medical - Electronic Medical Record\n`;
        report += `==============================================\n\n`;
        report += `Patient Name: ${user.name}\n`;
        report += `Date of Birth: ${user.dob || 'N/A'}\n`;
        report += `Generated On: ${new Date().toLocaleDateString()}\n\n`;

        // Conditions
        report += `--- Medical Conditions ---\n`;
        if (user.conditions?.length) {
            user.conditions.forEach(c => { report += `- ${c.name}\n`; });
        } else { report += `No conditions listed.\n`; }
        report += `\n`;

        // Allergies
        report += `--- Allergies ---\n`;
        if (user.allergies?.length) {
            user.allergies.forEach(a => { report += `- ${a.name} (Severity: ${a.severity}, Reaction: ${a.reaction})\n`; });
        } else { report += `No allergies listed.\n`; }
        report += `\n`;

        // Surgeries
        report += `--- Surgeries & Procedures ---\n`;
        if (user.surgeries?.length) {
            user.surgeries.forEach(s => { report += `- ${s.name} (Date: ${s.date})\n`; });
        } else { report += `No surgeries listed.\n`; }
        report += `\n`;
        
        // Immunizations
        report += `--- Immunization Records ---\n`;
        if (user.immunizations?.length) {
            user.immunizations.forEach(i => { report += `- ${i.vaccine} (Date: ${i.date})\n`; });
        } else { report += `No immunizations listed.\n`; }
        report += `\n`;

        // Family History
        report += `--- Family History ---\n`;
        if (user.familyHistory?.length) {
            user.familyHistory.forEach(h => { report += `- ${h.relation}: ${h.condition}\n`; });
        } else { report += `No family history listed.\n`; }
        report += `\n`;

        // Lifestyle
        report += `--- Lifestyle Information ---\n`;
        if (user.lifestyle) {
            report += `Diet: ${user.lifestyle.diet || 'N/A'}\n`;
            report += `Exercise: ${user.lifestyle.exercise || 'N/A'}\n`;
            report += `Smoking Status: ${user.lifestyle.smokingStatus}\n`;
            report += `Alcohol Consumption: ${user.lifestyle.alcoholConsumption}\n`;
        } else {
            report += `No lifestyle information provided.\n`;
        }
        report += `\n`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EMR_Data_${user.name.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
  return (
    <div>
        <PageHeader 
            title="My Electronic Medical Record (EMR)" 
            subtitle="Manage your personal health information."
        >
             <div className="flex items-center space-x-3">
                <button
                    onClick={handleDownloadEmr}
                    className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-5 rounded-lg shadow-sm border border-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    <span>Download EMR</span>
                </button>
                <button
                    onClick={() => openEmrModal('conditions')}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Manage My EMR</span>
                </button>
            </div>
        </PageHeader>
      
      <div className="space-y-8">
        <Card title="Medical Conditions">
            <ul className="space-y-2">
                {user?.conditions?.length ? user.conditions.map(c => (
                    <li key={c.id} className="p-2 border rounded-md flex justify-between items-center">
                        <span>{c.name}</span>
                        <div className="space-x-2">
                           <button onClick={() => openEmrModal('conditions', c)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => setDeleteConfirmation({ type: 'conditions', id: c.id })} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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
                           <button onClick={() => openEmrModal('allergies', a)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => setDeleteConfirmation({ type: 'allergies', id: a.id })} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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
                           <button onClick={() => openEmrModal('surgeries', s)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => setDeleteConfirmation({ type: 'surgeries', id: s.id })} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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
                           <button onClick={() => openEmrModal('immunizations', i)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => setDeleteConfirmation({ type: 'immunizations', id: i.id })} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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
                           <button onClick={() => openEmrModal('familyHistory', h)} className="p-1 text-gray-500 hover:text-primary-600"><PencilAltIcon className="w-4 h-4" /></button>
                           <button onClick={() => setDeleteConfirmation({ type: 'familyHistory', id: h.id })} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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
                    <button onClick={() => openEmrModal('lifestyle')} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800">
                        <PencilAltIcon className="w-4 h-4 mr-2" />
                        Edit Lifestyle Info
                    </button>
                </div>
            </div>
        </Card>
      </div>

      {/* --- Modals --- */}
      <Modal 
        isOpen={isEmrModalOpen} 
        onClose={closeEmrModal} 
        title={`${currentItem ? 'Edit' : 'New'} ${emrTabConfig[activeTab].singularName}`} 
        size="lg"
      >
        <div className="border-b border-gray-200 mb-4">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {Object.keys(emrTabConfig).map((tabKey) => (
                    <button
                        key={tabKey}
                        onClick={() => switchTab(tabKey as EmrTab)}
                        className={`
                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize
                            ${activeTab === tabKey
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        {tabKey.replace(/([A-Z])/g, ' $1')}
                    </button>
                ))}
            </nav>
        </div>
        <div>
            {(() => {
                const { Component, defaultValues } = emrTabConfig[activeTab];
                const initialValues = activeTab === 'lifestyle' ? currentItem : (currentItem || defaultValues);
                return <Component initialValues={initialValues} onSubmit={handleSave} onCancel={closeEmrModal} isSubmitting={isSubmitting} />;
            })()}
        </div>
      </Modal>

      <Modal 
        isOpen={!!deleteConfirmation} 
        onClose={() => setDeleteConfirmation(null)} 
        title="Confirm Deletion"
        footer={<>
            <button onClick={() => setDeleteConfirmation(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center items-center">
                {isSubmitting ? <SpinnerIcon /> : 'Delete'}
            </button>
        </>}
      >
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default HealthRecords;
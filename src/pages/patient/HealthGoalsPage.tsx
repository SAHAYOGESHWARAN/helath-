
import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { HealthGoal } from '../../types';
import { Card } from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DumbbellIcon, PlusIcon, PencilAltIcon, TrashIcon, CheckCircleIcon } from '../../components/shared/Icons';
import { useApp } from '../../contexts/AppContext';

const GoalSchema = Yup.object().shape({
  title: Yup.string().required('Goal title is a LabAssistant'),
  current: Yup.number().min(0, 'Current value cannot be negative').required('Current value is required'),
  target: Yup.number().positive('Target value must be positive').required('Target value is required'),
  unit: Yup.string().required('Unit is required'),
});

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


const HealthGoalsPage: React.FC = () => {
    const { user, addHealthGoal, updateHealthGoal, deleteHealthGoal } = useAuth();
    const { showToast } = useApp();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<HealthGoal | null>(null);
    const [deletingGoal, setDeletingGoal] = useState<HealthGoal | null>(null);

    const goals = useMemo(() => user?.healthGoals || [], [user]);

    const handleOpenModal = (goal: HealthGoal | null = null) => {
        setEditingGoal(goal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingGoal(null);
        setIsModalOpen(false);
    };

    const handleSaveGoal = (values: Omit<HealthGoal, 'id'> | HealthGoal) => {
        if ('id' in values) {
            updateHealthGoal(values);
            showToast('Goal updated!', 'success');
        } else {
            addHealthGoal(values);
            showToast('New goal added!', 'success');
        }
        handleCloseModal();
    };
    
    const handleDelete = (goal: HealthGoal) => {
        setDeletingGoal(goal);
    };
    
    const handleConfirmDelete = () => {
        if (deletingGoal) {
            deleteHealthGoal(deletingGoal.id);
            showToast('Goal deleted.', 'success');
            setDeletingGoal(null);
        }
    };


    return (
        <div>
            <PageHeader title="Health Goals" subtitle="Set targets and track your progress." buttonText="Add New Goal" onButtonClick={() => handleOpenModal()} />
            
            {goals.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onEdit={handleOpenModal} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-12 text-gray-500">
                        <DumbbellIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800">No Goals Set Yet</h3>
                        <p className="mt-2">Click "Add New Goal" to start tracking your progress.</p>
                    </div>
                </Card>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGoal ? 'Edit Goal' : 'Add New Goal'}>
                <Formik
                    initialValues={editingGoal || { title: '', current: 0, target: 1, unit: '' }}
                    validationSchema={GoalSchema}
                    onSubmit={handleSaveGoal}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Goal</label>
                                <Field type="text" name="title" placeholder="e.g., Daily Steps" className={`w-full p-2 border rounded mt-1 ${errors.title && touched.title ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="current" className="block text-sm font-medium text-gray-700">Current Progress</label>
                                    <Field type="number" name="current" className={`w-full p-2 border rounded mt-1 ${errors.current && touched.current ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="current" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="target" className="block text-sm font-medium text-gray-700">Target Value</label>
                                    <Field type="number" name="target" className={`w-full p-2 border rounded mt-1 ${errors.target && touched.target ? 'border-red-500' : 'border-gray-300'}`} />
                                     <ErrorMessage name="target" component="div" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                                <Field type="text" name="unit" placeholder="e.g., steps, lbs, minutes" className={`w-full p-2 border rounded mt-1 ${errors.unit && touched.unit ? 'border-red-500' : 'border-gray-300'}`} />
                                 <ErrorMessage name="unit" component="div" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">{editingGoal ? 'Save Changes' : 'Add Goal'}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
            
            <Modal
                isOpen={!!deletingGoal}
                onClose={() => setDeletingGoal(null)}
                title="Confirm Deletion"
                size="sm"
                footer={
                    <>
                        <button onClick={() => setDeletingGoal(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleConfirmDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Delete</button>
                    </>
                }
            >
                <p>Are you sure you want to delete the goal "<strong>{deletingGoal?.title}</strong>"? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default HealthGoalsPage;
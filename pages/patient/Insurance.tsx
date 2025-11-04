import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext';
import { InsuranceInfo } from '../../types';
import { SpinnerIcon } from '../../components/shared/Icons';

const InsuranceSchema = Yup.object().shape({
  provider: Yup.string().required('Provider name is required'),
  planName: Yup.string().required('Plan name is required'),
  memberId: Yup.string().required('Member ID is required'),
  groupId: Yup.string().required('Group ID is required'),
});

const Insurance: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [isEditing, setIsEditing] = useState(!user?.insurance);
    
    const insurance = user?.insurance;

    const handleSave = (data: InsuranceInfo, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
        updateUser({ insurance: data }).then(() => {
            showToast('Insurance information saved successfully!', 'success');
            setIsEditing(false);
            setSubmitting(false);
        });
    };

    return (
        <div>
            <PageHeader title="Insurance Information" subtitle="Manage your health insurance details." />

            <Card>
                {isEditing ? (
                    <Formik
                        initialValues={insurance || { provider: '', planName: '', memberId: '', groupId: '' }}
                        validationSchema={InsuranceSchema}
                        onSubmit={handleSave}
                    >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">{insurance ? 'Update' : 'Add'} Your Insurance</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                                    <Field name="provider" placeholder="e.g., Blue Cross Blue Shield" className={`w-full p-2 border rounded mt-1 ${errors.provider && touched.provider ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="provider" component="p" className="text-red-500 text-xs mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                                    <Field name="planName" placeholder="e.g., PPO Plan A" className={`w-full p-2 border rounded mt-1 ${errors.planName && touched.planName ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="planName" component="p" className="text-red-500 text-xs mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Member ID</label>
                                    <Field name="memberId" placeholder="e.g., X123456789" className={`w-full p-2 border rounded mt-1 ${errors.memberId && touched.memberId ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="memberId" component="p" className="text-red-500 text-xs mt-1"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Group ID</label>
                                    <Field name="groupId" placeholder="e.g., G98765" className={`w-full p-2 border rounded mt-1 ${errors.groupId && touched.groupId ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="groupId" component="p" className="text-red-500 text-xs mt-1"/>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                {insurance && <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>}
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center">
                                     {isSubmitting ? <SpinnerIcon /> : 'Save'}
                                </button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Your Current Insurance</h3>
                            <button onClick={() => setIsEditing(true)} className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm">
                                Update Information
                            </button>
                        </div>
                        <div className="space-y-3 text-sm p-4 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Provider:</span><span className="font-semibold text-gray-800">{insurance?.provider}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Plan Name:</span><span className="font-semibold text-gray-800">{insurance?.planName}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Member ID:</span><span className="font-semibold text-gray-800">{insurance?.memberId}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Group ID:</span><span className="font-semibold text-gray-800">{insurance?.groupId}</span></div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Insurance;
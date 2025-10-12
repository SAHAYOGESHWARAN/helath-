import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { UploadIcon, SpinnerIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const InsuranceSchema = Yup.object().shape({
  provider: Yup.string().required('Provider name is required'),
  planName: Yup.string().required('Plan name is required'),
  memberId: Yup.string().required('Member ID is required'),
  groupId: Yup.string().required('Group ID is required'),
});

const InsuranceForm: React.FC<{ onSave: (data: any) => void; onCancel: () => void; initialData: any; }> = ({ onSave, onCancel, initialData }) => {
    return (
        <Formik
            initialValues={initialData}
            validationSchema={InsuranceSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSave(values);
                // setSubmitting is handled by the parent component
            }}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-4">
                    <Field name="provider" placeholder="Insurance Provider" className={`w-full p-2 border rounded ${errors.provider && touched.provider ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="provider" component="p" className="text-red-500 text-xs"/>
                    <Field name="planName" placeholder="Plan Name" className={`w-full p-2 border rounded ${errors.planName && touched.planName ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="planName" component="p" className="text-red-500 text-xs"/>
                    <Field name="memberId" placeholder="Member ID" className={`w-full p-2 border rounded ${errors.memberId && touched.memberId ? 'border-red-500' : 'border-gray-300'}`} />
                     <ErrorMessage name="memberId" component="p" className="text-red-500 text-xs"/>
                    <Field name="groupId" placeholder="Group ID" className={`w-full p-2 border rounded ${errors.groupId && touched.groupId ? 'border-red-500' : 'border-gray-300'}`} />
                     <ErrorMessage name="groupId" component="p" className="text-red-500 text-xs"/>
                    <div className="flex justify-end space-x-2 pt-2">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center items-center">
                            {isSubmitting ? <SpinnerIcon /> : 'Save'}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

const Insurance: React.FC = () => {
    const { insurance, updateInsurance } = useAuth();
    const { showToast } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = (data: any) => {
        setIsSubmitting(true);
        updateInsurance(data).then(() => {
            showToast('Insurance information saved!', 'success');
            setIsEditing(false);
            setIsSubmitting(false);
        });
    };

    return (
        <div>
            <PageHeader title="Insurance Details" subtitle="Manage your primary and secondary insurance information." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Primary Insurance">
                    {insurance ? (
                        <>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Provider:</span><span className="font-semibold text-gray-800">{insurance.provider}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Plan Name:</span><span className="font-semibold text-gray-800">{insurance.planName}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Member ID:</span><span className="font-semibold text-gray-800">{insurance.memberId}</span></div>
                            <div className="flex justify-between"><span className="font-medium text-gray-600">Group ID:</span><span className="font-semibold text-gray-800">{insurance.groupId}</span></div>
                        </div>
                        <button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm">
                            Update Primary Insurance
                        </button>
                        </>
                    ) : <p>No insurance information on file.</p>}
                </Card>

                <Card title="Upload Insurance Card">
                    <p className="text-sm text-gray-600 mb-4">For faster verification, please upload a photo of the front and back of your insurance card.</p>
                     <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <UploadIcon className="w-10 h-10 mx-auto text-gray-400"/>
                        <p className="mt-2 text-sm text-gray-600">Drag & drop files here or</p>
                        <button className="mt-2 text-sm font-semibold text-primary-600 hover:underline">
                            Browse files
                        </button>
                    </div>
                </Card>
            </div>
            
             <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Primary Insurance">
                <InsuranceForm 
                  initialData={insurance}
                  onSave={handleSave} 
                  onCancel={() => setIsEditing(false)} 
                />
            </Modal>
        </div>
    );
};

export default Insurance;

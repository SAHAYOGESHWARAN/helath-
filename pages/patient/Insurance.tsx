
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ShieldCheckIcon, UploadIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';

const mockInsurance = {
  primary: {
    provider: 'Blue Cross Blue Shield',
    planName: 'PPO Gold',
    memberId: 'X123456789',
    groupId: 'G98765',
    effectiveDate: '2023-01-01',
  },
  secondary: null,
};

const InsuranceForm: React.FC<{ onSave: (data: any) => void; onCancel: () => void }> = ({ onSave, onCancel }) => {
    // A simplified form for brevity
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave({}); }}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                    <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={mockInsurance.primary.provider} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Member ID</label>
                    <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={mockInsurance.primary.memberId} />
                </div>
                 <div className="text-right space-x-2">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                </div>
            </div>
        </form>
    );
};


const Insurance: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            <PageHeader title="Insurance Details" subtitle="Manage your primary and secondary insurance information." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Primary Insurance">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Provider:</span>
                            <span className="font-semibold text-gray-800">{mockInsurance.primary.provider}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Plan Name:</span>
                            <span className="font-semibold text-gray-800">{mockInsurance.primary.planName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Member ID:</span>
                            <span className="font-semibold text-gray-800">{mockInsurance.primary.memberId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Group ID:</span>
                            <span className="font-semibold text-gray-800">{mockInsurance.primary.groupId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Effective Date:</span>
                            <span className="font-semibold text-gray-800">{mockInsurance.primary.effectiveDate}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm">
                        Update Primary Insurance
                    </button>
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
            
             <Modal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title="Edit Primary Insurance"
            >
                <InsuranceForm onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
            </Modal>
        </div>
    );
};

export default Insurance;

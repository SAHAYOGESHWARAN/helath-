import React, { useState } from 'react';
import Card from '../../components/shared/Card';

const initialInsuranceData = {
  provider: 'Blue Cross Blue Shield',
  planName: 'PPO Plan A',
  policyNumber: 'X123456789',
  groupNumber: 'G98765',
  memberId: 'M123456789',
};

const Insurance: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialInsuranceData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to save data would go here
    alert('Insurance information updated!');
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Insurance</h1>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Update Information
          </button>
        )}
      </div>

      <Card>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              <input type="text" name="provider" id="provider" value={formData.provider} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
             <div>
              <label htmlFor="planName" className="block text-sm font-medium text-gray-700">Plan Name</label>
              <input type="text" name="planName" id="planName" value={formData.planName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
             <div>
              <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">Policy Number</label>
              <input type="text" name="policyNumber" id="policyNumber" value={formData.policyNumber} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
             <div>
              <label htmlFor="groupNumber" className="block text-sm font-medium text-gray-700">Group Number</label>
              <input type="text" name="groupNumber" id="groupNumber" value={formData.groupNumber} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
             <div className="flex justify-end space-x-3 pt-4">
               <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
               <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">Insurance Provider</span>
              <span className="text-gray-800">{formData.provider}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">Plan Name</span>
              <span className="text-gray-800">{formData.planName}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">Policy Number</span>
              <span className="text-gray-800">{formData.policyNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium text-gray-600">Group Number</span>
              <span className="text-gray-800">{formData.groupNumber}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium text-gray-600">Member ID</span>
              <span className="text-gray-800">{formData.memberId}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Insurance;
import React from 'react';
import Card from '../../components/shared/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Allergy, Medication } from '../../types';
import { PlusIcon, UploadIcon } from '../../components/shared/Icons';

// Mock data for health trends
const bpData = [
  { date: '2023-10-01', systolic: 122, diastolic: 81 },
  { date: '2024-01-15', systolic: 125, diastolic: 83 },
  { date: '2024-04-20', systolic: 120, diastolic: 79 },
  { date: '2024-08-01', systolic: 118, diastolic: 78 },
];

const cholesterolData = [
  { date: '2023-10-01', total: 190, ldl: 110, hdl: 60 },
  { date: '2024-01-15', total: 195, ldl: 115, hdl: 58 },
  { date: '2024-04-20', total: 185, ldl: 105, hdl: 62 },
  { date: '2024-08-01', total: 180, ldl: 100, hdl: 60 },
];

const glucoseData = [
    { date: '2024-07-28', level: 98 },
    { date: '2024-07-29', level: 105 },
    { date: '2024-07-30', level: 92 },
    { date: '2024-07-31', level: 110 },
    { date: '2024-08-01', level: 95 },
];

const mockAllergies: Allergy[] = [
    { id: 'alg1', name: 'Penicillin', severity: 'Severe' },
    { id: 'alg2', name: 'Peanuts', severity: 'Moderate' },
];

const mockConditions = ['Hypertension', 'Asthma'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg">
                <p className="label text-gray-500">{`${new Date(label).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }} className="intro">{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};


const HealthRecords: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">My Health Records</h1>
      
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Allergies">
                <ul className="space-y-2">
                    {mockAllergies.map(allergy => (
                        <li key={allergy.id} className="flex justify-between p-2 rounded-md hover:bg-gray-50">
                            <span>{allergy.name}</span>
                            <span className="font-medium text-sm text-red-600">{allergy.severity}</span>
                        </li>
                    ))}
                </ul>
                <button className="w-full mt-4 text-sm font-semibold text-primary-600 hover:bg-primary-50 p-2 rounded-md flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 mr-2"/> Add Allergy
                </button>
            </Card>
             <Card title="Conditions">
                <ul className="space-y-2">
                    {mockConditions.map(condition => (
                        <li key={condition} className="p-2 rounded-md hover:bg-gray-50">{condition}</li>
                    ))}
                </ul>
                 <button className="w-full mt-4 text-sm font-semibold text-primary-600 hover:bg-primary-50 p-2 rounded-md flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 mr-2"/> Add Condition
                </button>
            </Card>
        </div>
        
        <Card title="Documents">
            <p className="text-gray-600 mb-4">Upload and manage your personal health documents.</p>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <UploadIcon className="w-10 h-10 mx-auto text-gray-400"/>
                <p className="mt-2 text-sm text-gray-600">Drag & drop files here or</p>
                <button className="mt-2 text-sm font-semibold text-primary-600 hover:underline">
                    Browse files
                </button>
            </div>
             <ul className="space-y-2 mt-4">
              <li className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-500 cursor-pointer transition-colors">Lab_Results_Aug_2024.pdf</li>
              <li className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-500 cursor-pointer transition-colors">Visit_Summary_Aug_2024.pdf</li>
              <li className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-primary-500 cursor-pointer transition-colors">Immunization_Record.pdf</li>
          </ul>
        </Card>

        <h2 className="text-3xl font-bold text-gray-800 pt-4">Health Trends</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Blood Pressure (mmHg)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bpData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fill: '#6b7281' }} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' })} />
                <YAxis tick={{ fill: '#6b7281' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#374151' }}/>
                <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Cholesterol (mg/dL)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cholesterolData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis dataKey="date" tick={{ fill: '#6b7281' }} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' })} />
                <YAxis tick={{ fill: '#6b7281' }}/>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="ldl" stroke="#ef4444" strokeWidth={2} name="LDL (Bad)" />
                <Line type="monotone" dataKey="hdl" stroke="#6366f1" strokeWidth={2} name="HDL (Good)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card title="Blood Glucose (mg/dL)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={glucoseData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis dataKey="date" tick={{ fill: '#6b7281' }} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fill: '#6b7281' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="level" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorGlucose)" name="Glucose Level" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecords;
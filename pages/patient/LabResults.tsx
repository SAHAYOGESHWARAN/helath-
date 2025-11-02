import React, { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LabResult } from '../../types';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import { BeakerIcon, DownloadIcon } from '../../components/shared/Icons';

const LabResultDetailModal: React.FC<{ result: LabResult | null; onClose: () => void; }> = ({ result, onClose }) => {
    if (!result) return null;

    const handlePrint = () => {
        const printContents = document.getElementById('lab-result-to-print')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = `<div class="printable-invoice">${printContents}</div>`;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); 
        }
    };

    return (
        <Modal 
            isOpen={!!result} 
            onClose={onClose} 
            title={result.testName}
            footer={
                <>
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                    <button onClick={handlePrint} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Print / Save
                    </button>
                </>
            }
            size="lg"
        >
            <div id="lab-result-to-print">
                <div className="space-y-4">
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">Patient</p>
                                <p className="font-semibold text-gray-800">John Doe</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Date Collected</p>
                                <p className="font-semibold text-gray-800">{new Date(result.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reference Range</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {result.components.map(c => (
                                    <tr key={c.name} className={c.isAbnormal ? 'bg-red-50' : ''}>
                                        <td className={`px-4 py-2 font-medium ${c.isAbnormal ? 'text-red-700' : 'text-gray-800'}`}>{c.name}</td>
                                        <td className={`px-4 py-2 ${c.isAbnormal ? 'font-bold text-red-700' : 'text-gray-700'}`}>{c.value}</td>
                                        <td className="px-4 py-2 text-gray-500">{c.referenceRange}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const LabResults: React.FC = () => {
    const { user } = useAuth();
    const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);

    const sortedResults = useMemo(() => 
        user?.labResults?.slice().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [],
        [user?.labResults]
    );

    return (
        <div>
            <PageHeader title="Lab Results" subtitle="View your history of lab work and results." />

            <Card>
                <div className="space-y-3">
                    {sortedResults.length > 0 ? (
                        sortedResults.map(result => (
                            <div
                                key={result.id}
                                onClick={() => setSelectedResult(result)}
                                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600"><BeakerIcon className="w-6 h-6"/></div>
                                    <div>
                                        <p className="font-bold text-gray-800">{result.testName}</p>
                                        <p className="text-sm text-gray-500">Date: {new Date(result.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-primary-600 hover:underline">
                                    View Details &rarr;
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <BeakerIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800">No Lab Results Found</h3>
                            <p className="mt-2">Your provider will share lab results with you here when they are available.</p>
                        </div>
                    )}
                </div>
            </Card>

            <LabResultDetailModal result={selectedResult} onClose={() => setSelectedResult(null)} />
        </div>
    );
};

export default LabResults;
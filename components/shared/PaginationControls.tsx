import React from 'react';
import { ChevronLeftIcon } from './Icons';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-4">
            {totalItems > 0 ? (
                 <span>
                    Showing {startItem} to {endItem} of {totalItems} results
                </span>
            ) : (
                <span>No results found.</span>
            )}
           
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    aria-label="Previous page"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                </button>
                <span className="px-2">
                    Page {currentPage} of {totalPages > 0 ? totalPages : 1}
                </span>
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages || totalPages === 0} 
                    className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center"
                    aria-label="Next page"
                >
                     <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronLeftIcon className="w-4 h-4 rotate-180" />
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;

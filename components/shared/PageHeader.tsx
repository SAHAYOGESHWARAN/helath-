
import React from 'react';
import { PlusIcon } from './Icons';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, buttonText, onButtonClick, children }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{title}</h1>
                {subtitle && <p className="mt-1 text-lg text-gray-500">{subtitle}</p>}
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
                {children}
                {buttonText && onButtonClick && (
                    <button
                        onClick={onButtonClick}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 flex items-center"
                    >
                       <PlusIcon className="w-5 h-5 mr-2" />
                       <span>{buttonText}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PageHeader;

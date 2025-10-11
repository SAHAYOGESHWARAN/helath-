import React from 'react';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon, StarIcon } from './Icons';

interface SubscriptionTierCardProps {
    plan: SubscriptionPlan & { isPopular?: boolean };
    currentPlanName: string;
}

const SubscriptionTierCard: React.FC<SubscriptionTierCardProps> = ({ plan, currentPlanName }) => {
    const isCurrent = plan.name === currentPlanName;
    const isPopular = plan.isPopular;

    const cardClasses = `
        border-2 rounded-xl p-6 flex flex-col transition-all duration-300 h-full
        ${isCurrent ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}
        ${isPopular && !isCurrent ? 'shadow-lg transform scale-105' : 'shadow-sm'}
    `;

    const buttonClasses = `
        w-full text-center font-bold py-3 px-4 rounded-lg mt-6 transition-colors text-sm
        ${isCurrent ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 
         isPopular ? 'bg-accent hover:bg-accent-dark text-white' : 
         'bg-primary-600 hover:bg-primary-700 text-white'}
    `;

    return (
        <div className={cardClasses}>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                {isPopular && (
                    <div className="flex items-center text-xs font-semibold bg-accent-light text-accent-dark px-3 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 mr-1.5" />
                        POPULAR
                    </div>
                )}
            </div>
            
            <p className="text-3xl font-extrabold text-gray-900 my-4">{plan.price}</p>
            
            <div className="border-t border-gray-200 pt-4 flex-grow">
                <ul className="space-y-3">
                    {plan.features.map(feature => (
                        <li key={feature} className="flex items-start text-gray-600 text-sm">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button className={buttonClasses} disabled={isCurrent}>
                {isCurrent ? 'Current Plan' : 'Choose Plan'}
            </button>
        </div>
    );
};

export default SubscriptionTierCard;

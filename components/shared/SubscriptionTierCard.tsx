"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Icons_1 = require("./Icons");
var SubscriptionTierCard = function (_a) {
    var plan = _a.plan, currentPlanName = _a.currentPlanName, onChoosePlan = _a.onChoosePlan;
    var isCurrent = plan.name === currentPlanName;
    var isPopular = plan.isPopular;
    var cardClasses = "\n        border-2 rounded-xl p-6 flex flex-col transition-all duration-300 h-full\n        ".concat(isCurrent ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white', "\n        ").concat(isPopular && !isCurrent ? 'shadow-lg transform scale-105' : 'shadow-sm', "\n    ");
    var buttonClasses = "\n        w-full text-center font-bold py-3 px-4 rounded-lg mt-6 transition-colors text-sm\n        ".concat(isCurrent ? 'bg-gray-300 text-gray-600 cursor-not-allowed' :
        isPopular ? 'bg-accent hover:bg-accent-dark text-white' :
            'bg-primary-600 hover:bg-primary-700 text-white', "\n    ");
    return (<div className={cardClasses}>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                {isPopular && (<div className="flex items-center text-xs font-semibold bg-accent-light text-accent-dark px-3 py-1 rounded-full">
                        <Icons_1.StarIcon className="w-4 h-4 mr-1.5"/>
                        POPULAR
                    </div>)}
            </div>

            <p className="text-3xl font-extrabold text-gray-900 my-4">{plan.price}</p>

            <div className="border-t border-gray-200 pt-4 flex-grow">
                <ul className="space-y-3">
                    {plan.features.map(function (feature) { return (<li key={feature} className="flex items-start text-gray-600 text-sm">
                            <Icons_1.CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0 mt-0.5"/>
                            <span>{feature}</span>
                        </li>); })}
                </ul>
            </div>

            <button className={buttonClasses} disabled={isCurrent} onClick={function () { return onChoosePlan(plan.id); }}>
                {isCurrent ? 'Current Plan' : 'Choose Plan'}
            </button>
        </div>);
};
exports.default = SubscriptionTierCard;

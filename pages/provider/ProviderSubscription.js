"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var useAuth_1 = require("../../hooks/useAuth");
var SubscriptionTierCard_1 = require("../../components/shared/SubscriptionTierCard");
var App_1 = require("../../App");
var Card_1 = require("../../components/shared/Card");
var ProviderSubscription = function () {
    var _a;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, providerSubscriptionPlans = _b.providerSubscriptionPlans, changeSubscription = _b.changeSubscription;
    var showToast = (0, App_1.useApp)().showToast;
    var currentPlan = providerSubscriptionPlans.find(function (p) { var _a; return p.id === ((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.planId); });
    var handleChoosePlan = function (planId) {
        changeSubscription(planId);
        showToast("Subscription changed successfully!", 'success');
    };
    return (<div>
      <PageHeader_1.default title="My Subscription" subtitle="Manage your practice's subscription plan."/>
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {providerSubscriptionPlans.map(function (plan) { return (<SubscriptionTierCard_1.default key={plan.id} plan={plan} currentPlanName={(currentPlan === null || currentPlan === void 0 ? void 0 : currentPlan.name) || ''} onChoosePlan={handleChoosePlan}/>); })}
            </div>
        </div>
        <div className="lg:col-span-2">
            <Card_1.default title="Current Plan Details">
                {currentPlan ? (<div className="space-y-3">
                        <h3 className="text-xl font-bold text-primary-600">{currentPlan.name}</h3>
                        <p className="font-semibold">{currentPlan.price}</p>
                        <p className="text-sm text-gray-500">Renews on: {(_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.renewalDate}</p>
                        <ul className="text-sm space-y-2 pt-2 border-t">
                            {currentPlan.features.map(function (f) { return <li key={f}>{f}</li>; })}
                        </ul>
                    </div>) : (<p className="text-gray-500">No active subscription.</p>)}
            </Card_1.default>
        </div>
      </div>
    </div>);
};
exports.default = ProviderSubscription;

"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var ProductManagement = function () {
    var _a = (0, useAuth_1.useAuth)(), providerSubscriptionPlans = _a.providerSubscriptionPlans, patientSubscriptionPlans = _a.patientSubscriptionPlans;
    var allProducts = __spreadArray(__spreadArray([], providerSubscriptionPlans, true), patientSubscriptionPlans, true);
    return (<div>
            <PageHeader_1.default title="Product & Service Management" buttonText="Add New Product" onButtonClick={function () { }}/>
            <Card_1.default>
                <p className="mb-4 text-gray-600">Manage all purchasable products, services, and subscription tiers across the platform.</p>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product/Plan Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Audience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allProducts.length > 0 ? (allProducts.map(function (plan) { return (<tr key={plan.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{plan.price}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.id.startsWith('plan_d') ? 'Providers' : 'Patients'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-primary-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>); })) : (<tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No products found. <button onClick={function () { }} className="text-primary-600 font-semibold hover:underline">Add one now.</button>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </Card_1.default>
        </div>);
};
exports.default = ProductManagement;

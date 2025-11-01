"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var Card_1 = require("../../components/shared/Card");
var VideoUpdateModal_1 = require("./VideoUpdateModal");
var Icons_1 = require("../../components/shared/Icons");
var Profile = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, updateUser = _a.updateUser;
    var _b = (0, react_1.useState)({}), formState = _b[0], setFormState = _b[1];
    var _c = (0, react_1.useState)(false), isEditMode = _c[0], setIsEditMode = _c[1];
    var _d = (0, react_1.useState)(false), isPicModalOpen = _d[0], setIsPicModalOpen = _d[1];
    (0, react_1.useEffect)(function () {
        if (user) {
            setFormState({
                name: user.name,
                email: user.email,
                dob: user.dob,
                phone: user.phone,
                address: user.address,
            });
        }
    }, [user]);
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormState(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        updateUser(formState);
        setIsEditMode(false);
        alert('Profile updated successfully!');
    };
    var handleAvatarUpdate = function (newAvatarUrl) {
        if (user) {
            updateUser({ avatarUrl: newAvatarUrl });
            setIsPicModalOpen(false);
        }
    };
    if (!user)
        return null;
    return (<div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card_1.default className="text-center">
                        <div className="relative group w-32 h-32 mx-auto mb-4">
                            <img src={user.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full mx-auto border-4 border-primary-200"/>
                            <button onClick={function () { return setIsPicModalOpen(true); }} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300" aria-label="Update profile picture">
                                <Icons_1.CameraIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </Card_1.default>
                </div>
                <div className="md:col-span-2">
                    <Card_1.default title="Personal Information">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" value={formState.name || ''} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"/>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" value={formState.email || ''} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"/>
                            </div>
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input type="date" name="dob" id="dob" value={formState.dob || ''} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"/>
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formState.phone || ''} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"/>
                            </div>
                             <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                <input type="text" name="address" id="address" value={formState.address || ''} onChange={handleInputChange} disabled={!isEditMode} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"/>
                            </div>
                            <div className="text-right">
                                {isEditMode ? (<div className="space-x-3">
                                        <button type="button" onClick={function () { return setIsEditMode(false); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                                    </div>) : (<button type="button" onClick={function () { return setIsEditMode(true); }} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>)}
                            </div>
                        </form>
                    </Card_1.default>
                </div>
            </div>
            {isPicModalOpen && <VideoUpdateModal_1.default onClose={function () { return setIsPicModalOpen(false); }} onSend={handleAvatarUpdate} isOpen={isPicModalOpen}/>}
        </div>);
};
exports.default = Profile;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.AuthProvider = exports.AuthContext = void 0;
var react_1 = require("react");
// FIX: Add missing Subscription type import.
var types_1 = require("../types");
var mockData_1 = require("../mockData");
exports.AuthContext = (0, react_1.createContext)(undefined);
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(null), user = _b[0], setUser = _b[1];
    var _c = (0, react_1.useState)(mockData_1.MOCK_USERS), users = _c[0], setUsers = _c[1];
    var _d = (0, react_1.useState)(true), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_1.useState)(mockData_1.MOCK_APPOINTMENTS), appointments = _e[0], setAppointments = _e[1];
    var _f = (0, react_1.useState)(mockData_1.MOCK_CLAIMS), claims = _f[0], setClaims = _f[1];
    var _g = (0, react_1.useState)(mockData_1.MOCK_INVOICES), invoices = _g[0], setInvoices = _g[1];
    var _h = (0, react_1.useState)(mockData_1.MOCK_PROGRESS_NOTES), progressNotes = _h[0], setProgressNotes = _h[1];
    var _j = (0, react_1.useState)(mockData_1.MOCK_PRESCRIPTIONS), prescriptions = _j[0], setPrescriptions = _j[1];
    var _k = (0, react_1.useState)(mockData_1.MOCK_MESSAGES), messages = _k[0], setMessages = _k[1];
    var _l = (0, react_1.useState)(mockData_1.MOCK_LAB_ORDERS), labOrders = _l[0], setLabOrders = _l[1];
    var _m = (0, react_1.useState)(mockData_1.MOCK_REFERRALS), referrals = _m[0], setReferrals = _m[1];
    var _o = (0, react_1.useState)({}), reminders = _o[0], setReminders = _o[1];
    (0, react_1.useEffect)(function () {
        try {
            var storedUser = sessionStorage.getItem('novopath-user');
            if (storedUser) {
                var parsedUser_1 = JSON.parse(storedUser);
                var fullUser = users.find(function (u) { return u.id === parsedUser_1.id; }) || parsedUser_1;
                setUser(fullUser);
            }
        }
        catch (error) {
            console.error('Failed to parse user from session storage', error);
        }
        finally {
            setLoading(false);
        }
    }, [users]);
    var login = (0, react_1.useCallback)(function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setLoading(true);
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        var foundUser = users.find(function (u) { return u.email.toLowerCase() === email.toLowerCase(); });
                        if (foundUser && foundUser.password === password) {
                            setUser(foundUser);
                            sessionStorage.setItem('novopath-user', JSON.stringify(foundUser));
                            resolve(true);
                        }
                        else {
                            resolve(false);
                        }
                        setLoading(false);
                    }, 500);
                })];
        });
    }); }, [users]);
    var logout = (0, react_1.useCallback)(function () {
        setUser(null);
        sessionStorage.removeItem('novopath-user');
    }, []);
    var register = (0, react_1.useCallback)(function (userData, role) {
        setLoading(true);
        setTimeout(function () {
            var newUser = __assign(__assign({ id: "user_".concat(Date.now()) }, userData), { role: role, avatarUrl: "https://picsum.photos/seed/".concat(userData.name, "/100"), status: 'Active', isVerified: role !== types_1.UserRole.PROVIDER, notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false } });
            setUsers(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newUser], false); });
            setUser(newUser);
            sessionStorage.setItem('novopath-user', JSON.stringify(newUser));
            setLoading(false);
        }, 500);
    }, []);
    var updateUser = (0, react_1.useCallback)(function (updatedData) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setUser(function (currentUser) {
                if (!currentUser)
                    return null;
                var updates = typeof updatedData === 'function' ? updatedData(currentUser) : updatedData;
                var updatedUser = __assign(__assign({}, currentUser), updates);
                sessionStorage.setItem('novopath-user', JSON.stringify(updatedUser));
                return updatedUser;
            });
            setUsers(function (currentUsers) { return currentUsers.map(function (u) { return u.id === (user === null || user === void 0 ? void 0 : user.id) ? __assign(__assign({}, u), (typeof updatedData === 'function' ? updatedData(u) : updatedData)) : u; }); });
            return [2 /*return*/];
        });
    }); }, [user === null || user === void 0 ? void 0 : user.id]);
    // ... other actions
    var addAppointment = (0, react_1.useCallback)(function (appointment, reminder) {
        var newAppointment = __assign(__assign({}, appointment), { id: "appt_".concat(Date.now()) });
        setAppointments(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newAppointment], false); });
        if (reminder) {
            setReminders(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[newAppointment.id] = reminder, _a)));
            });
        }
    }, []);
    var addVideoUpdateToAppointment = (0, react_1.useCallback)(function (appointmentId, videoUrl) {
        setAppointments(function (prev) { return prev.map(function (appt) {
            if (appt.id === appointmentId) {
                var newUpdate = { id: "vid_".concat(Date.now()), date: new Date().toISOString(), videoUrl: videoUrl };
                return __assign(__assign({}, appt), { videoUpdates: __spreadArray(__spreadArray([], (appt.videoUpdates || []), true), [newUpdate], false) });
            }
            return appt;
        }); });
    }, []);
    var makePayment = (0, react_1.useCallback)(function (invoiceId, amount) {
        setInvoices(function (prev) { return prev.map(function (inv) {
            if (inv.id === invoiceId) {
                var newAmountDue = inv.amountDue - amount;
                return __assign(__assign({}, inv), { amountDue: newAmountDue, status: newAmountDue <= 0 ? 'Paid' : 'Due' });
            }
            return inv;
        }); });
    }, []);
    var updateInsurance = (0, react_1.useCallback)(function (data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateUser({ insurance: data })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [updateUser]);
    var changeSubscription = (0, react_1.useCallback)(function (planId) {
        if (user) {
            var newSub = {
                planId: planId,
                status: 'Active',
                renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
            updateUser({ subscription: newSub });
        }
    }, [user, updateUser]);
    var addProgressNote = (0, react_1.useCallback)(function (note) {
        setProgressNotes(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, note), { id: "note_".concat(Date.now()) })], false); });
    }, []);
    var addPrescription = (0, react_1.useCallback)(function (prescription) {
        setPrescriptions(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, prescription), { id: "rx_".concat(Date.now()), status: 'Sent' })], false); });
    }, []);
    var addClaim = (0, react_1.useCallback)(function (claim) {
        setClaims(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, claim), { id: "CLM".concat(Date.now()) })], false); });
    }, []);
    var addInvoice = (0, react_1.useCallback)(function (invoice) {
        setInvoices(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, invoice), { id: "inv_".concat(Date.now()) })], false); });
    }, []);
    var sendMessage = (0, react_1.useCallback)(function (message) {
        var key = (user === null || user === void 0 ? void 0 : user.role) === types_1.UserRole.PROVIDER ? message.receiverId : (user === null || user === void 0 ? void 0 : user.id) === message.senderId ? message.receiverId : message.senderId;
        if (!key)
            return;
        var newMessage = __assign(__assign({}, message), { id: "msg_".concat(Date.now()), timestamp: new Date().toISOString(), isRead: false });
        setMessages(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = __spreadArray(__spreadArray([], (prev[key] || []), true), [newMessage], false), _a)));
        });
    }, [user]);
    var markMessagesAsRead = (0, react_1.useCallback)(function (contactId) {
        if (!user)
            return;
        setMessages(function (prev) {
            var _a;
            var chatHistory = prev[contactId] || [];
            return __assign(__assign({}, prev), (_a = {}, _a[contactId] = chatHistory.map(function (m) { return m.senderId !== user.id && !m.isRead ? __assign(__assign({}, m), { isRead: true }) : m; }), _a));
        });
    }, [user]);
    var confirmAppointment = (0, react_1.useCallback)(function (appointmentId) {
        setAppointments(function (prev) { return prev.map(function (a) { return a.id === appointmentId ? __assign(__assign({}, a), { status: 'Confirmed' }) : a; }); });
    }, []);
    var cancelAppointment = (0, react_1.useCallback)(function (appointmentId) {
        setAppointments(function (prev) { return prev.map(function (a) { return a.id === appointmentId ? __assign(__assign({}, a), { status: 'Cancelled' }) : a; }); });
    }, []);
    var addLabOrder = (0, react_1.useCallback)(function (newOrder) {
        setLabOrders(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, newOrder), { id: "lo_".concat(Date.now()) })], false); });
    }, []);
    var addReferral = (0, react_1.useCallback)(function (newReferral) {
        var now = new Date().toISOString();
        var referral = __assign(__assign({}, newReferral), { id: "ref_".concat(Date.now()), createdAt: now, status: types_1.ReferralStatus.PENDING, type: 'Outgoing', auditLog: [{ date: now, action: 'Referral Created', status: types_1.ReferralStatus.PENDING }] });
        setReferrals(function (prev) { return __spreadArray(__spreadArray([], prev, true), [referral], false); });
    }, []);
    var updateReferral = (0, react_1.useCallback)(function (id, updates, actionText) {
        setReferrals(function (prev) { return prev.map(function (r) {
            if (r.id === id) {
                var newLog = { date: new Date().toISOString(), action: actionText, status: updates.status || r.status };
                return __assign(__assign(__assign({}, r), updates), { auditLog: __spreadArray(__spreadArray([], r.auditLog, true), [newLog], false) });
            }
            return r;
        }); });
    }, []);
    var changePassword = (0, react_1.useCallback)(function (current, newPass) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Mock implementation
            return [2 /*return*/, true];
        });
    }); }, []);
    var addHealthGoal = (0, react_1.useCallback)(function (goal) {
        updateUser(function (currentUser) { return ({ healthGoals: __spreadArray(__spreadArray([], (currentUser.healthGoals || []), true), [__assign(__assign({}, goal), { id: "goal_".concat(Date.now()) })], false) }); });
    }, [updateUser]);
    var updateHealthGoal = (0, react_1.useCallback)(function (goal) {
        updateUser(function (currentUser) { var _a; return ({ healthGoals: (_a = currentUser.healthGoals) === null || _a === void 0 ? void 0 : _a.map(function (g) { return g.id === goal.id ? goal : g; }) }); });
    }, [updateUser]);
    var deleteHealthGoal = (0, react_1.useCallback)(function (goalId) {
        updateUser(function (currentUser) { var _a; return ({ healthGoals: (_a = currentUser.healthGoals) === null || _a === void 0 ? void 0 : _a.filter(function (g) { return g.id !== goalId; }) }); });
    }, [updateUser]);
    var addTask = (0, react_1.useCallback)(function (task) {
        updateUser(function (currentUser) { return ({ tasks: __spreadArray(__spreadArray([], (currentUser.tasks || []), true), [__assign(__assign({}, task), { id: "task_".concat(Date.now()), completed: false })], false) }); });
    }, [updateUser]);
    var toggleTaskCompletion = (0, react_1.useCallback)(function (taskId) {
        updateUser(function (currentUser) { var _a; return ({ tasks: (_a = currentUser.tasks) === null || _a === void 0 ? void 0 : _a.map(function (t) { return t.id === taskId ? __assign(__assign({}, t), { completed: !t.completed }) : t; }) }); });
    }, [updateUser]);
    var addSubtask = (0, react_1.useCallback)(function (taskId, text) {
        updateUser(function (currentUser) {
            var _a;
            return ({ tasks: (_a = currentUser.tasks) === null || _a === void 0 ? void 0 : _a.map(function (t) {
                    if (t.id === taskId) {
                        var newSubtask = { id: "sub_".concat(Date.now()), text: text, completed: false };
                        return __assign(__assign({}, t), { subtasks: __spreadArray(__spreadArray([], (t.subtasks || []), true), [newSubtask], false) });
                    }
                    return t;
                }) });
        });
    }, [updateUser]);
    var toggleSubtaskCompletion = (0, react_1.useCallback)(function (taskId, subtaskId) {
        updateUser(function (currentUser) {
            var _a;
            return ({ tasks: (_a = currentUser.tasks) === null || _a === void 0 ? void 0 : _a.map(function (t) {
                    var _a;
                    if (t.id === taskId) {
                        return __assign(__assign({}, t), { subtasks: (_a = t.subtasks) === null || _a === void 0 ? void 0 : _a.map(function (st) { return st.id === subtaskId ? __assign(__assign({}, st), { completed: !st.completed }) : st; }) });
                    }
                    return t;
                }) });
        });
    }, [updateUser]);
    var deleteSubtask = (0, react_1.useCallback)(function (taskId, subtaskId) {
        updateUser(function (currentUser) {
            var _a;
            return ({ tasks: (_a = currentUser.tasks) === null || _a === void 0 ? void 0 : _a.map(function (t) {
                    var _a;
                    if (t.id === taskId) {
                        return __assign(__assign({}, t), { subtasks: (_a = t.subtasks) === null || _a === void 0 ? void 0 : _a.filter(function (st) { return st.id !== subtaskId; }) });
                    }
                    return t;
                }) });
        });
    }, [updateUser]);
    var addCondition = (0, react_1.useCallback)(function (condition) {
        updateUser(function (currentUser) { return ({
            conditions: __spreadArray(__spreadArray([], (currentUser.conditions || []), true), [__assign(__assign({}, condition), { id: "cond_".concat(Date.now()) })], false),
        }); });
    }, [updateUser]);
    var addAllergy = (0, react_1.useCallback)(function (allergy) {
        updateUser(function (currentUser) { return ({
            allergies: __spreadArray(__spreadArray([], (currentUser.allergies || []), true), [__assign(__assign({}, allergy), { id: "alg_".concat(Date.now()) })], false),
        }); });
    }, [updateUser]);
    var currentSubscription = (0, react_1.useMemo)(function () {
        if (!user || !user.subscription)
            return undefined;
        var allPlans = __spreadArray(__spreadArray([], mockData_1.MOCK_PROVIDER_PLANS, true), mockData_1.MOCK_PATIENT_PLANS, true);
        return allPlans.find(function (p) { var _a; return p.id === ((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.planId); });
    }, [user]);
    var value = {
        user: user,
        users: users,
        loading: loading,
        login: login,
        logout: logout,
        register: register,
        updateUser: updateUser,
        appointments: appointments,
        claims: claims,
        invoices: invoices,
        currentSubscription: currentSubscription,
        changeSubscription: changeSubscription,
        patientSubscriptionPlans: mockData_1.MOCK_PATIENT_PLANS,
        providerSubscriptionPlans: mockData_1.MOCK_PROVIDER_PLANS,
        addAppointment: addAppointment,
        addVideoUpdateToAppointment: addVideoUpdateToAppointment,
        makePayment: makePayment,
        insurance: (user === null || user === void 0 ? void 0 : user.insurance) || null,
        updateInsurance: updateInsurance,
        progressNotes: progressNotes,
        addProgressNote: addProgressNote,
        prescriptions: prescriptions,
        addPrescription: addPrescription,
        messages: messages,
        sendMessage: sendMessage,
        markMessagesAsRead: markMessagesAsRead,
        confirmAppointment: confirmAppointment,
        cancelAppointment: cancelAppointment,
        labOrders: labOrders,
        addLabOrder: addLabOrder,
        referrals: referrals,
        addReferral: addReferral,
        updateReferral: updateReferral,
        changePassword: changePassword,
        reminders: reminders,
        addCondition: addCondition,
        addAllergy: addAllergy,
        addHealthGoal: addHealthGoal,
        updateHealthGoal: updateHealthGoal,
        deleteHealthGoal: deleteHealthGoal,
        addTask: addTask,
        toggleTaskCompletion: toggleTaskCompletion,
        addSubtask: addSubtask,
        toggleSubtaskCompletion: toggleSubtaskCompletion,
        deleteSubtask: deleteSubtask,
        addClaim: addClaim,
        addInvoice: addInvoice,
        auditLog: mockData_1.MOCK_AUDIT_LOG,
    };
    return (<exports.AuthContext.Provider value={value}>
            {children}
        </exports.AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;

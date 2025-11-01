"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var Icons_1 = require("../../components/shared/Icons");
var formatTimestamp = function (timestamp) {
    var date = new Date(timestamp);
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) {
        return 'Yesterday';
    }
    return date.toLocaleDateString();
};
var Messaging = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, users = _a.users, messages = _a.messages, sendMessage = _a.sendMessage, markMessagesAsRead = _a.markMessagesAsRead;
    var _b = (0, react_1.useState)(null), selectedPatient = _b[0], setSelectedPatient = _b[1];
    var _c = (0, react_1.useState)(''), message = _c[0], setMessage = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var messagesEndRef = (0, react_1.useRef)(null);
    var patientsWithMessages = (0, react_1.useMemo)(function () {
        if (!user)
            return [];
        var patientConversations = new Map();
        var allMessages = Object.values(messages).flat();
        allMessages.forEach(function (msg) {
            var patientId = null;
            if (msg.senderId === user.id) {
                patientId = msg.receiverId;
            }
            else if (msg.receiverId === user.id) {
                patientId = msg.senderId;
            }
            if (patientId) {
                var patient = users.find(function (u) { return u.id === patientId && u.role === types_1.UserRole.PATIENT; });
                if (patient) {
                    if (!patientConversations.has(patient.id)) {
                        patientConversations.set(patient.id, {
                            patient: patient,
                            lastMessage: null,
                            unreadCount: 0,
                        });
                    }
                    var convo = patientConversations.get(patient.id);
                    if (!convo.lastMessage || new Date(msg.timestamp) > new Date(convo.lastMessage.timestamp)) {
                        convo.lastMessage = msg;
                    }
                    if (!msg.isRead && msg.senderId !== user.id) {
                        convo.unreadCount += 1;
                    }
                }
            }
        });
        return Array.from(patientConversations.values()).sort(function (a, b) {
            if (!a.lastMessage)
                return 1;
            if (!b.lastMessage)
                return -1;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [users, messages, user]);
    (0, react_1.useEffect)(function () {
        if (patientsWithMessages.length > 0 && !selectedPatient) {
            setSelectedPatient(patientsWithMessages[0].patient);
        }
    }, [patientsWithMessages, selectedPatient]);
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedPatient, isLoading]);
    (0, react_1.useEffect)(function () {
        if (selectedPatient && user) {
            markMessagesAsRead(selectedPatient.id);
        }
    }, [selectedPatient, user, markMessagesAsRead, messages]);
    var currentMessages = (0, react_1.useMemo)(function () {
        if (!selectedPatient || !user)
            return [];
        var allMessages = Object.values(messages).flat();
        var relevantMessages = allMessages.filter(function (m) { return (m.senderId === user.id && m.receiverId === selectedPatient.id) ||
            (m.senderId === selectedPatient.id && m.receiverId === user.id); });
        var uniqueMessages = Array.from(new Map(relevantMessages.map(function (m) { return [m.id, m]; })).values());
        return uniqueMessages.sort(function (a, b) { return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); });
    }, [messages, selectedPatient, user]);
    var handleSendMessage = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            e.preventDefault();
            if (!message.trim() || !user || !selectedPatient)
                return [2 /*return*/];
            setIsLoading(true);
            sendMessage({
                senderId: user.id,
                receiverId: selectedPatient.id,
                text: message,
            });
            setMessage('');
            setIsLoading(false);
            return [2 /*return*/];
        });
    }); };
    if (!user)
        return null;
    return (<div className="flex h-[calc(100vh-6.5rem)] bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Patient Messages</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    {patientsWithMessages.map(function (_a) {
            var patient = _a.patient, lastMessage = _a.lastMessage, unreadCount = _a.unreadCount;
            return (<div key={patient.id} onClick={function () { return setSelectedPatient(patient); }} className={"flex items-center p-3 cursor-pointer border-l-4 ".concat((selectedPatient === null || selectedPatient === void 0 ? void 0 : selectedPatient.id) === patient.id ? 'bg-primary-50 border-primary-600' : 'border-transparent hover:bg-gray-50')}>
                            <img src={patient.avatarUrl} alt={patient.name} className="w-12 h-12 rounded-full mr-3"/>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-800 truncate">{patient.name}</p>
                                    {lastMessage && <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTimestamp(lastMessage.timestamp)}</p>}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600 truncate">{(lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.text) || 'No messages yet'}</p>
                                    {unreadCount > 0 && <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">{unreadCount}</span>}
                                </div>
                            </div>
                        </div>);
        })}
                </div>
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gray-50">
                {selectedPatient ? (<>
                        <div className="p-4 border-b bg-white flex items-center shadow-sm">
                            <img src={selectedPatient.avatarUrl} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3"/>
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedPatient.name}</h3>
                                <p className="text-sm text-gray-500">DOB: {selectedPatient.dob}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {currentMessages.map(function (msg) { return (<div key={msg.id} className={"flex items-end gap-3 ".concat(msg.senderId === user.id ? 'justify-end' : 'justify-start')}>
                                    {msg.senderId !== user.id && <img src={selectedPatient.avatarUrl} alt="patient avatar" className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                    <div className={"max-w-lg p-3 rounded-2xl ".concat(msg.senderId === user.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border')}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className="text-xs opacity-70 mt-1.5 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    {msg.senderId === user.id && <img src={user.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0"/>}
                                </div>); })}
                            {isLoading && (<div className="flex items-end gap-3 justify-end">
                                    <div className="max-w-lg p-3 rounded-2xl bg-primary-600 text-white rounded-br-none">
                                        <div className="flex items-center space-x-1">
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                    <img src={user.avatarUrl} alt="provider avatar" className="w-8 h-8 rounded-full flex-shrink-0"/>
                                </div>)}
                            <div ref={messagesEndRef}/>
                        </div>
                        <div className="p-4 border-t bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                <input type="text" value={message} onChange={function (e) { return setMessage(e.target.value); }} placeholder={"Message ".concat(selectedPatient.name, "...")} className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50" aria-label="Message input"/>
                                <button type="submit" disabled={!message.trim() || isLoading} className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 disabled:bg-gray-400 transition-colors" aria-label="Send message">
                                    <Icons_1.PaperAirplaneIcon className="w-6 h-6"/>
                                </button>
                            </form>
                        </div>
                    </>) : (<div className="flex-1 flex items-center justify-center text-gray-500">
                        <p>Select a conversation to start messaging.</p>
                    </div>)}
            </div>
        </div>);
};
exports.default = Messaging;

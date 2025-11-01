"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var react_router_dom_1 = require("react-router-dom");
var Tabs_1 = require("../../components/shared/Tabs");
var Icons_1 = require("../../components/shared/Icons");
var Inbox = function () {
    var _a = (0, useAuth_1.useAuth)(), progressNotes = _a.progressNotes, labOrders = _a.labOrders, referrals = _a.referrals, messages = _a.messages, user = _a.user, users = _a.users;
    var unreadMessages = Object.values(messages).flat().filter(function (m) { return m.receiverId === (user === null || user === void 0 ? void 0 : user.id) && !m.isRead; });
    var pendingLabs = labOrders.filter(function (o) { return o.status === 'Results Ready'; });
    var incomingReferrals = referrals.filter(function (r) { return r.type === 'Incoming' && r.status === 'Pending'; });
    var unsignedNotes = progressNotes.filter(function (n) { return n.status === 'Pending Signature'; });
    var renderTaskList = function (items, emptyText) { return (items.length > 0 ? (<ul className="divide-y divide-gray-200">
                {items.map(function (item) { return (<li key={item.id} className="py-3 flex justify-between items-center">
                        <p className="font-medium text-gray-800">{item.text}</p>
                        <react_router_dom_1.Link to={item.link} className="text-primary-600 hover:underline font-semibold text-sm">
                            View &rarr;
                        </react_router_dom_1.Link>
                    </li>); })}
            </ul>) : (<p className="text-center text-gray-500 py-8">{emptyText}</p>)); };
    var tabs = [
        { name: "Messages (".concat(unreadMessages.length, ")"), icon: <Icons_1.ChatBubbleLeftRightIcon />, content: renderTaskList(unreadMessages.map(function (m) { var _a; return ({ id: m.id, text: "New message from ".concat(((_a = users.find(function (u) { return u.id === m.senderId; })) === null || _a === void 0 ? void 0 : _a.name) || 'Patient'), link: '/messaging' }); }), 'No unread messages.') },
        { name: "Lab Results (".concat(pendingLabs.length, ")"), icon: <Icons_1.BeakerIcon />, content: renderTaskList(pendingLabs.map(function (o) { return ({ id: o.id, text: "Results ready for ".concat(o.patientName), link: '/lab-orders' }); }), 'No lab results to review.') },
        { name: "Referrals (".concat(incomingReferrals.length, ")"), icon: <Icons_1.ArrowRightOnRectangleIcon />, content: renderTaskList(incomingReferrals.map(function (r) { return ({ id: r.id, text: "Incoming referral for ".concat(r.patientName, " from ").concat(r.referredFrom), link: '/referrals' }); }), 'No incoming referrals.') },
        { name: "Unsigned Notes (".concat(unsignedNotes.length, ")"), icon: <Icons_1.PencilAltIcon />, content: renderTaskList(unsignedNotes.map(function (n) { return ({ id: n.id, text: "Sign note for ".concat(n.patientName, " (").concat(n.date, ")"), link: '/progress-notes' }); }), 'No notes pending signature.') },
    ];
    return (<div>
            <PageHeader_1.default title="Action Center" subtitle="All items requiring your attention."/>
            <Card_1.default className="p-0">
                <Tabs_1.default tabs={tabs}/>
            </Card_1.default>
        </div>);
};
exports.default = Inbox;

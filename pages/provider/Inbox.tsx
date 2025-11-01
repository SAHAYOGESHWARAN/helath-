
import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Tabs from '../../components/shared/Tabs';
import { ChatBubbleLeftRightIcon, BeakerIcon, ArrowRightOnRectangleIcon, PencilAltIcon, InboxIcon } from '../../components/shared/Icons';

const Inbox: React.FC = () => {
    const { progressNotes, labOrders, referrals, messages, user, users } = useAuth();
    
    const unreadMessages = Object.values(messages).flat().filter(m => m.receiverId === user?.id && !m.isRead);
    const pendingLabs = labOrders.filter(o => o.status === 'Results Ready');
    const incomingReferrals = referrals.filter(r => r.type === 'Incoming' && r.status === 'Pending');
    const unsignedNotes = progressNotes.filter(n => n.status === 'Pending Signature');

    const renderTaskList = (items: {id: string, text: string, link: string}[], emptyText: string) => (
        items.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {items.map(item => (
                    <li key={item.id} className="py-3 flex justify-between items-center">
                        <p className="font-medium text-gray-800">{item.text}</p>
                        <Link to={item.link} className="text-primary-600 hover:underline font-semibold text-sm">
                            View &rarr;
                        </Link>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-gray-500 py-8">{emptyText}</p>
        )
    );
    
    const tabs = [
        { name: `Messages (${unreadMessages.length})`, icon: <ChatBubbleLeftRightIcon />, content: renderTaskList(
            unreadMessages.map(m => ({id: m.id, text: `New message from ${users.find(u=>u.id === m.senderId)?.name || 'Patient'}`, link: '/messaging'})),
            'No unread messages.'
        )},
        { name: `Lab Results (${pendingLabs.length})`, icon: <BeakerIcon />, content: renderTaskList(
            pendingLabs.map(o => ({id: o.id, text: `Results ready for ${o.patientName}`, link: '/lab-orders'})),
            'No lab results to review.'
        )},
        { name: `Referrals (${incomingReferrals.length})`, icon: <ArrowRightOnRectangleIcon />, content: renderTaskList(
            incomingReferrals.map(r => ({id: r.id, text: `Incoming referral for ${r.patientName} from ${r.referredFrom}`, link: '/referrals'})),
            'No incoming referrals.'
        )},
        { name: `Unsigned Notes (${unsignedNotes.length})`, icon: <PencilAltIcon />, content: renderTaskList(
            unsignedNotes.map(n => ({id: n.id, text: `Sign note for ${n.patientName} (${n.date})`, link: '/progress-notes'})),
            'No notes pending signature.'
        )},
    ];

    return (
        <div>
            <PageHeader title="Action Center" subtitle="All items requiring your attention." />
            <Card className="p-0">
                <Tabs tabs={tabs} />
            </Card>
        </div>
    );
};

export default Inbox;
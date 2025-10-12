import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BellIcon, ChevronDownIcon, SearchIcon, LogoutIcon, ProfileIcon, CogIcon, MessageSquareIcon } from '../shared/Icons';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationPanel from './NotificationPanel';
import Modal from '../shared/Modal';
import { useApp } from '../../App';

const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { showToast } = useApp();
    const [feedbackType, setFeedbackType] = useState('General Feedback');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackMessage.trim()) {
            showToast('Please enter your feedback before submitting.', 'error');
            return;
        }
        // In a real app, you would send this data to a server.
        console.log('Feedback Submitted:', { type: feedbackType, message: feedbackMessage });
        showToast('Thank you for your feedback!', 'success');
        onClose();
        setFeedbackMessage('');
        setFeedbackType('General Feedback');
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Submit Feedback"
            footer={
                <>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Submit</button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">Feedback Type</label>
                    <select 
                        id="feedbackType"
                        value={feedbackType}
                        onChange={(e) => setFeedbackType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option>General Feedback</option>
                        <option>Bug Report</option>
                        <option>Feature Request</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="feedbackMessage" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea 
                        id="feedbackMessage"
                        rows={5}
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        placeholder="Please provide as much detail as possible..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                </div>
            </form>
        </Modal>
    );
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
    <header className="relative flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200 z-20">
      {/* Global Search Bar */}
      <div className="flex-1 flex justify-start">
        <div className="relative w-full max-w-xs lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="hidden md:block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search..."
          />
           <button className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-500">
                <SearchIcon className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Right side icons and user menu */}
      <div className="flex items-center space-x-4 sm:space-x-5 ml-4">
        {/* Feedback Button */}
         <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="hidden sm:flex items-center text-sm font-medium text-gray-600 hover:text-primary-600 focus:outline-none transition-colors"
            title="Submit Feedback"
        >
            <MessageSquareIcon className="w-5 h-5 mr-1.5" />
            Feedback
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="relative text-gray-500 hover:text-primary-600 focus:outline-none transition-colors"
          >
            <BellIcon className="w-6 h-6"/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationsOpen && <NotificationPanel onClose={() => setIsNotificationsOpen(false)} />}
        </div>


        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center focus:outline-none transition-transform transform">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full border-2 border-gray-300 group-hover:border-primary-500 transition-colors" />}
            <div className="ml-3 hidden md:flex items-baseline space-x-2">
              <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
              {user?.role && <span className="text-xs text-gray-500 capitalize">({user.role.toLowerCase()})</span>}
            </div>
            <ChevronDownIcon className="ml-1 hidden md:block w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block animate-fade-in origin-top-right z-10">
            <a href="#/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <ProfileIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>My Profile</span>
            </a>
            <a href="#/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <CogIcon className="w-5 h-5 mr-3 text-gray-400"/>
                <span>Settings</span>
            </a>
            <div className="border-t border-gray-100 my-1"></div>
            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                <LogoutIcon className="w-5 h-5 mr-3"/>
                <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
    </>
  );
};

export default Header;
import React from 'react';
import { 
    HomeIcon, 
    CalendarIcon, 
    DocumentTextIcon,
    PillIcon, 
    ChatBubbleLeftRightIcon,
    VideoCameraIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    CogIcon,
    SparklesIcon,
    UsersIcon,
    BriefcaseIcon,
    AcademicCapIcon,
    DocumentDuplicateIcon,
    ChartBarIcon,
    InboxIcon,
    ArrowRightOnRectangleIcon,
    CubeIcon,
    BuildingOfficeIcon,
    ShieldExclamationIcon,
    UserGroupIcon,
    PencilAltIcon,
    ClipboardDocumentListIcon,
    DumbbellIcon,
    IdentificationIcon,
} from './components/shared/Icons';

export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactElement;
}

export const PATIENT_NAV: NavItem[] = [
  { name: 'Dashboard', href: 'dashboard', icon: <HomeIcon /> },
  { name: 'Appointments', href: 'appointments', icon: <CalendarIcon /> },
  { name: 'EMR Overview', href: 'emr', icon: <DocumentTextIcon /> },
  { name: 'Medications', href: 'medications', icon: <PillIcon /> },
  { name: 'Health Goals', href: 'goals', icon: <DumbbellIcon /> },
  { name: 'My Tasks', href: 'tasks', icon: <ClipboardDocumentListIcon /> },
  { name: 'Visit History', href: 'history', icon: <DocumentDuplicateIcon /> },
  { name: 'Messaging', href: 'messaging', icon: <ChatBubbleLeftRightIcon /> },
  { name: 'Video Consults', href: 'video-consults', icon: <VideoCameraIcon /> },
  { name: 'Claims', href: 'claims', icon: <ShieldCheckIcon /> },
  { name: 'Payments', href: 'payments', icon: <CurrencyDollarIcon /> },
  { name: 'Insurance', href: 'insurance', icon: <IdentificationIcon /> },
  { name: 'Subscription', href: 'subscription', icon: <SparklesIcon /> },
  { name: 'AI Assistant', href: 'ai-assistant', icon: <SparklesIcon /> },
  { name: 'Profile', href: 'profile', icon: <UserCircleIcon /> },
  { name: 'Settings', href: 'settings', icon: <CogIcon /> },
];

export const PROVIDER_NAV: NavItem[] = [
  { name: 'Dashboard', href: 'dashboard', icon: <HomeIcon /> },
  { name: 'Calendar', href: 'calendar', icon: <CalendarIcon /> },
  { name: 'Appointments', href: 'appointments', icon: <CalendarIcon /> },
  { name: 'Waiting Room', href: 'waiting-room', icon: <UsersIcon /> },
  { name: 'Patients', href: 'patients', icon: <UserGroupIcon /> },
  { name: 'Progress Notes', href: 'progress-notes', icon: <PencilAltIcon /> },
  { name: 'E-Prescribing', href: 'e-prescribing', icon: <PillIcon /> },
  { name: 'Lab Orders', href: 'lab-orders', icon: <DocumentTextIcon /> },
  { name: 'Referrals', href: 'referrals', icon: <ArrowRightOnRectangleIcon /> },
  { name: 'Messaging', href: 'messaging', icon: <ChatBubbleLeftRightIcon /> },
  { name: 'Billing', href: 'billing', icon: <CurrencyDollarIcon /> },
  { name: 'Subscription', href: 'subscription', icon: <SparklesIcon /> },
  { name: 'Reports', href: 'reports', icon: <ChartBarIcon /> },
  { name: 'Inbox', href: 'inbox', icon: <InboxIcon /> },
  { name: 'Profile', href: 'profile', icon: <UserCircleIcon /> },
  { name: 'Settings', href: 'settings', icon: <CogIcon /> },
];

export const ADMIN_NAV: NavItem[] = [
  { name: 'Dashboard', href: 'dashboard', icon: <HomeIcon /> },
  { name: 'Users', href: 'users', icon: <UsersIcon /> },
  { name: 'Subscriptions', href: 'subscriptions', icon: <SparklesIcon /> },
  { name: 'Plan Management', href: 'plans', icon: <CubeIcon /> },
  { name: 'Billing', href: 'billing', icon: <CurrencyDollarIcon /> },
  { name: 'Reports', href: 'reports', icon: <ChartBarIcon /> },
  { name: 'Compliance', href: 'compliance', icon: <ShieldCheckIcon /> },
  { name: 'Enterprise', href: 'enterprise', icon: <BuildingOfficeIcon /> },
  { name: 'Settings', href: 'settings', icon: <CogIcon /> },
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const MEDICAL_SPECIALTIES = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 'Hematology', 'Infectious Disease', 'Neurology', 'Oncology', 'Pediatrics', 'Primary Care', 'Psychiatry', 'Pulmonology', 'Rheumatology', 'Urology'
];
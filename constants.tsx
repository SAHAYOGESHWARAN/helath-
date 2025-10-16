
import React from 'react';
import { 
    HomeIcon, CalendarIcon, DocumentTextIcon, UsersIcon, CogIcon, ShieldCheckIcon, ProfileIcon as ProfileNavIcon,
    CreditCardIcon, SparklesIcon, VideoCameraIcon, ClipboardListIcon, PillIcon, ShareIcon,
    CurrencyDollarIcon, ChartBarIcon, CollectionIcon, PencilAltIcon, MessageSquareIcon, ClockIcon
} from './components/shared/Icons';

// Using CollectionIcon and aliasing for semantic clarity
const SubscriptionIcon = CollectionIcon;
const EMR_Icon = DocumentTextIcon;

export const PATIENT_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <CalendarIcon /> },
  { name: 'My EMR', href: '/emr', icon: <EMR_Icon /> },
  { name: 'Medications', href: '/medications', icon: <PillIcon /> },
  { name: 'Visit History', href: '/history', icon: <ClockIcon /> },
  { name: 'Messaging', href: '/messaging', icon: <MessageSquareIcon /> },
  { name: 'Video Consults', href: '/video-consults', icon: <VideoCameraIcon /> },
  { name: 'Claims', href: '/claims', icon: <ClipboardListIcon /> },
  { name: 'Payments', href: '/payments', icon: <CreditCardIcon /> },
  { name: 'Subscription', href: '/subscription', icon: <SubscriptionIcon /> },
  { name: 'AI Health Guide', href: '/ai-assistant', icon: <SparklesIcon /> },
  { name: 'Profile', href: '/profile', icon: <ProfileNavIcon /> },
  { name: 'Settings', href: '/settings', icon: <CogIcon /> },
];

export const PROVIDER_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'My Calendar', href: '/calendar', icon: <CalendarIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <ClipboardListIcon /> },
  { name: 'Waiting Room', href: '/waiting-room', icon: <UsersIcon /> },
  { name: 'Patient Management', href: '/patients', icon: <UsersIcon /> },
  { name: 'Messaging', href: '/messaging', icon: <MessageSquareIcon /> },
  { name: 'Progress Notes', href: '/progress-notes', icon: <PencilAltIcon /> },
  { name: 'E-Prescribing', href: '/e-prescribing', icon: <PillIcon /> },
  { name: 'Referrals', href: '/referrals', icon: <ShareIcon /> },
  { name: 'Billing', href: '/billing', icon: <CurrencyDollarIcon /> },
  { name: 'Subscription', href: '/subscription', icon: <SubscriptionIcon /> },
  { name: 'Reports', href: '/reports', icon: <ChartBarIcon /> },
  { name: 'Profile', href: '/profile', icon: <ProfileNavIcon /> },
  { name: 'Settings', href: '/settings', icon: <CogIcon /> },
];

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'User Management', href: '/users', icon: <UsersIcon /> },
  { name: 'Subscriptions', href: '/subscriptions', icon: <CollectionIcon /> },
  { name: 'Product Management', href: '/products', icon: <PillIcon /> }, // Placeholder icon
  { name: 'Billing', href: '/billing', icon: <CurrencyDollarIcon /> },
  { name: 'Reports', href: '/reports', icon: <ChartBarIcon /> },
  { name: 'Compliance', href: '/compliance', icon: <ShieldCheckIcon /> },
  { name: 'Enterprise', href: '/enterprise', icon: <HomeIcon /> }, // Placeholder icon
  { name: 'System Settings', href: '/settings', icon: <CogIcon /> },
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const MEDICAL_SPECIALTIES = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology', 'General Practice',
  'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology', 'Radiology'
];
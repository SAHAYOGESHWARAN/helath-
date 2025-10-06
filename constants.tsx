import React from 'react';
import { 
    HomeIcon, CalendarIcon, DocumentTextIcon, UsersIcon, CogIcon, ShieldCheckIcon, ProfileIcon,
    CreditCardIcon, SparklesIcon, VideoCameraIcon, ClipboardListIcon, PillIcon, ShareIcon,
    CurrencyDollarIcon, ChartBarIcon, CubeIcon, CollectionIcon, BriefcaseIcon, CollectionIcon as SubscriptionIcon
} from './components/shared/Icons';

export const PATIENT_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Profile', href: '/profile', icon: <ProfileIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <CalendarIcon /> },
  { name: 'My Health', href: '/records', icon: <DocumentTextIcon /> },
  { name: 'Claims', href: '/claims', icon: <ClipboardListIcon /> },
  { name: 'Payments', href: '/payments', icon: <CreditCardIcon /> },
  { name: 'Insurance', href: '/insurance', icon: <ShieldCheckIcon /> },
  { name: 'My Subscription', href: '/subscription', icon: <SubscriptionIcon /> },
  { name: 'Video Consults', href: '/video-consults', icon: <VideoCameraIcon /> },
  { name: 'AI Assistant', href: '/ai-assistant', icon: <SparklesIcon /> },
  { name: 'Settings', href: '/settings', icon: <CogIcon /> },
];

export const PROVIDER_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Calendar', href: '/calendar', icon: <CalendarIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <ClipboardListIcon /> },
  { name: 'Patient Management', href: '/patients', icon: <UsersIcon /> },
  { name: 'Progress Notes', href: '/progress-notes', icon: <DocumentTextIcon /> },
  { name: 'E-Prescribing', href: '/e-prescribing', icon: <PillIcon /> },
  { name: 'Referrals', href: '/referrals', icon: <ShareIcon /> },
  { name: 'Billing', href: '/billing', icon: <CurrencyDollarIcon /> },
  { name: 'Reports', href: '/reports', icon: <ChartBarIcon /> },
  { name: 'Waiting Room', href: '/waiting-room', icon: <UsersIcon /> },
];

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'User Management', href: '/users', icon: <UsersIcon /> },
  { name: 'Subscription Mgmt', href: '/subscriptions', icon: <CollectionIcon /> },
  { name: 'Product Management', href: '/products', icon: <CubeIcon /> },
  { name: 'Analytics & Reports', href: '/reports', icon: <ChartBarIcon /> },
  { name: 'System Settings', href: '/settings', icon: <CogIcon /> },
  { name: 'Enterprise Settings', href: '/enterprise', icon: <BriefcaseIcon /> },
  { name: 'Compliance', href: '/compliance', icon: <ShieldCheckIcon /> },
];
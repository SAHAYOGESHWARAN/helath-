
import React from 'react';
import { 
    HomeIcon, CalendarIcon, DocumentTextIcon, UsersIcon, CogIcon, ShieldCheckIcon, ProfileIcon,
    CreditCardIcon, SparklesIcon, VideoCameraIcon, ClipboardListIcon, PillIcon, ShareIcon,
    CurrencyDollarIcon, ChartBarIcon, CubeIcon, CollectionIcon, BriefcaseIcon, PencilAltIcon
} from './components/shared/Icons';

// Using CollectionIcon and aliasing for semantic clarity
const SubscriptionIcon = CollectionIcon;

export const PATIENT_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <CalendarIcon /> },
  { name: 'Health Records', href: '/records', icon: <DocumentTextIcon /> },
  { name: 'Video Consults', href: '/video-consults', icon: <VideoCameraIcon /> },
  { name: 'Claims', href: '/claims', icon: <ClipboardListIcon /> },
  { name: 'Payments', href: '/payments', icon: <CreditCardIcon /> },
  { name: 'Insurance', href: '/insurance', icon: <ShieldCheckIcon /> },
  { name: 'Subscription', href: '/subscription', icon: <SubscriptionIcon /> },
  { name: 'AI Assistant', href: '/ai-assistant', icon: <SparklesIcon /> },
  { name: 'Profile', href: '/profile', icon: <ProfileIcon /> },
  { name: 'Settings', href: '/settings', icon: <CogIcon /> },
];

export const PROVIDER_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'My Calendar', href: '/calendar', icon: <CalendarIcon /> },
  { name: 'Appointments', href: '/appointments', icon: <ClipboardListIcon /> },
  { name: 'Waiting Room', href: '/waiting-room', icon: <UsersIcon /> },
  { name: 'Patient Management', href: '/patients', icon: <UsersIcon /> },
  { name: 'Progress Notes', href: '/progress-notes', icon: <PencilAltIcon /> },
  { name: 'E-Prescribing', href: '/e-prescribing', icon: <PillIcon /> },
  { name: 'Referrals', href: '/referrals', icon: <ShareIcon /> },
  { name: 'Billing', href: '/billing', icon: <CurrencyDollarIcon /> },
  { name: 'Subscription', href: '/subscription', icon: <SubscriptionIcon /> },
  { name: 'Reports', href: '/reports', icon: <ChartBarIcon /> },
];

export const ADMIN_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Users', href: '/users', icon: <UsersIcon /> },
  { name: 'Subscriptions', href: '/subscriptions', icon: <CollectionIcon /> },
  { name: 'Products', href: '/products', icon: <CubeIcon /> },
  { name: 'Reports', href: '/reports', icon: <ChartBarIcon /> },
  { name: 'Settings', href: '/settings', icon: <CogIcon /> },
  { name: 'Enterprise', href: '/enterprise', icon: <BriefcaseIcon /> },
  { name: 'Compliance', href: '/compliance', icon: <ShieldCheckIcon /> },
];

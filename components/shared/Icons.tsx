import React from 'react';

const IconBase: React.FC<{ children: React.ReactNode; className?: string; fill?: string; stroke?: string, strokeWidth?: number }> = ({ children, className, fill, stroke, strokeWidth }) => (
    <svg 
        className={className || "w-6 h-6"} 
        fill={fill || "none"} 
        stroke={stroke || "currentColor"} 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth={strokeWidth || 2}
    >
        {children}
    </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></IconBase>
);
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></IconBase>
);
export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></IconBase>
);
export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></IconBase>
);
export const ProfileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></IconBase>
);
export const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const NovoPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 1 3h3l-4 5z" /></IconBase>
);
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></IconBase>
);
export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></IconBase>
);
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" stroke="none"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></IconBase>
);
export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" stroke="none"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></IconBase>
);
export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></IconBase>
);
export const ShieldExclamationIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.611m3.08-5.397a11.955 11.955 0 012.611-3.08z" /></IconBase>
);
export const CurrencyDollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18a6 6 0 01-6-6h12a6 6 0 01-6 6z" /></IconBase>
);
export const CollectionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></IconBase>
);
export const PillIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L11 12l-2 2-2.293-2.293a1 1 0 010-1.414L11 6l2.293-2.293a1 1 0 011.414 0z" /></IconBase>
);
export const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></IconBase>
);
export const SparklesIcon: React.FC<{ className?: string; fill?: string; stroke?: string }> = ({ className, fill, stroke }) => (
    <IconBase className={className} fill={fill} stroke={stroke} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.565l-.229-1.144a3.375 3.375 0 00-2.455-2.455l-1.145-.229l1.145-.229a3.375 3.375 0 002.455-2.455l.229-1.144l.229 1.144a3.375 3.375 0 002.455 2.455l1.145.229l-1.145.229a3.375 3.375 0 00-2.455 2.455l-.229 1.144z" /></IconBase>
);
export const GlobeAltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></IconBase>
);
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const PencilAltIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></IconBase>
);
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></IconBase>
);
export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></IconBase>
);
export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></IconBase>
);
export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></IconBase>
);
export const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></IconBase>
);
export const SpeakerWaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.586 18.393a7.5 7.5 0 0 0 0-12.786M19.071 3.515a12 12 0 0 1 0 16.97M6.343 3.515a12 12 0 0 0 0 16.97m3.182-13.807a4.5 4.5 0 0 1 0 6.364M12 8.25a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 1 .75-.75Z" /></IconBase>
);
export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6ZM12 14.25a3 3 0 0 0 3-3V7.5a3 3 0 0 0-6 0v3.75a3 3 0 0 0 3 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-1.5 1.5h-1.5a1.5 1.5 0 0 1 0-3H5.25a1.5 1.5 0 0 1 1.5 1.5v2.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v3.75m0 0H11.25m.75 0h.75m-1.5 0v-3.75m1.5 0v3.75M15.75 18.75a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 0-3h-1.5a1.5 1.5 0 0 0-1.5 1.5v2.25" /></IconBase>
);
export const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" /></IconBase>
);
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></IconBase>
);
export const DeviceMobileIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></IconBase>
);
export const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className || "w-6 h-6 animate-spin"}><path d="M12 3v3m0 12v3m9-9h-3m-12 0H3m16.5-4.5L19.5 6M6 19.5l-1.5-1.5M19.5 18l-1.5-1.5M6 4.5L4.5 6" /></IconBase>
);
export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></IconBase>
);
export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></IconBase>
);
export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></IconBase>
);
export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></IconBase>
);
export const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></IconBase>
);
export const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></IconBase>
);
export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></IconBase>
);
export const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></IconBase>
);
export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a2.25 2.25 0 0 0-3.182 0l-3.72 3.72A2.25 2.25 0 0 1 3.75 14.886V10.6c0-.97.616-1.813 1.5-2.097m14.25-1.122a3 3 0 0 0-3-3H6.75a3 3 0 0 0-3 3v.622A2.25 2.25 0 0 1 5.25 6h13.5c.621 0 1.125.504 1.125 1.125v.622Z" /></IconBase>
);
export const UserGroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.518-2.72a3 3 0 0 0-4.682 2.72 8.986 8.986 0 0 0 3.741.479M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 4.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z" /></IconBase>
);
export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></IconBase>
);
export const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.016h-.008v-.016Z" /></IconBase>
);
export const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></IconBase>
);
export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></IconBase>
);
export const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></IconBase>
);
export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></IconBase>
);
export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></IconBase>
);
export const NovoPathLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 1 3h3l-4 5z" /></IconBase>
);
export const DocumentDuplicateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></IconBase>
);
export const ArrowRightOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></IconBase>
);
export const InboxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></IconBase>
);
export const CubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></IconBase>
);
export const BuildingOfficeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></IconBase>
);
export const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></IconBase>
);
export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></IconBase>
);
export const DumbbellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12H2M22 12h-2M7 12H5M19 12h-2M10 12h4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9v6M18 9v6" />
    </IconBase>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.638 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></IconBase>
);

export const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></IconBase>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <IconBase className={className} strokeWidth={1.5} fill="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 8.638 5.214 8.252 8.252 0 0 1 12 2.25c1.131 0 2.228.232 3.223.655.328.127.65.281.939.459Z" />
  </IconBase>
);

export const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></IconBase>
);

export const EllipsisVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" strokeWidth={0}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></IconBase>
);

export const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconBase>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25-2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" /></IconBase>
);

export const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a10.5 10.5 0 0 0-9.348-9.348c-5.25 0-9.563 3.86-10.395 8.856 2.4-1.843 5.568-3.006 9.043-3.006 2.052 0 3.963.621 5.534 1.688zM19.5 10.5c0 5.25-3.86 9.563-8.856 10.395-1.843-2.4-3.006-5.568-3.006-9.043 0-2.052.621-3.963 1.688-5.534 2.186 1.82 5.022 2.928 8.172 2.928z" /></IconBase>
);

export const BeakerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3m-13.5 0v3.75a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3V14.25" /></IconBase>
);

export const QuoteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} fill="currentColor" strokeWidth={0}>
        <path d="M9.48 3.461c-1.84 2.132-2.96 4.382-2.96 7.47v.53h4.44v-4.441h-4.44v-.53c0-1.281.52-2.731 1.48-3.929L9.48 3.461zm10.66 0c-1.84 2.132-2.96 4.382-2.96 7.47v.53h4.44v-4.441h-4.44v-.53c0-1.281.52-2.731 1.48-3.929L20.14 3.461z" />
    </IconBase>
);

export const HandThumbUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M6.633 9.25l-1.14-3.138a3.375 3.375 0 0 1 .14-3.218.75.75 0 0 1 1.08.288l1.376 2.853m-3.833.026C2.25 6.212 1.5 6.96 1.5 7.908v9.576a1.5 1.5 0 0 0 1.5 1.5h2.467c.36 0 .708-.121.99-.333l1.376-1.113" /></IconBase>
);

export const UserMinusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0-5.454-2.101M15 19.128c2.11 0 3.829-.652 5.035-1.921A9.825 9.825 0 0 0 19.5 12c0-2.036-.593-3.92-1.625-5.521M15 19.128v-3.811M15 19.128c-2.993 0-5.617-1.171-7.545-3.097m-1.455 3.097A9.825 9.825 0 0 1 6.5 12c0-2.036.593-3.92 1.625-5.521m11.35 11.042c.44-.222.846-.475 1.226-.764M6 16.128a9.38 9.38 0 0 1-5.454-2.101M6.023 19.128c2.11 0 3.829-.652 5.035-1.921m-5.035 1.921c-.44-.222-.846-.475-1.226-.764m1.226.764c-2.993 0-5.617-1.171-7.545-3.097M3.75 9.75h6" /></IconBase>
);

export const FaxIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4 0h4" /></IconBase>
);

export const ArrowTrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" /></IconBase>
);

export const UserPlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></IconBase>
);

export const BanknotesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6V5.25m0 0a3.75 3.75 0 0 1 7.5 0M3.75 4.5A3.75 3.75 0 0 1 7.5 3v1.5m6.375 0a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm-11.25-1.5a.75.75 0 0 1 .75-.75h.008v.016h-.008a.75.75 0 0 1-.75-.75V3m12 .75a.75.75 0 0 0 .75-.75h.008v.016h-.008a.75.75 0 0 0-.75-.75V3m0 3.75a.75.75 0 0 1-.75.75h-.008v-.016h.008a.75.75 0 0 1 .75.75v.008c0 .414.336.75.75.75h.008v.016h-.008c-.414 0-.75.336-.75.75v.008" /></IconBase>
);

export const ClipboardDocumentListIcon: React.FC<{ className?: string }> = ({ className }) => (
    <IconBase className={className} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.082A48.424 48.424 0 0 0 12 3.811a48.424 48.424 0 0 0-4.896.082C5.97 3.992 5 4.954 5 6.091v11.585c0 1.135.845 2.098 1.976 2.192a48.427 48.427 0 0 0 1.123.082h3.298" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 21L12 17.5 7.5 21" /></IconBase>
);

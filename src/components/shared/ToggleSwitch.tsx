import React from 'react';

interface ToggleSwitchProps {
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ name, checked, onChange, disabled = false }) => (
    <label className={`relative inline-flex items-center flex-shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        <input 
            type="checkbox" 
            name={name} 
            checked={checked} 
            onChange={onChange} 
            className="sr-only peer" 
            disabled={disabled}
        />
        <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 ${disabled ? 'opacity-50' : ''}`}></div>
    </label>
);

export default ToggleSwitch;
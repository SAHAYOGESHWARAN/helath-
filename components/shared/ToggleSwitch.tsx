import React from 'react';

interface ToggleSwitchProps {
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ name, checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input 
            type="checkbox" 
            name={name} 
            checked={checked} 
            onChange={onChange} 
            className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
);

export default ToggleSwitch;
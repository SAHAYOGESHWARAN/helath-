import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';

interface CalorieEntry {
  food: string;
  calories: number;
}

const CalorieTrackerPage: React.FC = () => {
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState(0);

  const addEntry = () => {
    if (food && calories > 0) {
      setEntries([...entries, { food, calories }]);
      setFood('');
      setCalories(0);
    }
  };

  const totalCalories = entries.reduce((total, entry) => total + entry.calories, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calorie Tracker</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          placeholder="Food"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
          placeholder="Calories"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={addEntry}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Entry
        </button>
      </div>
      <Card className="mt-4">
        <h2 className="text-xl font-bold">Total Calories: {totalCalories}</h2>
        <ul>
          {entries.map((entry, index) => (
            <li key={index} className="flex justify-between">
              <span>{entry.food}</span>
              <span>{entry.calories}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default CalorieTrackerPage;

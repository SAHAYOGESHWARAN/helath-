import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';

const BMICalculatorPage: React.FC = () => {
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    if (height > 0 && weight > 0) {
      const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
      setBmi(Number(bmi));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BMI Calculator</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          placeholder="Height (cm)"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder="Weight (kg)"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={calculateBmi}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Calculate BMI
        </button>
      </div>
      {bmi !== null && (
        <Card className="mt-4">
          <p>Your BMI is: {bmi}</p>
        </Card>
      )}
    </div>
  );
};

export default BMICalculatorPage;

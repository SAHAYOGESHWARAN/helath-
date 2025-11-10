import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';

interface Workout {
  exercise: string;
  sets: number;
  reps: number;
}

const WorkoutPlannerPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);

  const addWorkout = () => {
    if (exercise && sets > 0 && reps > 0) {
      setWorkouts([...workouts, { exercise, sets, reps }]);
      setExercise('');
      setSets(0);
      setReps(0);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workout Planner</h1>
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          placeholder="Exercise"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={sets}
          onChange={(e) => setSets(Number(e.target.value))}
          placeholder="Sets"
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(Number(e.target.value))}
          placeholder="Reps"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={addWorkout}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Workout
        </button>
      </div>
      <Card className="mt-4">
        <h2 className="text-xl font-bold">Today's Workout</h2>
        <ul>
          {workouts.map((workout, index) => (
            <li key={index} className="flex justify-between">
              <span>{workout.exercise}</span>
              <span>{workout.sets} sets of {workout.reps} reps</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default WorkoutPlannerPage;

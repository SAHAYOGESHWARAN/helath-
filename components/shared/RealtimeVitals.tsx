import React, { useState, useEffect } from 'react';
import { VitalsRecord } from '../../types';
import Card from './Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RealtimeVitalsProps {
  patientId: string;
}

const RealtimeVitals: React.FC<RealtimeVitalsProps> = ({ patientId }) => {
  const [vitals, setVitals] = useState<VitalsRecord[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/vitals/${patientId}`);

    ws.onopen = () => setIsConnected(true);
    ws.onmessage = (event) => {
      try {
        const newVitals: VitalsRecord = typeof event.data === 'string' ? JSON.parse(event.data) : JSON.parse(String(event.data));
        setVitals((prevVitals) => [...prevVitals, newVitals]);
      } catch (err) {
        // ignore parse errors
      }
    };
    ws.onclose = () => setIsConnected(false);

    return () => {
      try { ws.close(); } catch { /* ignore */ }
    };
  }, [patientId]);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Real-time Vitals</h2>
      <p className="text-sm text-gray-500">
        {isConnected ? 'Connected' : 'Disconnected'}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vitals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="heartRate" stroke="#8884d8" />
          <Line type="monotone" dataKey="bloodPressure" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RealtimeVitals;
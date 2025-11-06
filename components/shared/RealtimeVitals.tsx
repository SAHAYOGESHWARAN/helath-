import React, { useState, useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
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
    const client = new W3CWebSocket(`ws://localhost:8080/vitals/${patientId}`);

    client.onopen = () => {
      setIsConnected(true);
    };

    client.onmessage = (message) => {
      const newVitals: VitalsRecord = JSON.parse(message.data.toString());
      setVitals((prevVitals) => [...prevVitals, newVitals]);
    };

    client.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      client.close();
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
import React, { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
import { EmergencyRequest } from '../types';

const VolunteerDashboard: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('volunteerToken')}`
        }
      });
      const data = await response.json();
      setEmergencies(data);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptEmergency = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency/${id}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('volunteerToken')}`
        }
      });
      
      if (response.ok) {
        fetchEmergencies();
      }
    } catch (error) {
      console.error('Error accepting emergency:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Emergency Requests</h2>
      
      <div className="grid gap-6">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={20} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(emergency.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-lg font-medium">
                  Emergency Request #{emergency.id.slice(-6)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                emergency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                emergency.status === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Location Details:</h4>
              <p className="text-gray-600">
                Latitude: {emergency.location.latitude}<br />
                Longitude: {emergency.location.longitude}
              </p>
            </div>

            {emergency.status === 'pending' && (
              <button
                onClick={() => acceptEmergency(emergency.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
              >
                <Check size={20} />
                Accept Task
              </button>
            )}

            {emergency.status === 'accepted' && emergency.volunteerId && (
              <div className="flex items-center gap-2 text-green-600">
                <Check size={20} />
                <span>You are assigned to this emergency</span>
              </div>
            )}
          </div>
        ))}

        {emergencies.length === 0 && (
          <div className="text-center text-gray-600 py-8">
            No emergency requests at the moment
          </div>
        )}
      </div>
    </div>
  );
};
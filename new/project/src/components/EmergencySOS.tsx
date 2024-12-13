import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const EmergencySOS: React.FC = () => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEmergency = async () => {
    if (navigator.geolocation) {
      setIsRequesting(true);
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const emergency = {
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          timestamp: new Date().toISOString(),
          userId: 'user123' // In a real app, this would come from auth
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emergency)
        });

        if (response.ok) {
          alert('Emergency services have been notified. Help is on the way!');
        } else {
          throw new Error('Failed to create emergency request');
        }
      } catch (error) {
        console.error('Error creating emergency request:', error);
        alert('Failed to send emergency request. Please try again or call emergency services directly.');
      } finally {
        setIsRequesting(false);
      }
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={handleEmergency}
        disabled={isRequesting}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full flex items-center gap-2 shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50"
      >
        <AlertCircle size={24} />
        {isRequesting ? 'Requesting Help...' : 'SOS Emergency'}
      </button>
    </div>
  );
};
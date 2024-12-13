import React, { useState, useEffect } from 'react';
import { Slider, MapPin, Clock, Phone } from 'lucide-react';
import { Hospital } from '../types';
import { calculateDistance } from '../utils/distance';

const HospitalSearch: React.FC = () => {
  const [radius, setRadius] = useState(5);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchNearbyHospitals();
    }
  }, [userLocation, radius]);

  const fetchNearbyHospitals = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hospitals/nearby?latitude=${userLocation?.lat}&longitude=${userLocation?.lng}&radius=${radius}`);
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Find Nearby Hospitals</h2>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={updateLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <MapPin size={20} />
            Update Location
          </button>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">
              Search Radius: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{hospital.name}</h3>
                <p className="text-gray-600 mb-4">{hospital.address}</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {hospital.distance?.toFixed(1)} km away
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-gray-500" />
                <span>
                  {hospital.operatingHours.open} - {hospital.operatingHours.close}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Specialties:</h4>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.latitude},${hospital.coordinates.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"
              >
                <MapPin size={20} />
                Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
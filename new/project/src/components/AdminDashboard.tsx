import React, { useState, useEffect } from 'react';
import { UserPlus, Users, AlertCircle, Activity } from 'lucide-react';
import { Volunteer, EmergencyRequest } from '../types';

const AdminDashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [volunteersRes, emergenciesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/volunteers`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/emergency`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
      ]);

      const [volunteersData, emergenciesData] = await Promise.all([
        volunteersRes.json(),
        emergenciesRes.json()
      ]);

      setVolunteers(volunteersData);
      setEmergencies(emergenciesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddVolunteer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password'),
          phone: formData.get('phone')
        })
      });

      if (response.ok) {
        setShowAddVolunteer(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error adding volunteer:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowAddVolunteer(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <UserPlus size={20} />
          Add Volunteer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Volunteers Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users size={24} />
            Volunteers
          </h2>
          <div className="bg-white rounded-lg shadow-md">
            {volunteers.map((volunteer) => (
              <div key={volunteer.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{volunteer.name}</h3>
                    <p className="text-sm text-gray-600">{volunteer.email}</p>
                    <p className="text-sm text-gray-600">{volunteer.phone}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    volunteer.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Cases Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle size={24} />
            Active Emergency Cases
          </h2>
          <div className="bg-white rounded-lg shadow-md">
            {emergencies.map((emergency) => (
              <div key={emergency.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(emergency.timestamp).toLocaleString()}
                    </p>
                    <p className="font-medium">Case #{emergency.id.slice(-6)}</p>
                    {emergency.volunteerId && (
                      <p className="text-sm text-gray-600">
                        Assigned to: {volunteers.find(v => v.id === emergency.volunteerId)?.name}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    emergency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    emergency.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {emergency.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      {showAddVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Volunteer</h2>
            <form onSubmit={handleAddVolunteer}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddVolunteer(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
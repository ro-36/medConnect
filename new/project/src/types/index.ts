export interface Hospital {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  specialties: string[];
  operatingHours: {
    open: string;
    close: string;
  };
  emergencyServices: string[];
  distance?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy';
  assignedCases: string[];
}

export interface EmergencyRequest {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'accepted' | 'completed';
  userId: string;
  volunteerId?: string;
  description?: string;
}
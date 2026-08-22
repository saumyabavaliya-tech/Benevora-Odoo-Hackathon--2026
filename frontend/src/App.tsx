import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';

// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Explore } from './pages/Explore';
import { MyTrips } from './pages/MyTrips';
import { CreateTrip } from './pages/CreateTrip';
import { TripDetails } from './pages/TripDetails';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { Budget } from './pages/Budget';
import { JourneyMap } from './pages/JourneyMap';
import { TravelSaarthi } from './pages/TravelSaarthi';
import { Memories } from './pages/Memories';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { SharedTrip } from './pages/SharedTrip';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard & Explorations */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />

            {/* Trips */}
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="/trips/:tripId" element={<TripDetails />} />
            <Route path="/trips/:tripId/itinerary" element={<ItineraryBuilder />} />
            <Route path="/trips/:tripId/budget" element={<Budget />} />
            <Route path="/trips/:tripId/map" element={<JourneyMap />} />

            {/* AI Assistant, Memories, User */}
            <Route path="/travel-saarthi" element={<TravelSaarthi />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* Public Shared Route */}
            <Route path="/shared/:shareId" element={<SharedTrip />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

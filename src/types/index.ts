export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  homeCity?: string;
  passportCountry?: string;
  preferences: TravelPreference;
  joinedDate: string;
  tripsCount: number;
  countriesVisited: number;
}

export type TravelStyle =
  | 'Adventure'
  | 'Relaxation'
  | 'Relaxed'
  | 'Luxury'
  | 'Budget'
  | 'Romantic'
  | 'Family'
  | 'Solo'
  | 'Cultural'
  | 'Culture'
  | 'Food'
  | 'Nature'
  | 'Spiritual'
  | 'Backpacking'
  | 'Photography';

export type CostLevel = 'Budget' | 'Moderate' | 'Expensive' | 'Luxury';
export type ItineraryType = 'travel' | 'activity' | 'meal' | 'accommodation' | 'leisure';

export type MoodType =
  | 'Relaxed'
  | 'Adventurous'
  | 'Romantic'
  | 'Backpacking'
  | 'Family'
  | 'Photography'
  | 'Foodie'
  | 'Peaceful'
  | 'Party'
  | 'Luxury';

export interface TravelPreference {
  travelStyles: TravelStyle[];
  favoriteDestinations: string[];
  favoriteActivities: string[];
  budgetPreference: 'Budget' | 'Moderate' | 'Luxury' | 'Flexible';
  currency: string;
  language: string;
  dietaryPreference?: string;
  pace: 'Slow & Immersive' | 'Balanced' | 'Fast & Packed';
}

export interface Activity {
  id: string;
  name: string;
  title?: string;
  description: string;
  cityId: string;
  cityName: string;
  durationHours: number;
  duration?: number | string;
  estimatedCost: number;
  cost?: number;
  currency: string;
  category: 'Sightseeing' | 'Adventure' | 'Food' | 'Culture' | 'Nature' | 'Shopping' | 'Nightlife' | 'Relaxation' | 'Photography';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  locationName: string;
  lat: number;
  lng: number;
  bestTimeToVisit?: string;
  tags: string[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  description: string;
  costIndex: 'Budget' | 'Moderate' | 'Expensive' | 'Luxury';
  popularityScore: number; // 1-100
  climate: 'Tropical' | 'Temperate' | 'Arid' | 'Continental' | 'Mediterranean' | 'Monsoon' | 'Alpine' | 'Subtropical';
  bestTimeToVisit: string;
  imageUrl: string;
  galleryImages: string[];
  lat: number;
  lng: number;
  averageDailyCost: number;
  currency: string;
  highlights: string[];
  activitiesCount: number;
}

export interface ItineraryItem {
  id: string;
  dayNumber: number;
  date: string;
  time: string;
  endTime?: string;
  title: string;
  type: 'travel' | 'activity' | 'meal' | 'accommodation' | 'leisure';
  cityName: string;
  locationName: string;
  lat?: number;
  lng?: number;
  notes?: string;
  estimatedCost: number;
  currency: string;
  completed?: boolean;
  activityId?: string;
  imageUrl?: string;
}

export interface TripStop {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  daysCount: number;
  order: number;
  lat: number;
  lng: number;
  coverImage?: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'Transportation'
  | 'Accommodation'
  | 'Food'
  | 'Activities'
  | 'Shopping'
  | 'Other';

export interface Expense {
  id: string;
  tripId: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  cityName?: string;
  paidBy?: string;
  notes?: string;
}

export interface Memory {
  id: string;
  tripId: string;
  tripName: string;
  cityName: string;
  country: string;
  date: string;
  caption: string;
  imageUrl: string;
  tags: string[];
  likesCount: number;
  lat?: number;
  lng?: number;
}

export type TripStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Draft';

export interface Trip {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  destinations: string[]; // City names
  stops: TripStop[];
  travelStyles: TravelStyle[];
  totalBudget: number;
  currency: string;
  status: TripStatus;
  accommodationPreference: string;
  transportPreference: string;
  isPublic?: boolean;
  shareId?: string;
  itinerary: ItineraryItem[];
  expenses: Expense[];
  memories: Memory[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saarthi';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  recommendations?: {
    cities?: City[];
    activities?: Activity[];
    tripPlanSummary?: {
      title: string;
      route: string[];
      duration: string;
      estimatedBudget: string;
      highlights: string[];
    };
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  mood?: MoodType;
}

export interface SharedTrip {
  shareId: string;
  trip: Trip;
  author: {
    name: string;
    avatar: string;
  };
  viewsCount: number;
  likesCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'trip' | 'ai' | 'memory' | 'system';
}

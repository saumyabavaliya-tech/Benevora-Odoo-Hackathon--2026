import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  Wallet,
  Plane,
  Plus,
  Trash2,
  Compass,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useTrips } from '../context/TripContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { mockCities } from '../data/mockData';
import { City, TravelStyle } from '../types';
import { formatCurrency } from '../lib/utils';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../components/ui/SafeImage';

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Info
  const [name, setName] = useState('Gujarat to Goa Coastal Expedition');
  const [description, setDescription] = useState('Scenic road & rail journey exploring heritage stepwells, Mumbai food trails, and sun-soaked Goan shores.');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-16');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80');

  // Step 2: Travel Styles
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([
    'Adventure',
    'Food',
    'Photography',
    'Relaxed',
  ]);

  // Step 3: Budget & Transit
  const [totalBudget, setTotalBudget] = useState<number>(30000);
  const [currency, setCurrency] = useState<string>('₹');
  const [primaryTransit, setPrimaryTransit] = useState<string>('Mixed Train & Flight');

  // Step 4: Multi-city stops
  const [selectedStops, setSelectedStops] = useState<{ city: City; days: number }[]>([
    { city: mockCities[0], days: 2 }, // Ahmedabad
    { city: mockCities[1], days: 2 }, // Mumbai
    { city: mockCities[2], days: 2 }, // Goa
  ]);
  const [citySearch, setCitySearch] = useState('');

  // Step 5: AI Assistance toggle
  const [useAIAssistance, setUseAIAssistance] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const availableStyles: TravelStyle[] = [
    'Adventure',
    'Relaxed',
    'Food',
    'Culture',
    'Photography',
    'Backpacking',
    'Luxury',
    'Romantic',
    'Family',
  ];

  const handleToggleStyle = (style: TravelStyle) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleAddCityStop = (city: City) => {
    if (!selectedStops.some((s) => s.city.id === city.id)) {
      setSelectedStops([...selectedStops, { city, days: 2 }]);
    }
  };

  const handleRemoveCityStop = (cityId: string) => {
    setSelectedStops(selectedStops.filter((s) => s.city.id !== cityId));
  };

  const handleDaysChange = (cityId: string, days: number) => {
    setSelectedStops(
      selectedStops.map((s) => (s.city.id === cityId ? { ...s, days: Math.max(1, days) } : s))
    );
  };

  const totalDays = selectedStops.reduce((sum, s) => sum + s.days, 0) || 6;

  const handleComplete = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((r) => setTimeout(r, 600));

    const newTrip = await createTrip({
      name,
      description,
      startDate,
      endDate,
      totalDays,
      destinations: selectedStops.map((s) => s.city.name),
      totalBudget,
      currency,
      coverImage,
      travelStyles: selectedStyles,
      stops: selectedStops.map((s, idx) => ({
        id: `stop-${Date.now()}-${idx}`,
        cityId: s.city.id,
        cityName: s.city.name,
        country: s.city.country,
        arrivalDate: startDate,
        departureDate: endDate,
        daysCount: s.days,
        order: idx + 1,
        lat: s.city.lat,
        lng: s.city.lng,
        coverImage: s.city.imageUrl,
      })),
      itinerary: [
        {
          id: `it-${Date.now()}-1`,
          dayNumber: 1,
          date: startDate,
          time: '09:00 AM',
          title: `Arrival in ${selectedStops[0]?.city.name || 'First Stop'}`,
          type: 'travel',
          locationName: 'Central Station / Airport',
          cityName: selectedStops[0]?.city.name || 'Ahmedabad',
          estimatedCost: 1500,
          currency,
          completed: false,
          notes: 'Check-in and refresh for afternoon explorations.',
        },
        {
          id: `it-${Date.now()}-2`,
          dayNumber: 1,
          date: startDate,
          time: '03:30 PM',
          title: `Heritage Walk & Local Exploration`,
          type: 'activity',
          locationName: 'Historic District',
          cityName: selectedStops[0]?.city.name || 'Ahmedabad',
          estimatedCost: 800,
          currency,
          completed: false,
          notes: 'Recommended by Travel Saarthi AI.',
        },
      ],
      expenses: [
        {
          id: `exp-${Date.now()}-1`,
          tripId: '',
          title: 'Initial Transit Booking',
          amount: Math.round(totalBudget * 0.25),
          currency,
          category: 'Transportation',
          date: startDate,
          cityName: selectedStops[0]?.city.name || 'Ahmedabad',
        },
      ],
    });

    setIsGenerating(false);
    navigate(`/trips/${newTrip.id}/itinerary`);
  };

  return (
    <DashboardLayout hideSidebar>
      <PageContainer className="max-w-4xl py-6 space-y-8">
        {/* Wizard Stepper */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Trip Creation Wizard
            </span>
            <span className="text-xs font-bold text-slate-500">Step {currentStep} of 5</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step <= currentStep
                    ? 'bg-blue-600'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Name & Dates for Your Journey</h2>
              <p className="text-xs text-slate-500 mt-1">
                Give your trip a memorable name and choose approximate dates.
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Trip Title"
                placeholder="e.g. Gujarat to Goa Coastal Expedition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Trip Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's the theme or purpose of this getaway?"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Cover Image URL
                </label>
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {[
                    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
                  ].map((imgUrl, i) => (
                    <SafeImage
                      key={i}
                      src={imgUrl}
                      alt="Preset"
                      onClick={() => setCoverImage(imgUrl)}
                      className={`w-20 h-14 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        coverImage === imgUrl ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Travel Styles */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">What's Your Travel Vibe?</h2>
              <p className="text-xs text-slate-500 mt-1">
                Select styles so Travel Saarthi can tailor activity suggestions.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableStyles.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleToggleStyle(style)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-900">{style}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 3: Budget & Transit */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Budget & Transit Preferences</h2>
              <p className="text-xs text-slate-500 mt-1">
                Keep spending aligned with dynamic chart trackers and alerts.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Input
                    label="Total Planned Budget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Preferred Transport Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Flight', 'Train', 'Road / Drive', 'Mixed'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPrimaryTransit(mode)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        primaryTransit === mode
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Multi-City Stops Selection */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Add Destinations & Duration</h2>
              <p className="text-xs text-slate-500 mt-1">
                Order your route sequence (e.g., Ahmedabad ➔ Mumbai ➔ Goa).
              </p>
            </div>

            {/* Selected Stops list */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Route Order ({selectedStops.length} Stops • {totalDays} Total Days)
              </span>

              {selectedStops.map((stop, idx) => (
                <div
                  key={stop.city.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <SafeImage
                      src={stop.city.imageUrl}
                      alt={stop.city.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      fallbackSrc={DEFAULT_FALLBACK_IMAGE}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{stop.city.name}</h4>
                      <p className="text-[11px] text-slate-400">{stop.city.region}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-500">Days:</span>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={stop.days}
                        onChange={(e) => handleDaysChange(stop.city.id, Number(e.target.value))}
                        className="w-12 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold text-slate-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveCityStop(stop.city.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove city"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Search & Add City catalog */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Add More Cities to Route
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mockCities.map((city) => {
                  const isAdded = selectedStops.some((s) => s.city.id === city.id);
                  return (
                    <button
                      key={city.id}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddCityStop(city)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                        isAdded
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50 hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <span className="truncate">{city.name}</span>
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: AI Assistance with Travel Saarthi */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Review & AI Generation</h2>
              <p className="text-xs text-slate-500 mt-1">
                Travel Saarthi will generate a day-by-day smart itinerary draft.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Travel Saarthi Co-Pilot Ready</span>
              </div>
              <p className="text-xs text-indigo-900 leading-relaxed">
                We've configured your <strong>{totalDays}-day</strong> route across{' '}
                <strong>{selectedStops.map((s) => s.city.name).join(' ➔ ')}</strong> with a{' '}
                <strong>{formatCurrency(totalBudget, currency)}</strong> budget focused on{' '}
                {selectedStyles.join(', ')}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase block">Route</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {selectedStops.map((s) => s.city.name).join(' ➔ ')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold uppercase block">Budget</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {formatCurrency(totalBudget, currency)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="flex items-center justify-between pt-4">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleComplete}
              isLoading={isGenerating}
              className="bg-blue-600 hover:bg-blue-500 font-bold px-6 shadow-lg shadow-blue-600/30"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Generate Itinerary & Open Builder
            </Button>
          )}
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

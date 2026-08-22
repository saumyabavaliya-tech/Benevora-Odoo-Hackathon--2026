import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadCloud, Image, X, Check, MapPin, Sparkles } from 'lucide-react';
import { Trip, Memory } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SafeImage, DEFAULT_FALLBACK_IMAGE } from '../ui/SafeImage';

const memorySchema = z.object({
  caption: z.string().min(3, 'Caption must be at least 3 characters'),
  tripId: z.string().min(1, 'Please select a trip'),
  cityName: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  date: z.string().min(1, 'Date is required'),
  tags: z.string().optional(),
});

type MemoryFormData = z.infer<typeof memorySchema>;

interface MemoryUploadProps {
  isOpen: boolean;
  onClose: () => void;
  trips: Trip[];
  onUpload: (memory: Omit<Memory, 'id' | 'likesCount'>) => void;
}

export const MemoryUpload: React.FC<MemoryUploadProps> = ({
  isOpen,
  onClose,
  trips,
  onUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MemoryFormData>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      tripId: trips[0]?.id || '',
      cityName: 'Goa',
      country: 'India',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: MemoryFormData) => {
    if (!selectedImage) return;
    setIsUploading(true);

    // Simulate upload progress
    for (let p = 10; p <= 100; p += 30) {
      setUploadProgress(p);
      await new Promise((r) => setTimeout(r, 100));
    }

    const matchedTrip = trips.find((t) => t.id === data.tripId);

    onUpload({
      tripId: data.tripId,
      tripName: matchedTrip?.name || 'My Travel Journey',
      cityName: data.cityName,
      country: data.country,
      date: data.date,
      caption: data.caption,
      imageUrl: selectedImage,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : ['TravelMoments'],
    });

    setIsUploading(false);
    setSelectedImage(null);
    setUploadProgress(0);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Travel Memory"
      description="Pin unforgettable moments and photography to your journey timeline."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload Box */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-48 ${
            selectedImage
              ? 'border-blue-500 bg-slate-900 overflow-hidden'
              : 'border-white/20 hover:border-blue-400 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {selectedImage ? (
            <div className="relative w-full h-48">
              <SafeImage
                src={selectedImage}
                alt="Upload preview"
                className="w-full h-full object-cover rounded-xl"
                fallbackSrc={DEFAULT_FALLBACK_IMAGE}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">
                Click or drag & drop travel photograph
              </p>
              <p className="text-xs text-slate-300">PNG, JPG, WebP up to 10MB</p>
            </div>
          )}
        </div>

        {/* Upload Progress Simulation */}
        {isUploading && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Uploading image...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Input
          label="Memory Caption"
          placeholder="e.g. Sunset golden hour over Mandovi bay with ocean breeze"
          error={errors.caption?.message}
          {...register('caption')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-200 block mb-1.5">
              Associated Trip
            </label>
            <select
              className="w-full rounded-xl border border-white/15 bg-slate-900/80 text-white px-3.5 py-2.5 text-sm focus:border-blue-400 focus:outline-none"
              {...register('tripId')}
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            placeholder="e.g. Goa, Udaipur"
            error={errors.cityName?.message}
            {...register('cityName')}
          />
          <Input
            label="Country"
            placeholder="e.g. India"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>

        <Input
          label="Tags (Comma-separated)"
          placeholder="Sunset, Beach, Photography, Architecture"
          {...register('tags')}
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedImage || isUploading}
            isLoading={isUploading}
          >
            Save Memory
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const MemoryStory: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  initialIndex?: number;
}> = ({ isOpen, onClose, memories, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || memories.length === 0) return null;

  const current = memories[currentIndex] || memories[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 sm:p-8">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md z-20"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Slide Navigation Buttons */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md z-20"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md z-20"
      >
        ›
      </button>

      {/* Cinematic Slide Frame */}
      <div className="max-w-4xl w-full flex flex-col items-center text-center text-white space-y-6">
        <div className="relative w-full max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center">
          <SafeImage
            src={current.imageUrl}
            alt={current.caption}
            className="w-full h-full max-h-[70vh] object-contain rounded-3xl"
            fallbackSrc={DEFAULT_FALLBACK_IMAGE}
          />
        </div>

        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            {current.cityName}, {current.country} • {current.date}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            "{current.caption}"
          </h2>
          <p className="text-xs text-slate-400">
            Story {currentIndex + 1} of {memories.length} • {current.tripName}
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User, Mail, MapPin, Compass, Calendar, Edit2, Shield, Heart, Award } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { SafeImage } from '../components/ui/SafeImage';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { trips } = useTrips();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Het Beladiya');
  const [bio, setBio] = useState(user?.bio || 'Full-stack explorer and adventure enthusiast.');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'Ahmedabad, India');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, bio, homeCity });
    setIsEditOpen(false);
  };

  const totalSpent = trips.reduce(
    (sum, t) => sum + t.expenses.reduce((eSum, e) => eSum + e.amount, 0),
    0
  );

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <SafeImage
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-50"
                fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    Pro Explorer
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{user?.homeCity || 'Ahmedabad, India'}</span>
                </div>
                <p className="text-xs text-slate-600 pt-1 max-w-md">{user?.bio}</p>
              </div>
            </div>

            <Button
              onClick={() => setIsEditOpen(true)}
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit Profile
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-100 text-center">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Trips Created</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{trips.length}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Cities Visited</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">8</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Travel Badges</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">6</p>
            </div>
          </div>
        </div>

        {/* Travel Style Preferences & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Travel Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {['Adventure', 'Photography', 'Food Trail', 'Coastal Haven', 'Solo & Group'].map(
                (p) => (
                  <span
                    key={p}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"
                  >
                    ✓ {p}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Explorer Achievements</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-amber-950">Multi-City Master</span>
              </div>
              <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-xl flex items-center gap-2.5">
                <Award className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-indigo-950">Saarthi Pioneer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Profile"
          description="Update your personal details and location preferences."
        >
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Home City"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              required
            />
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </PageContainer>
    </DashboardLayout>
  );
};

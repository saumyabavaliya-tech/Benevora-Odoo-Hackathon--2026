import React, { useState } from 'react';
import {
  User,
  Mail,
  MapPin,
  Compass,
  Calendar,
  Edit2,
  Shield,
  Heart,
  Award,
  Key,
  Trash2,
  Check,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { SafeImage } from '../components/ui/SafeImage';

export const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { trips } = useTrips();

  // Edit Profile
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Het Beladiya');
  const [bio, setBio] = useState(user?.bio || 'Full-stack explorer and adventure enthusiast.');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'Ahmedabad, India');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    user?.preferences?.travelStyles || ['Adventure', 'Photography', 'Food Trail', 'Coastal Haven']
  );

  // Security / Password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // Delete Account modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const allAvailablePreferences = [
    'Adventure',
    'Photography',
    'Food Trail',
    'Coastal Haven',
    'Solo Travel',
    'Heritage & History',
    'Luxury & Wellness',
    'Nature & Wildlife',
  ];

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      bio,
      homeCity,
      preferences: {
        travelStyles: selectedPreferences as any,
        favoriteDestinations: user?.preferences?.favoriteDestinations || [],
        favoriteActivities: user?.preferences?.favoriteActivities || [],
        budgetPreference: user?.preferences?.budgetPreference || 'Moderate',
        currency: user?.preferences?.currency || 'INR',
        language: user?.preferences?.language || 'English',
        dietaryPreference: user?.preferences?.dietaryPreference,
        pace: user?.preferences?.pace || 'Balanced',
      },
    });
    setIsEditOpen(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordFeedback('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback('New passwords do not match.');
      return;
    }

    setPasswordFeedback('Password successfully updated!');
    setTimeout(() => {
      setPasswordFeedback(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordModalOpen(false);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      logout();
    }
  };

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-8">
        {/* Profile Card */}
        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <SafeImage
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20"
                fallbackSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                    Pro Explorer
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user?.email}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user?.homeCity || 'Ahmedabad, India'}</span>
                </div>
                <p className="text-xs text-slate-300 pt-1 max-w-md">{user?.bio}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsPasswordModalOpen(true)}
                variant="outline"
                size="sm"
                leftIcon={<Lock className="w-3.5 h-3.5 text-slate-400" />}
              >
                Security
              </Button>
              <Button
                onClick={() => setIsEditOpen(true)}
                variant="primary"
                size="sm"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-center">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Trips Created</span>
              <p className="text-2xl font-black text-white mt-0.5">{trips.length}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Cities Visited</span>
              <p className="text-2xl font-black text-white mt-0.5">8</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Travel Badges</span>
              <p className="text-2xl font-black text-white mt-0.5">6</p>
            </div>
          </div>
        </div>

        {/* Travel Style Preferences & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Travel Preferences</h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="text-xs text-blue-400 hover:underline font-bold"
              >
                Customize
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPreferences.map((p) => (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 backdrop-blur-md"
                >
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-6 border border-white/15 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Explorer Achievements</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-amber-200">Multi-City Master</span>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-400/30 rounded-xl flex items-center gap-2.5 backdrop-blur-md">
                <Award className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-indigo-200">Saarthi Pioneer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Account Actions
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Delete your account and all associated itineraries, expenses, and travel memories.
            </p>
          </div>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Profile & Preferences"
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
              <label className="text-sm font-semibold text-slate-200 block mb-1.5">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 backdrop-blur-md"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Travel Style Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allAvailablePreferences.map((pref) => {
                  const isSelected = selectedPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                          : 'bg-slate-900/80 border-white/15 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

        {/* Change Password / Security Modal */}
        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setPasswordFeedback(null);
            setIsPasswordModalOpen(false);
          }}
          title="Security & Password Settings"
          description="Update your credentials to keep your travel account secure."
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  passwordFeedback.includes('successfully')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}
              >
                {passwordFeedback.includes('successfully') ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span>{passwordFeedback}</span>
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Your Account"
          description="This action is permanent and cannot be undone."
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              To confirm deletion, please type <strong className="text-rose-400">delete</strong> in the field below.
            </p>
            <Input
              placeholder="Type 'delete' to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                onClick={handleDeleteAccount}
              >
                Permanently Delete Account
              </Button>
            </div>
          </div>
        </Modal>
      </PageContainer>
    </DashboardLayout>
  );
};

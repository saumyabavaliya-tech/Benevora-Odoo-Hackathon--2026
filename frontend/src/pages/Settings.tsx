import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Lock, Shield, User, Globe, LogOut, Trash2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy'>('account');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <PageContainer className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your account preferences, notifications, and security.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'account', label: 'Account & Security', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Data', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" defaultValue={user?.name || 'Het Beladiya'} />
              <Input label="Email" defaultValue={user?.email || 'het.beladiya@example.com'} />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 pt-4 border-t border-slate-100">
              Security & Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-100">
              <Button onClick={handleLogout} variant="outline" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
                Log Out
              </Button>
              <Button variant="primary" size="sm">
                Save Preferences
              </Button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Email & Push Notifications</h3>
            <div className="space-y-3">
              {[
                { title: 'Trip Itinerary Reminders', desc: 'Get updates on scheduled day activities and departure times.' },
                { title: 'Budget & Expense Alerts', desc: 'Notify me when approaching or exceeding category spending limits.' },
                { title: 'Travel Saarthi Recommendations', desc: 'Receive AI smart suggestions for upcoming destinations.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Tab & Danger Zone */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Data Sharing & Visibility</h3>
              <p className="text-xs text-slate-500">
                Control how your shared trip links and photo memories are viewed by others.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Public Shared Trips</h4>
                  <p className="text-[11px] text-slate-500">Allow friends with share link to clone your itineraries.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600" />
              </div>
            </div>

            <div className="bg-rose-50/70 p-6 rounded-3xl border border-rose-200/70 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-950">Danger Zone</h4>
                <p className="text-xs text-rose-700">Delete your account and all associated itineraries.</p>
              </div>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-300 hover:bg-rose-100"
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
          description="Are you sure? This action cannot be undone."
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              All your trips, customized itineraries, budget records, and memories will be permanently wiped.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  handleLogout();
                }}
                className="bg-rose-600 hover:bg-rose-700"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      </PageContainer>
    </DashboardLayout>
  );
};

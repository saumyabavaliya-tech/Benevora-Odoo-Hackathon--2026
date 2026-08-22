import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plane,
  TrendingUp,
  MapPin,
  Sparkles,
  Shield,
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  Activity,
  DollarSign,
  Compass,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageContainer } from '../components/layout/PageContainer';
import { mockCities, mockActivities } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/common/Button';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Explorer' | 'Premium Traveler';
  tripsCount: number;
  joinedDate: string;
  status: 'Active' | 'Suspended';
}

const initialUsers: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Het Beladiya',
    email: 'het.beladiya@example.com',
    role: 'Admin',
    tripsCount: 4,
    joinedDate: 'Jan 2026',
    status: 'Active',
  },
  {
    id: 'usr-2',
    name: 'Aarav Patel',
    email: 'aarav.p@example.com',
    role: 'Premium Traveler',
    tripsCount: 7,
    joinedDate: 'Feb 2026',
    status: 'Active',
  },
  {
    id: 'usr-3',
    name: 'Sneha Sharma',
    email: 'sneha.travels@example.com',
    role: 'Explorer',
    tripsCount: 2,
    joinedDate: 'Mar 2026',
    status: 'Active',
  },
  {
    id: 'usr-4',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@example.com',
    role: 'Explorer',
    tripsCount: 5,
    joinedDate: 'Apr 2026',
    status: 'Active',
  },
  {
    id: 'usr-5',
    name: 'Pooja Mehta',
    email: 'pooja.m@example.com',
    role: 'Premium Traveler',
    tripsCount: 9,
    joinedDate: 'May 2026',
    status: 'Active',
  },
  {
    id: 'usr-6',
    name: 'Vikram Sengupta',
    email: 'vikram.s@example.com',
    role: 'Explorer',
    tripsCount: 1,
    joinedDate: 'Jun 2026',
    status: 'Suspended',
  },
];

const tripCreationTrends = [
  { month: 'Jan', trips: 142, users: 95 },
  { month: 'Feb', trips: 218, users: 154 },
  { month: 'Mar', trips: 360, users: 240 },
  { month: 'Apr', trips: 490, users: 310 },
  { month: 'May', trips: 680, users: 440 },
  { month: 'Jun', trips: 920, users: 590 },
  { month: 'Jul', trips: 1250, users: 810 },
  { month: 'Aug', trips: 1580, users: 1040 },
];

const travelStyleDistribution = [
  { name: 'Heritage & Culture', value: 38, color: '#3B82F6' },
  { name: 'Coastal & Beaches', value: 27, color: '#06B6D4' },
  { name: 'Adventure & Nature', value: 20, color: '#10B981' },
  { name: 'Culinary Trails', value: 15, color: '#F59E0B' },
];

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [timeRange, setTimeRange] = useState('8 Months');

  const filteredUsers = users.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  return (
    <DashboardLayout>
      <PageContainer className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin & System Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Platform Analytics & User Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Monitor app adoption, destination rankings, itinerary growth, and user accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-400/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Platform Telemetry
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Active Users</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">12,480</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this month
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Trips Created</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">5,640</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.1% MoM Growth
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Travel Budget Tracked</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">₹4.82 Cr</p>
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Avg ₹38.5k / Trip
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-2xl p-5 rounded-3xl border border-white/15 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Saarthi AI Queries</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tight">48.9k</p>
            <p className="text-xs font-bold text-purple-300 flex items-center gap-1">
              99.4% Synthesized Success
            </p>
          </div>
        </div>

        {/* Charts: Growth Trend & Style Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Area Growth Chart (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Trip & User Growth Trajectory</h3>
                <p className="text-xs text-slate-300">Monthly new itineraries plotted alongside explorer registrations</p>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-xl">
                2026 Trend
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tripCreationTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tripGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="trips"
                    name="Trips Created"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tripGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="New Users"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#userGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Style Breakdown Donut (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-white">Popular Travel Archetypes</h3>
              <p className="text-xs text-slate-300">Distribution of traveler style selections</p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={travelStyleDistribution}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {travelStyleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/10">
              {travelStyleDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Cities & Top Activities Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Cities Table */}
          <div className="bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Top Plotted Destinations</h3>
                <p className="text-xs text-slate-300">Highest inclusion rate across all user routes</p>
              </div>
              <Link to="/explore" className="text-xs font-bold text-blue-400 hover:underline">
                Explore Catalog
              </Link>
            </div>

            <div className="space-y-3">
              {mockCities.slice(0, 5).map((city, idx) => (
                <div
                  key={city.id}
                  className="p-3 bg-slate-950/60 rounded-2xl border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-xs flex items-center justify-center border border-blue-400/30">
                      #{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{city.name}</h4>
                      <p className="text-[10px] text-slate-400">{city.region} • {city.climate}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">{city.popularityScore}/100</span>
                    <span className="text-[10px] text-slate-400">Popularity Index</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Activities Table */}
          <div className="bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white">Top Scheduled Activities</h3>
                <p className="text-xs text-slate-300">Experiences most frequently scheduled into itineraries</p>
              </div>
              <span className="text-xs text-slate-400">{mockActivities.length} Available</span>
            </div>

            <div className="space-y-3">
              {mockActivities.slice(0, 5).map((act, idx) => (
                <div
                  key={act.id}
                  className="p-3 bg-slate-950/60 rounded-2xl border border-white/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-400/30">
                      #{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      <img src={act.imageUrl} alt={act.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{act.name}</h4>
                      <p className="text-[10px] text-slate-400">{act.cityName} • {act.durationHours} hrs</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-400 block">
                      {formatCurrency(act.estimatedCost, '₹')}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">{act.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/15 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white">User Accounts & Access Management</h3>
              <p className="text-xs text-slate-300">View user directory, trip creation counts, and manage account statuses.</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user or email..."
                  className="pl-9 pr-3 py-1.5 bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* Role filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950/70 border border-white/15 rounded-xl text-xs text-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Premium Traveler">Premium Traveler</option>
                <option value="Explorer">Explorer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase font-bold border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Trips Created</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span>{u.name}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          u.role === 'Admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                            : u.role === 'Premium Traveler'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">{u.tripsCount} Journeys</td>
                    <td className="px-4 py-3.5 text-slate-400">{u.joinedDate}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                        }`}
                      >
                        {u.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button
                        onClick={() => handleToggleStatus(u.id)}
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${
                          u.status === 'Active'
                            ? 'text-rose-300 hover:bg-rose-500/20'
                            : 'text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        {u.status === 'Active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
};

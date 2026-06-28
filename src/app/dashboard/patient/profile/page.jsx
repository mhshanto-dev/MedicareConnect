'use client';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Phone, Lock, Save, Camera, UserCheck } from 'lucide-react';

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState('general');

  // General profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [profilePicture, setProfilePicture] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    document.title = 'My Profile | MediCare Connect';
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setGender(user.gender || 'male');
      setProfilePicture(user.profilePicture || 'default-avatar.png');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name is required');
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const res = await api.put('/users/profile', {
        name,
        phone,
        gender,
        profilePicture,
      });
      await checkAuth(); // Refresh user state in auth store
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmNewPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.put('/users/password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information and security settings</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-4 transition-colors relative ${
            activeTab === 'general' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          General Information
          {activeTab === 'general' && (
            <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-4 transition-colors relative ${
            activeTab === 'security' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Security & Password
          {activeTab === 'security' && (
            <motion.div layoutId="profileTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {activeTab === 'general' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border shadow-sm"
        >
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Profile Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div className="relative">
                <div className="w-24 h-24 bg-blue-150 text-blue-600 font-bold text-3xl rounded-full flex items-center justify-center border-4 border-slate-50 shadow-inner">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border shadow-sm">
                  <Camera size={14} className="text-slate-500" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-lg">Your Profile Photo</h4>
                <p className="text-sm text-slate-500 mt-1 mb-3">Upload a new photo (or paste URL for now).</p>
                <input
                  type="text"
                  placeholder="Profile Image URL"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm bg-slate-50 text-slate-500 dark:bg-slate-900 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 text-slate-400" size={16} />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                <Save size={16} />
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border shadow-sm"
        >
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4 max-w-md">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
              >
                <Lock size={16} />
                {isChangingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

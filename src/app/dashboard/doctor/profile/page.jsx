'use client';
import { useState, useEffect } from 'react';
import useAuthStore from '@/store/useAuthStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { User, Phone, Briefcase, FileText, Save, Plus, Trash2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { SkeletonCard } from '@/components/dashboard/SkeletonCard';

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  // General details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('male');
  const [profilePicture, setProfilePicture] = useState('');

  // Professional details
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [bio, setBio] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [newQual, setNewQual] = useState('');

  // Fetch Doctor profile details
  const { data: doctorProfile, isLoading } = useQuery({
    queryKey: ['myDoctorProfile'],
    queryFn: async () => (await api.get('/doctors/profile/me')).data
  });

  useEffect(() => {
    document.title = 'Doctor Profile | MediCare Connect';
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setGender(user.gender || 'male');
      setProfilePicture(user.profilePicture || 'default-avatar.png');
    }
    if (doctorProfile) {
      setSpecialty(doctorProfile.specialty || '');
      setExperience(doctorProfile.experience || '');
      setConsultationFee(doctorProfile.consultationFee || '');
      setBio(doctorProfile.bio || '');
      setQualifications(doctorProfile.qualifications || []);
    }
  }, [user, doctorProfile]);

  const handleAddQual = () => {
    if (!newQual) return;
    if (qualifications.includes(newQual)) {
      toast.error('Qualification already listed');
      return;
    }
    setQualifications([...qualifications, newQual]);
    setNewQual('');
  };

  const handleRemoveQual = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !specialty || !experience || !consultationFee) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update general user profile
      const userPromise = api.put('/users/profile', {
        name,
        phone,
        gender,
        profilePicture,
      });

      // 2. Update professional doctor profile
      const doctorPromise = api.put('/doctors/profile/me', {
        specialty,
        experience,
        consultationFee,
        bio,
        qualifications,
      });

      await Promise.all([userPromise, doctorPromise]);
      await checkAuth(); // refresh Zustand auth session
      toast.success('Doctor profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Doctor Profile</h1>
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Doctor Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your clinic details, credentials, and contact details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: General Info */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm space-y-6 h-fit">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b">
              <User size={18} className="text-blue-500" /> Account Details
            </h3>

            {/* Profile Avatar Input */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Photo URL</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                  {name ? name.charAt(0).toUpperCase() : 'D'}
                </div>
                <input
                  type="text"
                  placeholder="Paste URL"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
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
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full px-4 py-2.5 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address (Read-Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="block w-full px-4 py-2.5 border rounded-xl text-sm bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Column 2: Professional Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* General Professional Credentials */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-905 dark:text-white flex items-center gap-2 pb-3 border-b">
                <Briefcase size={18} className="text-blue-500" /> Professional Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Specialty */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Medical Specialty</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. Cardiology"
                    className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Years Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Years of Experience</label>
                  <input
                    type="number"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 10"
                    className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Consultation Fee */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Consultation Fee ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    placeholder="e.g. 150"
                    className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Biography / Bio Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your medical focus, treatment style, etc."
                  rows={4}
                  className="block w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Qualifications Credentials Builder */}
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-3 border-b">
                <GraduationCap size={18} className="text-blue-500" /> Qualifications & Education
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQual}
                  onChange={(e) => setNewQual(e.target.value)}
                  placeholder="Add e.g. M.D. - Harvard University"
                  className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddQual}
                  className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-bold transition-all flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              {qualifications.length > 0 ? (
                <div className="space-y-2">
                  {qualifications.map((q, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{q}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQual(index)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No education qualifications added yet.</p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}

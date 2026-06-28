'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import useAuthStore from '@/store/useAuthStore';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import StripeCheckout from '@/components/StripeCheckout';
import { Heart, Calendar, Clock, Star, ArrowLeft, ShieldCheck, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function DoctorDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Fetch Doctor details
  const { data: doctor, isLoading: isDoctorLoading, error: doctorError } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      return res.data;
    }
  });

  // Fetch Reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await api.get(`/reviews?doctorId=${id}`);
      return res.data;
    }
  });

  // Fetch User Favorites to see if favorited
  const { data: favorites, refetch: refetchFavorites } = useQuery({
    queryKey: ['myFavorites'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const res = await api.get('/users/favorites');
      return res.data;
    },
    enabled: isAuthenticated
  });

  const isFavorited = favorites?.some(fav => fav._id === id);

  // Dynamic Page Title
  useEffect(() => {
    if (doctor?.userId?.name) {
      document.title = `Dr. ${doctor.userId.name} | MediCare Connect`;
    } else {
      document.title = 'Doctor Profile | MediCare Connect';
    }
  }, [doctor]);

  // Favorite toggle mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        return api.delete(`/users/favorites/${id}`);
      } else {
        return api.post('/users/favorites', { doctorId: id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myFavorites']);
      refetchFavorites();
      toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    },
    onError: () => {
      toast.error('Failed to update favorites');
    }
  });

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      router.push('/login');
      return;
    }
    toggleFavoriteMutation.mutate();
  };

  // Booking mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async () => {
      const date = new Date();
      // Simple date mapping based on the selected day
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIndex = daysOfWeek.indexOf(selectedDay);
      const currentDayIndex = date.getDay();
      let diff = targetDayIndex - currentDayIndex;
      if (diff <= 0) diff += 7; // Next week
      date.setDate(date.getDate() + diff);

      return api.post('/appointments', {
        doctorId: id,
        date: date.toISOString().split('T')[0],
        time: selectedTime,
        reasonForVisit: reason,
      });
    },
    onSuccess: (res) => {
      setCreatedAppointment(res.data);
      setShowPayment(true);
      toast.success('Appointment requested! Proceed to pay.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to request appointment');
    }
  });

  const handleBook = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to book appointments');
      router.push('/login');
      return;
    }
    if (!selectedDay || !selectedTime || !reason) {
      toast.error('Please fill all fields');
      return;
    }
    bookAppointmentMutation.mutate();
  };

  if (isDoctorLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><LoadingSkeleton /></div>;
  if (doctorError || !doctor) return <div className="text-center py-20"><p className="text-red-500 font-medium">Doctor profile not found</p></div>;

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/find-doctors')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to list
        </button>

        {/* Doctor Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-6 items-start relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center font-bold text-4xl sm:text-5xl flex-shrink-0">
            {doctor?.userId?.name ? doctor.userId.name.charAt(0).toUpperCase() : 'D'}
          </div>

          <div className="flex-1 w-full">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Dr. {doctor?.userId?.name}
                  </h1>
                  {doctor.isVerified && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-green-200">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-primary-600 font-semibold text-lg mt-1">{doctor.specialty}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-800 text-base">{averageRating}</span>
                  <span>({reviews?.length || 0} reviews)</span>
                </div>
              </div>

              <button
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isLoading}
                className={`p-3 rounded-full border transition-all ${
                  isFavorited 
                    ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                    : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-sm">
              <div>
                <p className="text-slate-500">Experience</p>
                <p className="font-bold text-slate-900 text-base">{doctor.experience} Years</p>
              </div>
              <div>
                <p className="text-slate-500">Consultation Fee</p>
                <p className="font-bold text-slate-900 text-base">${doctor.consultationFee}</p>
              </div>
              <div>
                <p className="text-slate-500 flex items-center gap-1"><MapPin size={14} /> Location</p>
                <p className="font-bold text-slate-900 text-base">Medical City, NY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About Doctor</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {doctor.bio || 'No biography details provided.'}
              </p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Qualifications & Education</h2>
              {doctor.qualifications && doctor.qualifications.length > 0 ? (
                <ul className="space-y-3">
                  {doctor.qualifications.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm sm:text-base">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No education qualifications provided.</p>
              )}
            </div>

            {/* Reviews list */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Patient Reviews ({reviews?.length || 0})</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((r) => (
                    <div key={r._id} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <p className="font-bold text-slate-900">{r.patientId?.name || 'Anonymous Patient'}</p>
                          <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm sm:text-base">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6">No reviews written yet. Be the first after your visit!</p>
              )}
            </div>
          </div>

          {/* Booking Widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-500" /> Book Consultation
              </h3>

              {!showPayment ? (
                <form onSubmit={handleBook} className="space-y-4">
                  {/* Select day from availability */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Available Days
                    </label>
                    {doctor.availability && doctor.availability.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {doctor.availability.map((av) => (
                          <button
                            key={av._id}
                            type="button"
                            onClick={() => {
                              setSelectedDay(av.day);
                              setSelectedTime(`${av.startTime} - ${av.endTime}`);
                            }}
                            className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-all ${
                              selectedDay === av.day
                                ? 'bg-primary-500 text-white border-primary-500'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {av.day}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-rose-500 font-medium">No available slots configured. Please contact support.</p>
                    )}
                  </div>

                  {/* Selected Time Display */}
                  {selectedDay && (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-xs text-slate-700">
                      <Clock size={14} className="text-primary-500" />
                      <span>{selectedTime}</span>
                    </div>
                  )}

                  {/* Reason for visit */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Reason for Visit
                    </label>
                    <div className="relative">
                      <FileText className="absolute top-3 left-3 text-slate-400" size={16} />
                      <textarea
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please describe symptoms, follow-up purpose, etc."
                        rows={3}
                        className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookAppointmentMutation.isLoading || !doctor.availability || doctor.availability.length === 0}
                    className="w-full py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
                  >
                    {bookAppointmentMutation.isLoading ? 'Requesting...' : 'Request & Pay'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-200 text-sm">
                    <p className="font-bold">Appointment Scheduled!</p>
                    <p className="mt-1">Please complete the payment of <strong>${doctor.consultationFee}</strong> below to secure your booking.</p>
                  </div>
                  <StripeCheckout
                    amount={doctor.consultationFee}
                    appointmentId={createdAppointment?._id}
                    onSuccess={() => {
                      router.push('/dashboard/patient/appointments');
                    }}
                    onCancel={() => {
                      setShowPayment(false);
                      setCreatedAppointment(null);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

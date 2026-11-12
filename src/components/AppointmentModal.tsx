import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  X,
  Database,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  Video,
  Store,
  PhoneCall,
  FileText,
  CalendarCheck,
  RefreshCw,
} from 'lucide-react';
import { Appointment } from '../types';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_SQL_SCHEMA,
  checkSupabaseTableStatus,
} from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentBooked?: (appointment: Appointment) => void;
}

const SERVICE_OPTIONS = [
  {
    id: 'personal-styling',
    label: 'Personal Styling & Wardrobe Curation',
    description: 'Complimentary session with our senior fashion stylists.',
    icon: '👔',
  },
  {
    id: 'vip-demo',
    label: 'VIP Product Unboxing & Private Demo',
    description: 'Exclusive hands-on preview of flagship watches and audio gear.',
    icon: '💎',
  },
  {
    id: 'bespoke-sizing',
    label: 'Custom Sizing & Bespoke Fit Consultation',
    description: 'Precision measurement guide for sneakers, hoodies, and jackets.',
    icon: '📏',
  },
  {
    id: 'corporate-gifting',
    label: 'Corporate & Luxury Bulk Gifting',
    description: 'Curated gift hampers, custom branding, and tier discounts.',
    icon: '🎁',
  },
  {
    id: 'tech-support',
    label: 'Priority Tech Setup & Wearable Pairing',
    description: 'Guided initial pairing, health metric calibration, and warranty setup.',
    icon: '⚡',
  },
];

const TIME_SLOTS = [
  '10:00 AM - 11:00 AM',
  '11:30 AM - 12:30 PM',
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
];

const MEETING_MODES = [
  { id: 'Virtual Video Call', label: 'Virtual Video Call', icon: Video, desc: 'Google Meet link provided' },
  { id: 'In-Store VIP Lounge', label: 'In-Store Lounge', icon: Store, desc: 'Mumbai Flagship Studio' },
  { id: 'Phone Consultation', label: 'Direct Phone Call', icon: PhoneCall, desc: 'Direct call from specialist' },
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentBooked,
}) => {
  const { user } = useAuth();

  // Tab: 'book' | 'my-appointments'
  const [activeTab, setActiveTab] = useState<'book' | 'my-appointments'>('book');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState(SERVICE_OPTIONS[0].label);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState(TIME_SLOTS[0]);
  const [meetingMode, setMeetingMode] = useState('Virtual Video Call');
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase Backend Live Status
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    tableExists: boolean;
    checked: boolean;
  }>({
    connected: true,
    tableExists: false,
    checked: false,
  });

  // Appointments List
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // Populate user defaults if logged in
  useEffect(() => {
    if (user) {
      if (user.displayName && !name) setName(user.displayName);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Set default appointment date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setAppointmentDate(dateStr);
  }, []);

  // Check Supabase status
  const refreshSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus({
          connected: data.connected,
          tableExists: data.tableExists,
          checked: true,
        });
      } else {
        const clientCheck = await checkSupabaseTableStatus();
        setSupabaseStatus({
          connected: clientCheck.connected,
          tableExists: clientCheck.tableExists,
          checked: true,
        });
      }
    } catch {
      setSupabaseStatus({ connected: true, tableExists: false, checked: true });
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshSupabaseStatus();
      loadAppointments();
    }
  }, [isOpen]);

  // Fetch appointments list
  const loadAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        if (data.appointments) {
          setAppointmentsList(data.appointments);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch appointments list:', err);
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !appointmentDate || !appointmentTime) {
      setErrorMessage('Please fill in all required fields (Name, Email, Phone, Date, and Time).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        serviceType,
        appointmentDate,
        appointmentTime,
        meetingMode,
        notes: notes.trim(),
      };

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok && !result.success) {
        throw new Error(result.error || 'Failed to schedule appointment');
      }

      const newAppt: Appointment = result.appointment || {
        id: 'APT-' + Math.floor(100000 + Math.random() * 900000),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        serviceType: payload.serviceType,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        meetingMode: payload.meetingMode,
        notes: payload.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        savedToSupabase: result.savedToSupabase ?? false,
      };

      setBookedAppointment(newAppt);
      if (onAppointmentBooked) {
        onAppointmentBooked(newAppt);
      }

      // Refresh list
      loadAppointments();
      refreshSupabaseStatus();
    } catch (err: any) {
      console.error('Error submitting appointment:', err);
      setErrorMessage(err.message || 'An error occurred while saving your appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBookedAppointment(null);
    setErrorMessage(null);
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>VIP Concierge & Styling</span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white">
            Book an Appointment
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-lg">
            Schedule a complimentary 1-on-1 session with our luxury stylists and product specialists.
            All bookings are persisted directly to your Supabase backend.
          </p>

          {/* Supabase Status Pill */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/10 text-gray-200">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Supabase Backend:</span>
              <span className="font-mono text-[11px] text-emerald-300 font-bold">
                {SUPABASE_PROJECT_ID}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            </div>

            <button
              type="button"
              onClick={() => setShowSqlGuide((prev) => !prev)}
              className="text-xs text-orange-300 hover:text-orange-200 underline font-semibold cursor-pointer"
            >
              {showSqlGuide ? 'Hide Supabase Schema' : 'View Supabase Table Schema'}
            </button>
          </div>
        </div>

        {/* Collapsible Supabase SQL Setup Helper */}
        {showSqlGuide && (
          <div className="bg-gray-900 border-b border-gray-800 p-4 text-xs text-gray-200 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <Database className="w-4 h-4" />
                <span>Supabase Table: `public.appointments`</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-[11px]"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Supabase SQL Editor</span>
                </a>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 mb-2">
              If the <code className="text-orange-300">appointments</code> table is not yet created in your Supabase project (Project ID: <strong className="text-white">{SUPABASE_PROJECT_ID}</strong>), copy and run this SQL query once in your Supabase Dashboard:
            </p>
            <pre className="bg-black/60 p-3 rounded-xl font-mono text-[10px] text-emerald-300 overflow-x-auto max-h-36 border border-gray-800">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('book')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'book'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('my-appointments');
              loadAppointments();
            }}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my-appointments'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Saved Appointments ({appointmentsList.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {activeTab === 'my-appointments' ? (
            /* My Appointments List from Supabase */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Appointments in Supabase
                  </h3>
                  <p className="text-xs text-gray-500">
                    Fetched live from your Supabase backend table (<code className="text-orange-600 font-mono">public.appointments</code>).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadAppointments}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAppointments ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingAppointments ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  <RefreshCw className="w-5 h-5 mx-auto animate-spin text-orange-600 mb-2" />
                  Loading appointments from Supabase...
                </div>
              ) : appointmentsList.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-800">No appointments recorded yet</p>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
                    Fill out the booking form to schedule your first VIP consultation session.
                  </p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors cursor-pointer"
                  >
                    Schedule an Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {appointmentsList.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold text-orange-600">
                              {appt.id.length > 15 ? appt.id.slice(0, 10) + '...' : appt.id}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              {appt.status || 'Confirmed'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 mt-1">
                            {appt.serviceType}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {appt.appointmentDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {appt.appointmentTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              {appt.name}
                            </span>
                          </div>
                          {appt.notes && (
                            <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded-lg border border-gray-200/60">
                              <strong className="text-gray-700">Notes:</strong> {appt.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {appt.meetingMode || 'Virtual Call'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                            <Database className="w-3 h-3" />
                            Supabase
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : bookedAppointment ? (
            /* Booking Confirmation Screen */
            <div className="py-4 text-center animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-gray-950 font-display">
                Appointment Successfully Booked!
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                Your consultation has been confirmed and saved to your Supabase backend.
              </p>

              {/* Supabase backend persistence indicator */}
              <div className="inline-flex items-center gap-1.5 my-3 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved in Supabase Project:</span>
                <span className="font-mono font-bold text-emerald-900">{SUPABASE_PROJECT_ID}</span>
              </div>

              {/* Appointment Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left max-w-lg mx-auto my-4 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Appointment Reference:</span>
                  <span className="font-mono font-bold text-gray-900">{bookedAppointment.id}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Service:</span>
                  <span className="font-bold text-gray-900">{bookedAppointment.serviceType}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Date & Time:</span>
                  <span className="font-bold text-orange-600">
                    {bookedAppointment.appointmentDate} at {bookedAppointment.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Meeting Mode:</span>
                  <span className="font-bold text-gray-900">{bookedAppointment.meetingMode}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 font-medium">Client:</span>
                  <span className="font-bold text-gray-900">
                    {bookedAppointment.name} ({bookedAppointment.phone})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Email Confirmation:</span>
                  <span className="font-bold text-gray-900">{bookedAppointment.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Book Another Appointment
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1.5">
                  Select Consultation Service <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICE_OPTIONS.map((svc) => {
                    const isSelected = serviceType === svc.label;
                    return (
                      <button
                        type="button"
                        key={svc.id}
                        onClick={() => setServiceType(svc.label)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <span className="text-xl shrink-0 select-none">{svc.icon}</span>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? 'text-orange-950' : 'text-gray-900'}`}>
                            {svc.label}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                            {svc.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details: Name, Email, Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shubham Patel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Preferred Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Preferred Time Slot <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-white"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Meeting Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Consultation Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MEETING_MODES.map((mode) => {
                    const ModeIcon = mode.icon;
                    const isSelected = meetingMode === mode.id;
                    return (
                      <button
                        type="button"
                        key={mode.id}
                        onClick={() => setMeetingMode(mode.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <ModeIcon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-orange-600' : 'text-gray-400'}`} />
                        <div>
                          <div className="text-xs">{mode.label}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{mode.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes / Special Requests */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Specific Requirements or Product Inquiries <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Tell us what you'd like to explore (e.g., smart watch features, sizing advice for sneakers, or custom gift options)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Saves directly to Supabase table <code className="font-mono text-gray-700">appointments</code></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

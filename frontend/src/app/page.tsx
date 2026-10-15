'use client';

import React, { useState } from 'react';
import {
  AuthMode,
  ClientLoginFormData,
  ClientRegisterFormData,
  OwnerLoginFormData,
  FormValidationErrors,
} from '@/types/auth';
import { TabSelector } from '@/components/ui/TabSelector';
import { FormInput } from '@/components/ui/FormInput';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { NoticeBanner } from '@/components/ui/NoticeBanner';
import {
  User,
  Mail,
  Globe,
  Phone,
  ShieldCheck,
  Building,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AuthenticationPage() {
  const [mode, setMode] = useState<AuthMode>('client-login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisconnectedNotice, setShowDisconnectedNotice] = useState(false);

  // Form States
  const [clientLoginForm, setClientLoginForm] = useState<ClientLoginFormData>({
    email: '',
    password: '',
  });

  const [clientRegisterForm, setClientRegisterForm] = useState<ClientRegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    whatsappNumber: '',
  });

  const [ownerLoginForm, setOwnerLoginForm] = useState<OwnerLoginFormData>({
    email: '',
    password: '',
  });

  // Validation Error States
  const [errors, setErrors] = useState<FormValidationErrors>({});

  // Reset errors and notice when switching modes
  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setShowDisconnectedNotice(false);
  };

  // Validation Helpers
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // optional
    return /^\+?[1-9]\d{6,14}$/.test(phone.trim());
  };

  // Handlers
  const handleClientLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDisconnectedNotice(false);
    const newErrors: FormValidationErrors = {};

    if (!clientLoginForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(clientLoginForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!clientLoginForm.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate transient client processing, then present unconfigured notice
    setTimeout(() => {
      setIsSubmitting(false);
      setShowDisconnectedNotice(true);
    }, 600);
  };

  const handleClientRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDisconnectedNotice(false);
    const newErrors: FormValidationErrors = {};

    if (!clientRegisterForm.fullName.trim() || clientRegisterForm.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!clientRegisterForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(clientRegisterForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!clientRegisterForm.country.trim() || clientRegisterForm.country.trim().length < 2) {
      newErrors.country = 'Country is required';
    }

    if (clientRegisterForm.whatsappNumber && !validatePhone(clientRegisterForm.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid international phone format (e.g., +1234567890)';
    }

    if (!clientRegisterForm.password) {
      newErrors.password = 'Password is required';
    } else if (clientRegisterForm.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(clientRegisterForm.password)) {
      newErrors.password = 'Must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(clientRegisterForm.password)) {
      newErrors.password = 'Must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(clientRegisterForm.password)) {
      newErrors.password = 'Must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(clientRegisterForm.password)) {
      newErrors.password = 'Must contain at least one special character';
    }

    if (clientRegisterForm.password !== clientRegisterForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowDisconnectedNotice(true);
    }, 700);
  };

  const handleOwnerLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDisconnectedNotice(false);
    const newErrors: FormValidationErrors = {};

    if (!ownerLoginForm.email.trim()) {
      newErrors.email = 'Company email address is required';
    } else if (!validateEmail(ownerLoginForm.email)) {
      newErrors.email = 'Please enter a valid company email';
    }

    if (!ownerLoginForm.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowDisconnectedNotice(true);
    }, 600);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-sky-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>sbuweb Architecture Foundation</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {mode === 'client-login' && 'Client Portal Login'}
            {mode === 'client-register' && 'Create Client Account'}
            {mode === 'owner-login' && 'Company Owner Portal'}
          </h1>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {mode === 'client-login' && 'Access your client workspace, active proposals, and projects.'}
            {mode === 'client-register' && 'Register your company or individual client profile.'}
            {mode === 'owner-login' && 'Restricted access for verified company administration.'}
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Tab Switcher */}
          <TabSelector currentMode={mode} onSelectMode={handleModeSwitch} />

          {/* Prompt / Notification Banner on Valid Submission */}
          {showDisconnectedNotice && (
            <NoticeBanner onDismiss={() => setShowDisconnectedNotice(false)} />
          )}

          {/* Form 1: Client Login */}
          {mode === 'client-login' && (
            <form onSubmit={handleClientLoginSubmit} noValidate className="space-y-4">
              <FormInput
                id="client-email"
                type="email"
                label="Email Address"
                placeholder="client@company.com"
                required
                icon={<Mail className="w-4 h-4" />}
                value={clientLoginForm.email}
                error={errors.email}
                onChange={(e) => setClientLoginForm({ ...clientLoginForm, email: e.target.value })}
              />

              <PasswordInput
                id="client-password"
                label="Password"
                placeholder="••••••••"
                required
                value={clientLoginForm.password}
                error={errors.password}
                onChange={(e) => setClientLoginForm({ ...clientLoginForm, password: e.target.value })}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Form Input...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Client</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('client-register')}
                  className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Don&apos;t have an account yet? <span className="font-semibold text-indigo-400 underline underline-offset-2">Register here</span>
                </button>
              </div>
            </form>
          )}

          {/* Form 2: Client Registration */}
          {mode === 'client-register' && (
            <form onSubmit={handleClientRegisterSubmit} noValidate className="space-y-4">
              <FormInput
                id="register-full-name"
                type="text"
                label="Full Name"
                placeholder="Jane Doe"
                required
                icon={<User className="w-4 h-4" />}
                value={clientRegisterForm.fullName}
                error={errors.fullName}
                onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, fullName: e.target.value })}
              />

              <FormInput
                id="register-email"
                type="email"
                label="Email Address"
                placeholder="jane.doe@example.com"
                required
                icon={<Mail className="w-4 h-4" />}
                value={clientRegisterForm.email}
                error={errors.email}
                onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, email: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="register-country"
                  type="text"
                  label="Country"
                  placeholder="United States"
                  required
                  icon={<Globe className="w-4 h-4" />}
                  value={clientRegisterForm.country}
                  error={errors.country}
                  onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, country: e.target.value })}
                />

                <FormInput
                  id="register-whatsapp"
                  type="tel"
                  label="WhatsApp"
                  hint="(Optional)"
                  placeholder="+1234567890"
                  icon={<Phone className="w-4 h-4" />}
                  value={clientRegisterForm.whatsappNumber}
                  error={errors.whatsappNumber}
                  onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, whatsappNumber: e.target.value })}
                />
              </div>

              <PasswordInput
                id="register-password"
                label="Password"
                hint="Min 8 chars, 1 uppercase, 1 symbol"
                placeholder="••••••••"
                required
                value={clientRegisterForm.password}
                error={errors.password}
                onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, password: e.target.value })}
              />

              <PasswordInput
                id="register-confirm-password"
                label="Confirm Password"
                placeholder="••••••••"
                required
                value={clientRegisterForm.confirmPassword}
                error={errors.confirmPassword}
                onChange={(e) => setClientRegisterForm({ ...clientRegisterForm, confirmPassword: e.target.value })}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Registration Form...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Client Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('client-login')}
                  className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Already have a client account? <span className="font-semibold text-indigo-400 underline underline-offset-2">Log in here</span>
                </button>
              </div>
            </form>
          )}

          {/* Form 3: Owner Login */}
          {mode === 'owner-login' && (
            <form onSubmit={handleOwnerLoginSubmit} noValidate className="space-y-4">
              <div className="rounded-lg bg-slate-800/40 border border-slate-700/50 p-3 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Owner credentials are provisioned exclusively by company administration. Public registration for owner privileges is disabled.
                </p>
              </div>

              <FormInput
                id="owner-email"
                type="email"
                label="Company-Provided Email"
                placeholder="executive@sbuweb.internal"
                required
                icon={<Building className="w-4 h-4" />}
                value={ownerLoginForm.email}
                error={errors.email}
                onChange={(e) => setOwnerLoginForm({ ...ownerLoginForm, email: e.target.value })}
              />

              <PasswordInput
                id="owner-password"
                label="Website-Specific Password"
                placeholder="••••••••"
                required
                value={ownerLoginForm.password}
                error={errors.password}
                onChange={(e) => setOwnerLoginForm({ ...ownerLoginForm, password: e.target.value })}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-white text-slate-900 py-3 text-sm font-semibold shadow-lg shadow-slate-950/50 transition-all duration-200 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                      <span>Verifying Owner Form...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Owner Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Isolation Disclaimer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>Modular Architecture: Frontend &amp; Backend completely separated.</p>
          <p className="mt-1">Zero mock sessions • Database credentials unconfigured</p>
        </div>
      </div>
    </main>
  );
}

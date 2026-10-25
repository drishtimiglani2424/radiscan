import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from './Input';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateConfirmPassword,
  validateRegistration,
  validateLogin,
} from '../utils/validators';

/**
 * Dedicated Authentication Page
 * Syllabus:
 * - Form handling in React & Validation strategies (Lectures 55-60)
 * - Controlled components holding values, errors, touched in useState
 * - Validate field on blur, validate whole form on submit, block submit if errors exist
 * - Register checks: name required, valid email, password at least 8 chars, confirm matches
 */
export const LoginPage = ({ defaultTab = 'signin', onNavigate }) => {
  const {
    user,
    currentUser = user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetLocalDatabase,
    demoAccounts,
    getStorageDiagnostics,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = location.state?.from?.pathname || '/dashboard';

  // Active Tab: 'signin' | 'register' (supports /register route and ?tab=register)
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'register' || location.pathname === '/register') return 'register';
    return defaultTab;
  });

  useEffect(() => {
    if (location.pathname === '/register' || searchParams.get('tab') === 'register') {
      setActiveTab('register');
    }
  }, [location.pathname, searchParams]);

  // Password visibility states
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inspector toggle for local storage diagnostics
  const [showInspector, setShowInspector] = useState(false);

  // 1. Sign In Form State (values, errors, touched in useState)
  const [signInValues, setSignInValues] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [signInErrors, setSignInErrors] = useState({});
  const [signInTouched, setSignInTouched] = useState({});

  // 2. Registration Form State (values, errors, touched in useState)
  const [regValues, setRegValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Medical Student',
    hospital: '',
    acceptTerms: false,
  });
  const [regErrors, setRegErrors] = useState({});
  const [regTouched, setRegTouched] = useState({});

  // Sign In Handlers
  const handleSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSignInValues((prev) => ({ ...prev, [name]: val }));

    if (signInTouched[name]) {
      let error = '';
      if (name === 'email') error = validateEmail(val);
      if (name === 'password') error = validatePassword(val, 6);
      setSignInErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSignInBlur = (e) => {
    const { name, value } = e.target;
    setSignInTouched((prev) => ({ ...prev, [name]: true }));
    let error = '';
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value, 6);
    setSignInErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInTouched({ email: true, password: true });

    // Validate whole form on submit
    const errors = validateLogin(signInValues);
    setSignInErrors(errors);

    // Block submit if any errors exist
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await login(signInValues.email, signInValues.password, signInValues.rememberMe);
    if (result.success) {
      if (onNavigate) onNavigate('workspace');
      navigate(from, { replace: true });
    }
  };

  // Demo 1-Click quick login
  const handleDemoLogin = async (demoUser) => {
    setSignInValues({
      email: demoUser.email,
      password: demoUser.password,
      rememberMe: true,
    });
    const result = await login(demoUser.email, demoUser.password, true);
    if (result.success) {
      if (onNavigate) onNavigate('workspace');
      navigate(from, { replace: true });
    }
  };

  // Registration Handlers
  const handleRegChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setRegValues((prev) => ({ ...prev, [name]: val }));

    if (regTouched[name]) {
      let error = '';
      if (name === 'name') error = validateName(val);
      if (name === 'email') error = validateEmail(val);
      if (name === 'password') error = validatePassword(val, 8);
      if (name === 'confirmPassword') error = validateConfirmPassword(regValues.password, val);
      setRegErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleRegBlur = (e) => {
    const { name, value } = e.target;
    setRegTouched((prev) => ({ ...prev, [name]: true }));
    let error = '';
    if (name === 'name') error = validateName(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value, 8);
    if (name === 'confirmPassword') error = validateConfirmPassword(regValues.password, value);
    setRegErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    // Validate whole form on submit
    // Register checks: name required, valid email, password at least 8 chars, confirm matches
    const errors = validateRegistration(regValues);
    if (!regValues.acceptTerms) {
      errors.acceptTerms = 'You must confirm orthopedic educational use.';
    }
    setRegErrors(errors);

    // Block submit if any errors exist
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await register({
      name: regValues.name,
      email: regValues.email,
      password: regValues.password,
      role: regValues.role,
      hospital: regValues.hospital,
    });

    if (result.success) {
      if (onNavigate) onNavigate('workspace');
      navigate(from, { replace: true });
    }
  };

  const storageStats = getStorageDiagnostics();

  return (
    <main className="pt-24 pb-28 min-h-screen bg-[#090D16] text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1E293B]">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Return to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse"></span>
            <span>STORAGE: BROWSER LOCAL</span>
          </div>
        </div>

        {/* If already authenticated, show user status banner */}
        {isAuthenticated && currentUser && (
          <div className="mb-8 p-6 bg-[#0B1120] border border-[#25334D] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#162035] border border-[#60A5FA] flex items-center justify-center font-mono font-bold text-lg text-[#60A5FA]">
                  {currentUser.avatarInitials || 'MD'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase bg-green-500/10 text-green-400 px-2 py-0.5 border border-green-500/30">
                      CURRENTLY SIGNED IN
                    </span>
                    <span className="font-mono text-xs text-[#64748B]">
                      ID: {currentUser.badgeId}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                    {currentUser.name}
                  </h2>
                  <p className="text-xs text-[#94A3B8] font-mono">
                    {currentUser.email} • {currentUser.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  to="/dashboard"
                  id="btn-goto-dashboard"
                  className="px-4 py-2 bg-[#60A5FA] text-[#090D16] font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5"
                >
                  <span>Dashboard</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <button
                  id="btn-logout"
                  onClick={logout}
                  className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <div className="text-xs font-mono text-[#94A3B8] flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#60A5FA]">swap_horiz</span>
              <span>To register another clinician or switch accounts, use the form tabs below:</span>
            </div>
          </div>
        )}

        {/* Authentication Form Card with Always-Visible Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Form Column */}
            <div className="lg:col-span-7 bg-[#0B1120] border border-[#1E293B] shadow-2xl">
              {/* Tabs Switcher: Tab 1 = Sign In, Tab 2 = Create Account */}
              <div className="grid grid-cols-2 border-b border-[#1E293B] bg-[#06080E]" role="tablist">
                <button
                  id="tab-signin"
                  role="tab"
                  aria-selected={activeTab === 'signin'}
                  onClick={() => setActiveTab('signin')}
                  className={`py-4 px-2 font-mono text-xs uppercase tracking-[2px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border-r border-[#1E293B] ${
                    activeTab === 'signin'
                      ? 'bg-[#0B1120] text-[#60A5FA] border-b-2 border-b-[#60A5FA]'
                      : 'bg-[#06080E] text-[#94A3B8] hover:text-white hover:bg-[#0B1120]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>1. Sign In</span>
                </button>

                <button
                  id="tab-register"
                  role="tab"
                  aria-selected={activeTab === 'register'}
                  onClick={() => setActiveTab('register')}
                  className={`py-4 px-2 font-mono text-xs uppercase tracking-[2px] font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'register'
                      ? 'bg-[#0B1120] text-[#60A5FA] border-b-2 border-b-[#60A5FA]'
                      : 'bg-[#06080E] text-[#94A3B8] hover:text-white hover:bg-[#0B1120]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">person_add</span>
                  <span>2. Create Account</span>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8">
                {activeTab === 'signin' ? (
                  /* SIGN IN FORM (Controlled component & HTML5 forms) */
                  <form onSubmit={handleSignInSubmit} noValidate className="space-y-5">
                    <header className="mb-2">
                      <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                        Clinician Authentication
                      </h2>
                      <p className="text-xs text-[#94A3B8] font-mono mt-1">
                        Credentials will be verified and stored in your browser's local storage.
                      </p>
                    </header>

                    {/* Academic .edu Fast-Track Notice */}
                    <div className="p-3 bg-[#0F172A] border border-[#25334D] flex items-center gap-2.5 text-xs font-mono text-[#60A5FA]">
                      <span className="material-symbols-outlined text-base shrink-0">school</span>
                      <span>
                        <strong className="text-white">Academic Instant Access:</strong> Any non-registered email ending with <span className="underline font-bold text-white">.edu</span> will automatically sign in and be stored in local storage!
                      </span>
                    </div>

                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      label="Institutional Email"
                      placeholder="e.g. dr.chen@ortho.med"
                      value={signInValues.email}
                      onChange={handleSignInChange}
                      onBlur={handleSignInBlur}
                      error={signInTouched.email ? signInErrors.email : ''}
                      required
                      autoComplete="email"
                      icon={<span className="material-symbols-outlined text-base">mail</span>}
                    />

                    <Input
                      id="signin-password"
                      name="password"
                      type={showSignInPassword ? 'text' : 'password'}
                      label="Password"
                      placeholder="Enter your security credentials"
                      value={signInValues.password}
                      onChange={handleSignInChange}
                      onBlur={handleSignInBlur}
                      error={signInTouched.password ? signInErrors.password : ''}
                      required
                      autoComplete="current-password"
                      icon={<span className="material-symbols-outlined text-base">lock</span>}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowSignInPassword(!showSignInPassword)}
                          aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                          className="text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer p-1"
                        >
                          <span className="material-symbols-outlined text-base">
                            {showSignInPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      }
                    />

                    {/* Remember me & recovery row */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[#94A3B8]">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          checked={signInValues.rememberMe}
                          onChange={handleSignInChange}
                          className="rounded-none border-[#1E293B] bg-[#090D16] text-[#60A5FA] focus:ring-[#60A5FA]"
                        />
                        <span>Remember session locally</span>
                      </label>

                      <span className="text-[11px] text-[#64748B]">
                        Local Storage API
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      id="btn-submit-signin"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-base animate-spin">
                            sync
                          </span>
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to Radiscan</span>
                          <span className="material-symbols-outlined text-base">login</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* REGISTRATION FORM (Controlled component & HTML5 forms) */
                  <form onSubmit={handleRegSubmit} noValidate className="space-y-4">
                    <header className="mb-2">
                      <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                        New Clinician Profile
                      </h2>
                      <p className="text-xs text-[#94A3B8] font-mono mt-1">
                        Register a new local account. Passwords must be at least 8 characters.
                      </p>
                    </header>

                    <Input
                      id="reg-name"
                      name="name"
                      type="text"
                      label="Full Clinician Name"
                      placeholder="e.g. Dr. Jordan Hayes, MD"
                      value={regValues.name}
                      onChange={handleRegChange}
                      onBlur={handleRegBlur}
                      error={regTouched.name ? regErrors.name : ''}
                      required
                      autoComplete="name"
                      icon={<span className="material-symbols-outlined text-base">person</span>}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Clinical Role Selection */}
                      <div className="flex flex-col gap-1.5 w-full">
                        <label
                          htmlFor="reg-role"
                          className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] flex items-center gap-1 cursor-pointer"
                        >
                          <span>Clinical Role</span>
                          <span className="text-[#60A5FA]">*</span>
                        </label>
                        <select
                          id="reg-role"
                          name="role"
                          value={regValues.role}
                          onChange={handleRegChange}
                          className="w-full bg-[#0B1120] border border-[#1E293B] focus:border-[#60A5FA] text-sm text-[#F8FAFC] font-mono py-2.5 px-3 focus:outline-none"
                        >
                          <option value="Medical Student">Medical Student</option>
                          <option value="Orthopedic Resident">Orthopedic Resident</option>
                          <option value="Attending Orthopedic Surgeon">Attending Orthopedic Surgeon</option>
                          <option value="Radiologist">Radiologist</option>
                          <option value="Physician Assistant">Physician Assistant</option>
                          <option value="Clinical Fellow">Clinical Fellow</option>
                        </select>
                      </div>

                      {/* Hospital / University */}
                      <Input
                        id="reg-hospital"
                        name="hospital"
                        type="text"
                        label="Institution / Hospital"
                        placeholder="e.g. Boston Trauma Care"
                        value={regValues.hospital}
                        onChange={handleRegChange}
                        onBlur={handleRegBlur}
                        error={regTouched.hospital ? regErrors.hospital : ''}
                        icon={<span className="material-symbols-outlined text-base">domain</span>}
                      />
                    </div>

                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="e.g. clinician@hospital.org"
                      value={regValues.email}
                      onChange={handleRegChange}
                      onBlur={handleRegBlur}
                      error={regTouched.email ? regErrors.email : ''}
                      required
                      autoComplete="email"
                      icon={<span className="material-symbols-outlined text-base">mail</span>}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="reg-password"
                        name="password"
                        type={showRegPassword ? 'text' : 'password'}
                        label="Password (min 8 chars)"
                        placeholder="Min 8 characters"
                        value={regValues.password}
                        onChange={handleRegChange}
                        onBlur={handleRegBlur}
                        error={regTouched.password ? regErrors.password : ''}
                        required
                        autoComplete="new-password"
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                            className="text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer p-1"
                          >
                            <span className="material-symbols-outlined text-base">
                              {showRegPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        }
                      />

                      <Input
                        id="reg-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        label="Confirm Password"
                        placeholder="Repeat password"
                        value={regValues.confirmPassword}
                        onChange={handleRegChange}
                        onBlur={handleRegBlur}
                        error={regTouched.confirmPassword ? regErrors.confirmPassword : ''}
                        required
                        autoComplete="new-password"
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            className="text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer p-1"
                          >
                            <span className="material-symbols-outlined text-base">
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        }
                      />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs font-mono text-[#94A3B8]">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={regValues.acceptTerms}
                          onChange={handleRegChange}
                          className="mt-0.5 rounded-none border-[#1E293B] bg-[#090D16] text-[#60A5FA] focus:ring-[#60A5FA]"
                        />
                        <span>
                          I acknowledge this account data is stored locally in this browser for educational orthopedic study.
                        </span>
                      </label>
                      {regTouched.acceptTerms && regErrors.acceptTerms && (
                        <div className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          <span>{regErrors.acceptTerms}</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      id="btn-submit-register"
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[2px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined text-base animate-spin">
                            sync
                          </span>
                          <span>Creating Local Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account & Log In</span>
                          <span className="material-symbols-outlined text-base">person_add</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Column: Demo Logins & Local Storage Telemetry */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick 1-Click Demo Login Card */}
              <div className="bg-[#0B1120] border border-[#1E293B] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-[#60A5FA]"></span>
                  <h3 className="font-mono text-xs uppercase tracking-[2px] text-white font-bold">
                    Quick 1-Click Demo Login
                  </h3>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 font-sans">
                  Instantly authenticate using pre-seeded local orthopedic credentials without manual typing:
                </p>

                <div className="space-y-3">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => handleDemoLogin(account)}
                      className="w-full text-left p-3.5 bg-[#0F172A] border border-[#1E293B] hover:border-[#60A5FA] transition-all group cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#60A5FA] transition-colors flex items-center gap-2">
                          <span>{account.name}</span>
                          <span className="text-[10px] font-mono bg-[#162035] text-[#94A3B8] px-1.5 py-0.2">
                            {account.avatarInitials}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
                          {account.role}
                        </div>
                        <div className="text-[10px] font-mono text-[#475569]">
                          {account.email}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-base text-[#64748B] group-hover:text-[#60A5FA] group-hover:translate-x-1 transition-all">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Local Storage Telemetry Card */}
              <div className="bg-[#0B1120] border border-[#1E293B] p-6 font-mono text-xs">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1E293B]">
                  <span className="text-[11px] uppercase tracking-[2px] text-[#60A5FA] font-bold">
                    Local Storage Status
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    JSON Serialized
                  </span>
                </div>

                <div className="space-y-2.5 text-[#94A3B8]">
                  <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60">
                    <span>Registered Accounts:</span>
                    <span className="text-white font-bold">{storageStats.usersCount} Profiles</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60">
                    <span>Active Session Key:</span>
                    <span className="text-[#60A5FA] text-[10px]">{storageStats.storageKeySession}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-[#1E293B]/60">
                    <span>Active Session:</span>
                    <span className={storageStats.hasActiveSession ? 'text-green-400' : 'text-[#64748B]'}>
                      {storageStats.hasActiveSession ? storageStats.sessionUser : 'None'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span>Storage Footprint:</span>
                    <span className="text-[#94A3B8]">{storageStats.approximateBytes} bytes</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1E293B] flex gap-2">
                  <button
                    onClick={() => setShowInspector(!showInspector)}
                    className="flex-1 py-1.5 bg-[#0F172A] border border-[#25334D] hover:border-[#60A5FA] text-[#94A3B8] hover:text-white text-[11px] transition-colors cursor-pointer uppercase tracking-wider text-center"
                  >
                    {showInspector ? 'Hide JSON Data' : 'Inspect JSON Data'}
                  </button>

                  <button
                    onClick={resetLocalDatabase}
                    title="Reset to initial seed accounts"
                    className="px-2.5 py-1.5 bg-[#0F172A] border border-[#25334D] hover:border-red-400 text-red-400 text-[11px] transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>

                {/* Collapsible Raw JSON Data Inspector */}
                {showInspector && (
                  <div className="mt-4 pt-3 border-t border-[#1E293B] text-[10px]">
                    <div className="text-[#64748B] uppercase mb-1">Raw Session JSON (localStorage):</div>
                    <pre className="p-2.5 bg-[#06080E] border border-[#1E293B] overflow-x-auto text-[#60A5FA] max-h-36">
                      {localStorage.getItem('radiscan_auth_session') || '// No active session stored'}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default LoginPage;

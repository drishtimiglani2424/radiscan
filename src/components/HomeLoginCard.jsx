import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from './Input';
import { validateEmail, validatePassword, validateLogin } from '../utils/validators';

/**
 * Home Page Embedded Clinical Authentication Card
 * Strictly adheres to syllabus:
 * - HTML5 structure, semantic elements
 * - Controlled components holding values, errors, touched in useState
 * - Validate field on blur, whole form on submit, block submit if errors exist
 * - Reusable Input component (taking label, type, name, value, onChange, onBlur, error)
 */
export const HomeLoginCard = ({ onNavigate }) => {
  const { currentUser, user = currentUser, isAuthenticated, isLoading, login, logout, demoAccounts } = useAuth();
  const navigate = useNavigate();

  // Form holds values, errors, and touched in useState
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let err = '';
      if (name === 'email') err = validateEmail(value);
      if (name === 'password') err = validatePassword(value, 6);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    let err = '';
    if (name === 'email') err = validateEmail(value);
    if (name === 'password') err = validatePassword(value, 6);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    // Validate whole form on submit
    const validationErrors = validateLogin(values);
    setErrors(validationErrors);

    // Block submit if any exist
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await login(values.email, values.password, true);
  };

  const handleDemoSignIn = async (account) => {
    setValues({
      email: account.email,
      password: account.password,
    });
    setErrors({});
    await login(account.email, account.password, true);
  };

  return (
    <section
      aria-labelledby="home-auth-title"
      className="bg-[#0B1120] border border-[#1E293B] shadow-2xl relative overflow-hidden"
    >
      {/* Accent corner line */}
      <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-l from-[#60A5FA] to-transparent"></div>

      {isAuthenticated && currentUser ? (
        /* Authenticated Clinician State on Home Page */
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#162035] border border-[#60A5FA] flex items-center justify-center font-mono font-bold text-base text-[#60A5FA]">
                {currentUser.avatarInitials || 'MD'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase bg-[#60A5FA]/10 text-[#60A5FA] px-1.5 py-0.2 border border-[#60A5FA]/30">
                    LOCAL SESSION
                  </span>
                  <span className="font-mono text-[10px] text-[#64748B]">
                    {currentUser.badgeId}
                  </span>
                </div>
                <h3 id="home-auth-title" className="text-base font-bold text-white mt-0.5">
                  {currentUser.name}
                </h3>
              </div>
            </div>

            <button
              id="btn-home-signout"
              onClick={logout}
              className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#0F172A] border border-[#1E293B]">
              <div className="text-[10px] text-[#64748B] uppercase">Role</div>
              <div className="text-white font-bold truncate mt-0.5">{currentUser.role}</div>
            </div>
            <div className="p-3 bg-[#0F172A] border border-[#1E293B]">
              <div className="text-[10px] text-[#64748B] uppercase">Hospital</div>
              <div className="text-[#60A5FA] truncate mt-0.5">{currentUser.hospital}</div>
            </div>
          </div>

          <div className="p-3 bg-[#06080E] border border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Data persists locally in this browser</span>
            </div>
            <Link
              to="/dashboard"
              className="text-[#60A5FA] hover:underline uppercase text-[10px] cursor-pointer"
            >
              View Dashboard
            </Link>
          </div>

          <div className="flex gap-3">
            <Link
              id="btn-home-auth-dashboard"
              to="/dashboard"
              className="flex-1 py-2.5 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] transition-all cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <span>Go to Dashboard</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            <Link
              to="/workspace"
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#25334D] font-mono text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
            >
              Workspace
            </Link>
          </div>
        </div>
      ) : (
        /* Sign In Form on Home Page */
        <div className="p-6 sm:p-8 space-y-5">
          <header className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#60A5FA]"></span>
                <span className="font-mono text-[10px] text-[#60A5FA] uppercase tracking-[2px]">
                  CLINICAL PORTAL
                </span>
              </div>
              <h3 id="home-auth-title" className="text-base sm:text-lg font-bold text-white uppercase tracking-tight mt-1">
                Clinician Sign In
              </h3>
            </div>
            <Link
              id="btn-home-full-login"
              to="/login"
              className="text-xs font-mono text-[#60A5FA] hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Full Page</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </header>

          <div className="p-2.5 bg-[#0F172A] border border-[#25334D] flex items-center gap-2 text-[11px] font-mono text-[#60A5FA]">
            <span className="material-symbols-outlined text-sm shrink-0">school</span>
            <span>
              <strong className="text-white">Academic Access:</strong> Emails ending in <span className="underline font-bold text-white">.edu</span> sign in instantly!
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <Input
              id="home-email"
              name="email"
              type="email"
              label="Institutional Email"
              placeholder="e.g. dr.chen@ortho.med"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ''}
              required
              autoComplete="email"
              icon={<span className="material-symbols-outlined text-base">mail</span>}
            />

            <Input
              id="home-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ''}
              required
              autoComplete="current-password"
              icon={<span className="material-symbols-outlined text-base">lock</span>}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-[#64748B] hover:text-[#94A3B8] transition-colors cursor-pointer p-1"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />

            <button
              id="btn-home-signin-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#60A5FA] hover:bg-white text-[#090D16] font-mono font-bold text-xs uppercase tracking-[1.5px] transition-all cursor-pointer flex items-center justify-center gap-2 shadow disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-sm">login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Buttons */}
          <div className="pt-2 border-t border-[#1E293B]">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] uppercase mb-2">
              <span>Instant 1-Click Demo</span>
              <span>Stored in localStorage</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleDemoSignIn(account)}
                  className="p-2 bg-[#0F172A] border border-[#1E293B] hover:border-[#60A5FA] text-left transition-all cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-[#60A5FA] truncate">
                    {account.name.split(',')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-[#64748B] truncate">
                    {account.role.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-1">
            <span className="text-[#64748B]">New student or clinician?</span>
            <Link
              id="btn-home-create-account"
              to="/login"
              className="text-[#60A5FA] hover:underline uppercase cursor-pointer"
            >
              Create Account →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeLoginCard;

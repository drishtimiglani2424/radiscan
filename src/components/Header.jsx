import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Global Clinical Navigation Header
 * Strictly adheres to syllabus & requirements:
 * - HTML5 structure & semantic tags (<header>, <nav>)
 * - Displays 'Sign in' when unauthenticated
 * - Displays user's name and 'Logout' button when authenticated
 * - Guaranteed clickable navigation across all devices (Index, Workspace, Archive, Quiz Lab, Flashcards)
 */
export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#090D16]/95 backdrop-blur-md border-b border-[#1E293B] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          id="btn-header-logo"
          onClick={closeMobile}
          className="text-left group flex items-center gap-3 focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-none bg-[#0F172A] border border-[#1E293B] group-hover:border-[#60A5FA] flex items-center justify-center text-[#60A5FA] transition-colors">
            <span className="font-mono text-xs font-black">R.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-[3px] uppercase text-white group-hover:text-[#60A5FA] transition-colors">
              RADISCAN
            </span>
            <span className="text-[9px] font-mono uppercase bg-[#162035] border border-[#25334D] px-1.5 py-0.5 text-[#94A3B8] hidden sm:inline-block">
              AI // LAB
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Index
          </NavLink>

          <NavLink
            to="/workspace"
            className={({ isActive }) =>
              `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Workspace
          </NavLink>

          <NavLink
            to="/case-library"
            id="nav-link-archive"
            className={({ isActive }) =>
              `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Archive
          </NavLink>

          <NavLink
            to="/quizzes"
            id="nav-link-quizzes"
            className={({ isActive }) =>
              `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Quiz Lab
          </NavLink>

          <NavLink
            to="/flashcards"
            id="nav-link-flashcards"
            className={({ isActive }) =>
              `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Flashcards
          </NavLink>

          {/* Protected routes links visible when authenticated */}
          {user && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                    isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/my-cases"
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-[2px] transition-colors cursor-pointer py-1 ${
                    isActive ? 'text-[#60A5FA] font-bold border-b border-[#60A5FA]' : 'text-[#94A3B8] hover:text-white'
                  }`
                }
              >
                My Cases
              </NavLink>
            </>
          )}

          <div className="h-4 w-px bg-[#1E293B]"></div>

          {/* User Status / Authentication Actions */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                id="header-user-profile"
                className="flex items-center gap-2 py-1 px-2.5 bg-[#0F172A] border border-[#25334D] hover:border-[#60A5FA] transition-colors group"
              >
                <div className="w-5 h-5 bg-[#162035] border border-[#60A5FA] flex items-center justify-center font-mono font-bold text-[9px] text-[#60A5FA]">
                  {user.avatarInitials || 'MD'}
                </div>
                <span className="text-xs font-mono font-bold text-white group-hover:text-[#60A5FA] max-w-[130px] truncate">
                  {user.name}
                </span>
              </Link>

              <button
                id="btn-header-logout"
                type="button"
                onClick={handleLogout}
                className="text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              id="btn-nav-signin"
              className="text-xs font-mono uppercase tracking-[1.5px] px-3.5 py-1.5 transition-all flex items-center gap-1.5 cursor-pointer border bg-[#0F172A] hover:bg-[#60A5FA] text-[#60A5FA] hover:text-[#090D16] border-[#25334D] hover:border-[#60A5FA] font-bold"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Sign in</span>
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Link
              to="/dashboard"
              className="w-7 h-7 bg-[#162035] border border-[#60A5FA] flex items-center justify-center font-mono font-bold text-[10px] text-[#60A5FA]"
            >
              {user.avatarInitials || 'MD'}
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-[11px] font-mono uppercase px-2.5 py-1 border border-[#60A5FA] text-[#60A5FA]"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            id="btn-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-white hover:text-[#60A5FA] border border-[#1E293B] hover:border-[#60A5FA] bg-[#0F172A] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090D16] border-b border-[#1E293B] px-6 py-4 space-y-3 font-mono animate-fadeIn">
          <NavLink
            to="/"
            end
            onClick={closeMobile}
            className={({ isActive }) =>
              `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Index / Home
          </NavLink>
          <NavLink
            to="/workspace"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Workspace
          </NavLink>
          <NavLink
            to="/case-library"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Archive
          </NavLink>
          <NavLink
            to="/quizzes"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Quiz Lab
          </NavLink>
          <NavLink
            to="/flashcards"
            onClick={closeMobile}
            className={({ isActive }) =>
              `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
              }`
            }
          >
            Flashcards
          </NavLink>

          {user && (
            <>
              <div className="h-px bg-[#1E293B] my-2"></div>
              <NavLink
                to="/dashboard"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                    isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/my-cases"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `block py-2 text-xs uppercase tracking-[2px] transition-colors ${
                    isActive ? 'text-[#60A5FA] font-bold' : 'text-[#94A3B8] hover:text-white'
                  }`
                }
              >
                My Cases
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300"
              >
                Logout ({user.name})
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

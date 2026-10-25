import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Storage keys for browser localStorage (Syllabus: Browser storage, JSON, and forms)
const USERS_STORAGE_KEY = 'radiscan_registered_users';
const CURRENT_USER_KEY = 'radiscan_auth_session';

// Pre-seeded clinical demo accounts stored locally on initial load
const SEED_USERS = [
  {
    id: 'user-001',
    name: 'Dr. Elena Chen, MD',
    email: 'dr.chen@ortho.med',
    password: 'Password123!',
    role: 'Attending Orthopedic Surgeon',
    hospital: 'Metropolitan Trauma Center',
    badgeId: 'RAD-7049',
    avatarInitials: 'EC',
    joinedDate: '2026-01-15',
    savedCases: ['distal-radius-fracture', 'scaphoid-waist-fracture'],
  },
  {
    id: 'user-002',
    name: 'Alex Rivera',
    email: 'alex.student@med.edu',
    password: 'Password123!',
    role: 'Orthopedic Resident (PGY-2)',
    hospital: 'University School of Medicine',
    badgeId: 'RAD-2194',
    avatarInitials: 'AR',
    joinedDate: '2026-03-01',
    savedCases: ['femur-shaft-fracture'],
  },
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Lazy initial state: Read user back from localStorage as JSON so a refresh keeps the session
  const [user, setUser] = useState(() => {
    try {
      // Initialize seed users if not yet created in localStorage
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!storedUsersRaw) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      }

      const activeSessionRaw = localStorage.getItem(CURRENT_USER_KEY);
      return activeSessionRaw ? JSON.parse(activeSessionRaw) : null;
    } catch (err) {
      console.error('Error hydrating auth state from localStorage:', err);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync user state changes directly to localStorage as JSON
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (err) {
      console.error('Error syncing user to localStorage:', err);
    }
  }, [user]);

  // Toast alert helpers
  const showToast = useCallback((message, type = 'info') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all registered users from localStorage
  const getAllUsers = useCallback(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_USERS;
    } catch (err) {
      console.error('Failed to read users from localStorage:', err);
      return SEED_USERS;
    }
  }, []);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    setAuthError(null);

    // Realistic brief async simulation
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const users = getAllUsers();
      const normalizedEmail = email.trim().toLowerCase();

      // Find user by email and verify password
      let matchedUser = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      // FEATURE: If email is not pre-stored but ends with .edu, auto-provision and sign in!
      if (!matchedUser && normalizedEmail.endsWith('.edu')) {
        const usernamePart = normalizedEmail.split('@')[0] || 'Scholar';
        const formattedName = usernamePart
          .split(/[._-]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
        const displayName = formattedName || 'Academic Scholar';

        const nameParts = displayName.split(' ');
        const initials = nameParts.length > 1
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : displayName.substring(0, 2).toUpperCase();

        const domainPart = normalizedEmail.split('@')[1] || 'edu';
        const schoolName = domainPart.replace('.edu', '');
        const schoolFormatted =
          schoolName.charAt(0).toUpperCase() + schoolName.slice(1) + ' Medical School';

        const newEduUser = {
          id: `edu-${Date.now()}`,
          name: displayName,
          email: normalizedEmail,
          password: password || 'EduPass2026!',
          role: 'Medical Trainee (.edu verified)',
          hospital: schoolFormatted,
          badgeId: `EDU-${Math.floor(1000 + Math.random() * 9000)}`,
          avatarInitials: initials,
          joinedDate: new Date().toISOString().split('T')[0],
          savedCases: [],
          isEduVerified: true,
        };

        const updatedUsers = [...users, newEduUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        matchedUser = newEduUser;
      }

      if (!matchedUser) {
        const errorMsg = 'Invalid email or password. Any academic email ending in .edu receives instant sign-in.';
        setAuthError(errorMsg);
        setIsLoading(false);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      // Create session user payload
      const sessionUser = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        hospital: matchedUser.hospital,
        badgeId: matchedUser.badgeId,
        avatarInitials: matchedUser.avatarInitials,
        joinedDate: matchedUser.joinedDate,
        savedCases: matchedUser.savedCases || [],
        sessionStarted: new Date().toISOString(),
        rememberMe: !!rememberMe,
        isEduVerified: !!matchedUser.isEduVerified,
      };

      setUser(sessionUser);
      setIsLoading(false);

      if (matchedUser.isEduVerified) {
        showToast(
          `Academic .edu email verified! Welcome, ${sessionUser.name}. Account saved to local storage.`,
          'success'
        );
      } else {
        showToast(`Welcome back, ${sessionUser.name}! Session stored locally.`, 'success');
      }

      return { success: true, user: sessionUser };
    } catch (err) {
      const errorMsg = 'An unexpected error occurred during sign in.';
      setAuthError(errorMsg);
      setIsLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  // Register handler
  const register = async ({ name, email, password, role, hospital }) => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      const users = getAllUsers();
      const normalizedEmail = email.trim().toLowerCase();

      const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (exists) {
        const errorMsg = 'An account with this email address already exists.';
        setAuthError(errorMsg);
        setIsLoading(false);
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const nameParts = name.trim().split(' ');
      const initials = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: role || 'Medical Student',
        hospital: hospital ? hospital.trim() : 'General Medical Center',
        badgeId: `RAD-${Math.floor(1000 + Math.random() * 9000)}`,
        avatarInitials: initials,
        joinedDate: new Date().toISOString().split('T')[0],
        savedCases: [],
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        hospital: newUser.hospital,
        badgeId: newUser.badgeId,
        avatarInitials: newUser.avatarInitials,
        joinedDate: newUser.joinedDate,
        savedCases: [],
        sessionStarted: new Date().toISOString(),
        rememberMe: true,
      };

      setUser(sessionUser);
      setIsLoading(false);
      showToast(`Account created successfully! Welcome to RADISCAN, ${newUser.name}.`, 'success');

      return { success: true, user: sessionUser };
    } catch (err) {
      const errorMsg = 'Failed to register account in local storage.';
      setAuthError(errorMsg);
      setIsLoading(false);
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setAuthError(null);
    showToast('Signed out successfully. Session cleared from local storage.', 'info');
  };

  // Reset database to demo seed accounts
  const resetLocalDatabase = () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
    setUser(null);
    showToast('Local database reset to demo seed accounts.', 'info');
  };

  // Toggle bookmark / saved case
  const toggleSaveCase = (caseId) => {
    if (!user) {
      showToast('Please sign in to save cases to your local profile.', 'error');
      return false;
    }

    try {
      const currentSaved = user.savedCases || [];
      const isSaved = currentSaved.includes(caseId);
      const updatedSaved = isSaved
        ? currentSaved.filter((id) => id !== caseId)
        : [...currentSaved, caseId];

      const updatedUser = {
        ...user,
        savedCases: updatedSaved,
      };

      setUser(updatedUser);

      const users = getAllUsers();
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, savedCases: updatedSaved } : u
      );
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      showToast(
        isSaved ? 'Case removed from saved archive.' : 'Case saved to your local profile!',
        'success'
      );
      return !isSaved;
    } catch (err) {
      console.error('Failed to update saved cases:', err);
      return false;
    }
  };

  const getStorageDiagnostics = () => {
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const rawSession = localStorage.getItem(CURRENT_USER_KEY);
    return {
      usersCount: rawUsers ? JSON.parse(rawUsers).length : 0,
      hasActiveSession: !!rawSession,
      sessionUser: rawSession ? JSON.parse(rawSession).email : null,
      storageKeyUsers: USERS_STORAGE_KEY,
      storageKeySession: CURRENT_USER_KEY,
      approximateBytes: (rawUsers ? rawUsers.length : 0) + (rawSession ? rawSession.length : 0),
    };
  };

  // Returns user, login, register, and logout as specified
  const value = {
    user,
    currentUser: user,
    isAuthenticated: !!user,
    isLoading,
    authError,
    toast,
    login,
    register,
    logout,
    showToast,
    hideToast,
    resetLocalDatabase,
    toggleSaveCase,
    getStorageDiagnostics,
    demoAccounts: SEED_USERS,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

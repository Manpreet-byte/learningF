// Simple authentication with localStorage
// Uses Web Crypto API for basic password hashing

const AUTH_PREFIX = 'learning-platform:auth:';
const USERS_KEY = `${AUTH_PREFIX}users`;
const CURRENT_USER_KEY = `${AUTH_PREFIX}current-user`;

// Simple password hashing using Web Crypto (not cryptographically secure, for demo only)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Compare password with hash
async function comparePassword(password, hash) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

export const auth = {
  // Register a new user
  async register(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const users = auth.getAllUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      passwordHash: hashedPassword,
      createdAt: Date.now(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Auto-login after registration
    auth.setCurrentUser(newUser);
    return newUser;
  },

  // Login user
  async login(email, password) {
    const users = auth.getAllUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error('Email not found');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    auth.setCurrentUser(user);
    return user;
  },

  // Logout
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current user
  getCurrentUser() {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // Set current user (internal)
  setCurrentUser(user) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set current user:', error);
    }
  },

  // Get all users
  getAllUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return auth.getCurrentUser() !== null;
  },
};

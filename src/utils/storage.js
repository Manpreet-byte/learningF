// LocalStorage persistence utilities
import { auth } from './auth';

const STORAGE_PREFIX = 'learning-platform:';

// Get user-namespaced key
const getUserKey = (key) => {
  const user = auth.getCurrentUser();
  const userId = user?.id || 'guest';
  return `${STORAGE_PREFIX}${userId}:${key}`;
};

export const storage = {
  // Code auto-save
  saveCode: (lessonId, code) => {
    try {
      localStorage.setItem(
        getUserKey(`code:${lessonId}`),
        JSON.stringify(code)
      );
    } catch (error) {
      console.error('Failed to save code:', error);
    }
  },

  loadCode: (lessonId) => {
    try {
      const data = localStorage.getItem(getUserKey(`code:${lessonId}`));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load code:', error);
      return null;
    }
  },

  // Progress tracking
  saveProgress: (progress) => {
    try {
      const existing = storage.getAllProgress();
      const updated = existing.filter((p) => p.lessonId !== progress.lessonId);
      updated.push(progress);
      localStorage.setItem(
        getUserKey('progress'),
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  getProgress: (lessonId) => {
    try {
      const all = storage.getAllProgress();
      return all.find((p) => p.lessonId === lessonId) || null;
    } catch (error) {
      console.error('Failed to get progress:', error);
      return null;
    }
  },

  getAllProgress: () => {
    try {
      const data = localStorage.getItem(getUserKey('progress'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load progress:', error);
      return [];
    }
  },

  // Completion tracking
  markLessonComplete: (lessonId) => {
    const progress = storage.getProgress(lessonId) || {
      lessonId,
      completed: false,
      code: { html: '', css: '', javascript: '' },
    };
    progress.completed = true;
    progress.completedAt = Date.now();
    storage.saveProgress(progress);
    
    // Update user profile
    const profile = storage.getUserProfile();
    profile.totalLessonsCompleted++;
    profile.xp += 50;
    profile.level = Math.floor(profile.xp / 200) + 1;
    profile.lastActivityDate = Date.now();
    storage.saveUserProfile(profile);
  },

  getCompletionPercentage: () => {
    const allProgress = storage.getAllProgress();
    if (allProgress.length === 0) return 0;
    const completed = allProgress.filter((p) => p.completed).length;
    return Math.round((completed / allProgress.length) * 100);
  },

  // User profile
  getUserProfile: () => {
    try {
      const data = localStorage.getItem(getUserKey('profile'));
      if (data) return JSON.parse(data);
      
      const defaultProfile = {
        username: 'Guest User',
        joinedAt: Date.now(),
        totalLessonsCompleted: 0,
        streak: 0,
        lastActivityDate: Date.now(),
        level: 1,
        xp: 0,
      };
      storage.saveUserProfile(defaultProfile);
      return defaultProfile;
    } catch (error) {
      console.error('Failed to load profile:', error);
      return {
        username: 'Guest User',
        joinedAt: Date.now(),
        totalLessonsCompleted: 0,
        streak: 0,
        lastActivityDate: Date.now(),
        level: 1,
        xp: 0,
      };
    }
  },

  saveUserProfile: (profile) => {
    try {
      localStorage.setItem(getUserKey('profile'), JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  },

  // Code snippets
  saveSnippet: (snippet) => {
    try {
      const snippets = storage.getAllSnippets();
      snippets.push(snippet);
      localStorage.setItem(getUserKey('snippets'), JSON.stringify(snippets));
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  },

  getAllSnippets: () => {
    try {
      const data = localStorage.getItem(getUserKey('snippets'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load snippets:', error);
      return [];
    }
  },

  deleteSnippet: (id) => {
    try {
      const snippets = storage.getAllSnippets().filter(s => s.id !== id);
      localStorage.setItem(getUserKey('snippets'), JSON.stringify(snippets));
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  },

  // App settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(getUserKey('settings'));
      if (data) return JSON.parse(data);
      
      const defaultSettings = {
        theme: 'light',
        fontSize: 14,
        autoSave: true,
        showHints: true,
        autoRunCode: false,
      };
      storage.saveSettings(defaultSettings);
      return defaultSettings;
    } catch (error) {
      return {
        theme: 'light',
        fontSize: 14,
        autoSave: true,
        showHints: true,
        autoRunCode: false,
      };
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(getUserKey('settings'), JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Achievements (unlocked list)
  getUnlockedAchievements: () => {
    try {
      const data = localStorage.getItem(getUserKey('achievements'));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load achievements:', error);
      return [];
    }
  },

  unlockAchievement: (id, meta = {}) => {
    try {
      const unlocked = storage.getUnlockedAchievements();
      if (unlocked.some((a) => a.id === id)) return false;
      const entry = { id, unlockedAt: Date.now(), ...meta };
      unlocked.push(entry);
      localStorage.setItem(
        getUserKey('achievements'),
        JSON.stringify(unlocked)
      );
      // Small XP bonus for achievements
      const profile = storage.getUserProfile();
      profile.xp += 25;
      profile.level = Math.floor(profile.xp / 200) + 1;
      profile.lastActivityDate = Date.now();
      storage.saveUserProfile(profile);
      return true;
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      return false;
    }
  },

  // Clear all data
  clear: () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },

  // Export data
  exportData: () => {
    const data = {
      progress: storage.getAllProgress(),
      profile: storage.getUserProfile(),
      snippets: storage.getAllSnippets(),
      settings: storage.getSettings(),
      exportedAt: Date.now(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import data
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.progress) {
        localStorage.setItem(`${STORAGE_PREFIX}progress`, JSON.stringify(data.progress));
      }
      if (data.profile) {
        localStorage.setItem(`${STORAGE_PREFIX}profile`, JSON.stringify(data.profile));
      }
      if (data.snippets) {
        localStorage.setItem(`${STORAGE_PREFIX}snippets`, JSON.stringify(data.snippets));
      }
      if (data.settings) {
        localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(data.settings));
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },
};

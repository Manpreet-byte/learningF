import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { PrivateRoute } from './PrivateRoute';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { LessonsPage } from '../pages/LessonsPage';
import { LessonDetailPage } from '../pages/LessonDetailPage';
import { PlaygroundPage } from '../pages/PlaygroundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AchievementsPage } from '../pages/AchievementsPage';
import TheoryPage from '../pages/TheoryPage';
import { HTMLEditorPage } from '../pages/HTMLEditorPage';
import { CSSEditorPage } from '../pages/CSSEditorPage';
import { JavaScriptEditorPage } from '../pages/JavaScriptEditorPage';
import { storage } from '../utils/storage';
import './App.css';

export const App = () => {
  const { user } = useAuth();

  useEffect(() => {
    const { theme } = storage.getSettings();
    const cls = theme === 'dark' ? 'theme-dark' : 'theme-light';
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(cls);
  }, [user]);
  
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons"
            element={
              <PrivateRoute>
                <LessonsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <PrivateRoute>
                <LessonDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/playground"
            element={
              <PrivateRoute>
                <PlaygroundPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <PrivateRoute>
                <AchievementsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/theory"
            element={
              <PrivateRoute>
                <TheoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/html-editor"
            element={
              <PrivateRoute>
                <HTMLEditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/css-editor"
            element={
              <PrivateRoute>
                <CSSEditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/js-editor"
            element={
              <PrivateRoute>
                <JavaScriptEditorPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

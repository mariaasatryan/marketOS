import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppConfigProvider } from './contexts/AppConfigContext';
import { Login } from './components/Login';
import { LayoutDraggable } from './components/LayoutDraggable';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { NotificationCenter } from './components/NotificationCenter';
import Dashboard from './pages/Dashboard';
import { InboxPage } from './pages/InboxPage';
import { Reviews } from './pages/Reviews';
import { AlertsPage } from './pages/AlertsPage';
import { Settings } from './pages/Settings';
import { pwaService } from './services/pwaService';
import { notificationService } from './services/notificationService';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await pwaService.initialize();
        await notificationService.initialize();
      } catch (e) {
        // ignore
      }
    };
    init();
  }, []);

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inbox':
        return <InboxPage />;
      case 'reviews':
        return <Reviews />;
      case 'alerts':
        return <AlertsPage />;
      case 'settings':
        return <Settings isEditMode={isEditMode} setIsEditMode={setIsEditMode} />;
      default:
        return <Dashboard />;
    }
  }, [currentPage, isEditMode]);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Загрузка..." />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }


  return (
    <>
      <LayoutDraggable 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isEditMode={isEditMode}
        onShowNotifications={setShowNotifications}
      >
        {renderPage()}
      </LayoutDraggable>
      
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <AppConfigProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </AppConfigProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

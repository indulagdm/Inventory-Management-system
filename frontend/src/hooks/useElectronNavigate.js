// src/hooks/useElectronNavigation.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useElectronNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigation = (event, route) => {
      console.log('Navigating to:', route);
      navigate(route);
    };

    if (window.electronAPI) {
      window.electronAPI.onNavigateTo(handleNavigation);
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeNavigateListener(handleNavigation);
      }
    };
  }, [navigate]);
};
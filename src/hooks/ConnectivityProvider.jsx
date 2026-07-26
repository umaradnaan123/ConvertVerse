import { useState, useEffect, useRef } from 'react';
import { ConnectivityContext } from './ConnectivityContext';

export function ConnectivityProvider({ children }) {
  const [isOnline, setIsOnline] = useState(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [toastState, setToastState] = useState({ visible: false, type: 'online' });
  const reconnectListeners = useRef([]);

  const registerReconnectListener = (callback) => {
    if (typeof callback === 'function' && !reconnectListeners.current.includes(callback)) {
      reconnectListeners.current.push(callback);
    }
  };

  const unregisterReconnectListener = (callback) => {
    reconnectListeners.current = reconnectListeners.current.filter((cb) => cb !== callback);
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastState({ visible: true, type: 'online' });
      
      // Execute all registered reconnect listeners
      reconnectListeners.current.forEach((cb) => {
        try {
          cb();
        } catch (err) {
          console.error('Failed to run reconnect listener:', err);
        }
      });
      
      // Auto-hide online toast after 4 seconds
      const timer = setTimeout(() => {
        setToastState(prev => prev.type === 'online' ? { ...prev, visible: false } : prev);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastState({ visible: true, type: 'offline' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const hideToast = () => {
    setToastState(prev => ({ ...prev, visible: false }));
  };

  return (
    <ConnectivityContext.Provider value={{ 
      isOnline, 
      toastState, 
      hideToast, 
      registerReconnectListener, 
      unregisterReconnectListener 
    }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

const BackButtonHandler: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    let removeListener: (() => void) | undefined;

    const addListener = async () => {
      const handler = await CapacitorApp.addListener('backButton', () => {
        if (location.pathname === '/' || location.pathname === '/home') {
          CapacitorApp.exitApp();
        } else {
          history.goBack();
        }
      });

      // Guardamos función para limpiar
      removeListener = handler.remove;
    };

    addListener();

    return () => {
      if (removeListener) removeListener();
    };
  }, [location, history]);

  return null;
};

export default BackButtonHandler;


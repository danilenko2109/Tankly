import React, { useEffect, useState } from 'react';
import './TanklyLoadingScreen.scss';

const TanklyLoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="tankly-loader">
      <div className="loader-container">
        <div className="spinner-wrapper">
          <div className="spinner-ring"></div>
          <div className="fuel-center">
            <div className="fuel-drop"></div>
          </div>
        </div>
        
        <h1 className="app-name">Tankly</h1>
        <p className="loading-status">Загрузка приложения...</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TanklyLoadingScreen;
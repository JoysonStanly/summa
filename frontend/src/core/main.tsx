import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/index.css'

import App from './App'
import MobileBlocker from '@shared/components/MobileBlocker';


function isMobileOrSmallScreen() {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(ua)) {
      return true;
    }
  }
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 768) {
      return true;
    }
  }
  return false;
}


import React, { useEffect, useState } from 'react';

const Root: React.FC = () => {
  const [blocked, setBlocked] = useState(isMobileOrSmallScreen());

  useEffect(() => {
    const handleResize = () => {
      setBlocked(isMobileOrSmallScreen());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return blocked ? <MobileBlocker /> : <App />;
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

// Layout.tsx
import React, { ReactNode } from 'react';
import BackgroundEffects from './BackgroundEffects';
import styles from './Layout.module.css';
import HeaderBanners from '../../core/HeaderBanner';
import MenuPrincipal from '../MenuPrincipal/MenuPrincipal';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showMenu?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeader = true, 
  showMenu = true 
}) => {
  return (
    <div className={styles.layout}>
      {showHeader && <HeaderBanners />}
      <BackgroundEffects />
      {showMenu && <MenuPrincipal />}
      
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

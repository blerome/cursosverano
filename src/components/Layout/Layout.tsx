import React, { ReactNode } from 'react';
import BackgroundEffects from './BackgroundEffects';
import styles from './Layout.module.css';
import HeaderBanners from '../../core/HeaderBanner';
import MenuPrincipal from '../MenuPrincipal/MenuPrincipal';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
    <HeaderBanners/>
      <BackgroundEffects />
  <MenuPrincipal/>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
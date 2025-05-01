import React, { useEffect } from 'react';
import styles from './BackgroundEffects.module.css';

const BackgroundEffects: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('premiumEffects');
    
    // Crear líneas dinámicas con mayor contraste
    for (let i = 0; i < 15; i++) {
      const line = document.createElement('div');
      line.classList.add(styles.dynamicLine);
      line.style.top = `${Math.random() * 100}%`;
      line.style.left = `${Math.random() * 100}%`;
      line.style.width = `${Math.random() * 500 + 200}px`;
      line.style.transform = `rotate(${Math.random() * 180 - 90}deg)`;
      line.style.animationDuration = `${Math.random() * 15 + 10}s`;
      line.style.animationDelay = `${Math.random() * 8}s`;
      // Añadir brillo y contraste
      line.style.opacity = '0.7';
      line.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.6)';
      container?.appendChild(line);
    }

    // Crear ondas con mayor visibilidad
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.classList.add(styles.wave);
      wave.style.top = `${15 + (i * 30)}%`;
      wave.style.animationDuration = `${30 + (i * 5)}s`;
      wave.style.animationDelay = `${i * 3}s`;
      // Mejorar visibilidad
      wave.style.borderColor = `rgba(255, 255, 255, ${0.4 + i * 0.2})`;
      wave.style.boxShadow = `0 0 15px rgba(255, 255, 255, ${0.3 + i * 0.1})`;
      container?.appendChild(wave);
    }

    // Crear puntos de conexión más brillantes
    const positions = [
      [15, 20], [75, 15], [40, 65], 
      [85, 55], [10, 80], [60, 35], 
      [25, 25], [90, 70], [50, 50],
      [30, 75], [70, 30], [20, 45]
    ];
    
    positions.forEach((pos, index) => {
      const dot = document.createElement('div');
      dot.classList.add(styles.connectionDot);
      dot.style.left = `${pos[0]}%`;
      dot.style.top = `${pos[1]}%`;
      dot.style.animationDuration = `${5 + (index % 3)}s`;
      dot.style.animationDelay = `${Math.random() * 4}s`;
      // Añadir brillo y efecto de neón
      dot.style.boxShadow = `0 0 10px 3px rgba(255, 255, 255, 0.7)`;
      container?.appendChild(dot);
    });

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);

  return <div id="premiumEffects" className={styles.premiumEffects}></div>;
};

export default BackgroundEffects;
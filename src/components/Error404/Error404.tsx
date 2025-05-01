import React, { useEffect, useState } from 'react';
import styles from './Error404.module.css';
import Tucatin from './Tucantin.png';

interface Error404Props {
  imagePath?: string;
  imageAlt?: string;
  homeLink?: string;
  homeLinkText?: string;
}

const RANDOM_CHARS = '!@#$%&*?¿¡=+-_/\\<>[]{}';
const MESSAGE_404 = '404';
const MESSAGE_TEXT = 'Página no encontrada';

const Error404: React.FC<Error404Props> = ({
  imagePath = Tucatin,
  imageAlt = 'Error illustration',
  homeLink = '/',
  homeLinkText = 'Volver al inicio'
}) => {
  const [displayText404, setDisplayText404] = useState('');
  const [displayTextMessage, setDisplayTextMessage] = useState('');

  useEffect(() => {
    // Efecto para el texto "404"
    let interval404: NodeJS.Timeout;
    const timeout404 = setTimeout(() => {
      let iterations = 0;
      const targetText = MESSAGE_404;
      
      interval404 = setInterval(() => {
        setDisplayText404(targetText
          .split('')
          .map((_, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
          })
          .join('')
        );

        if (iterations >= targetText.length) clearInterval(interval404);
        iterations += 1;
      }, 100);
    }, 500);

    // Efecto para el texto "Página no encontrada"
    let intervalMessage: NodeJS.Timeout;
    const timeoutMessage = setTimeout(() => {
      let iterations = 0;
      const targetText = MESSAGE_TEXT;
      
      intervalMessage = setInterval(() => {
        setDisplayTextMessage(targetText
          .split('')
          .map((_, index) => {
            if (index < iterations) {
              return targetText[index];
            }
            return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
          })
          .join('')
        );

        if (iterations >= targetText.length) clearInterval(intervalMessage);
        iterations += 1;
      }, 100);
    }, 1500);

    return () => {
      clearTimeout(timeout404);
      clearTimeout(timeoutMessage);
      clearInterval(interval404);
      clearInterval(intervalMessage);
    };
  }, []);

  return (
    <main className={styles.appShell}>
      <div className={styles.container}>
        <a href={homeLink} className={styles.returnLink}>
          {homeLinkText}
        </a>
        <img 
          src={imagePath} 
          alt={imageAlt}
          className={styles.errorImage}
        />
        <h1 className={styles.errorCode}>
          {displayText404 || '\u00A0'}
        </h1>
        <h1 className={styles.errorMessage}>
          {displayTextMessage || '\u00A0'}
        </h1>
      </div>
    </main>
  );
};

export default Error404;
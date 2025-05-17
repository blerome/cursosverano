import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './ActionButtons.module.css'; // Asegúrate de crear este archivo CSS

interface ActionButtonsProps {
  available: boolean;
  onEnrollClick: () => void;
  onViewDetails: () => void;
}

const ActionButtons = ({ available, onEnrollClick, onViewDetails }: ActionButtonsProps) => {
  return (
    <ul className={styles.sci}>
      <li>
        <button
          onClick={onEnrollClick}
          className={styles.inscripcion}
          disabled={!available}
        >
          <FontAwesomeIcon icon={faUserPlus} />
        </button>
      </li>
      <li>
        <button
          onClick={onViewDetails}
          className={styles.detalles}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
      </li>
    </ul>
  );
};

export default ActionButtons;
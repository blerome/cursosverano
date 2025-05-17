import React, { useState } from 'react';
import styles from './ModalInscripcion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCheckCircle, faTimesCircle, faArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface ModalInscripcionProps {
  cursoId: number;
  nombreCurso: string;
  onClose: () => void;
  onInscribir: (datos: { numeroControl: string; telefono: string }) => Promise<void>;
}

const ModalInscripcion: React.FC<ModalInscripcionProps> = ({ 
  cursoId, 
  nombreCurso, 
  onClose, 
  onInscribir 
}) => {
  // Estados del componente
  const [paso, setPaso] = useState<'terminos' | 'formulario' | 'exito'>('terminos');
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    numeroControl: '',
    telefono: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manejadores de eventos
  const manejarCambioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarEnviarFormulario = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    
    try {
      await onInscribir(datosFormulario);
      setPaso('exito'); // Cambiar a pantalla de éxito
    } catch (err) {
      setError('Ocurrió un error al procesar la inscripción. Por favor intenta nuevamente.');
      console.error('Error en inscripción:', err);
    } finally {
      setCargando(false);
    }
  };

  // Renderizado condicional por pasos
  const renderizarContenido = () => {
    switch(paso) {
      case 'terminos':
        return (
          <div className={styles.contenidoTerminos}>
            <div className={styles.encabezado}>
              <h2>
                <FontAwesomeIcon icon={faFileAlt} className={styles.icono} />
                Inscribirse al curso: {nombreCurso}
              </h2>
            </div>
            
            <div className={styles.contenedorTerminos}>
              <p className={styles.textoTerminos}>
                He leído el reglamento para la apertura e inscripción a cursos de verano del 
                Instituto Tecnológico de Cancún, lo cual estoy conciente y acepto los 
                términos y condiciones.
              </p>
              
              <a 
                href="/reglamento-estudiante" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.enlaceReglamento}
              >
                Leer reglamento completo
              </a>
            </div>

            <div className={styles.contenedorAceptacion}>
              <label className={styles.etiquetaCheckbox}>
                <input
                  type="checkbox"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                  className={styles.checkbox}
                />
                Acepto los términos y condiciones
              </label>
            </div>

            <div className={styles.contenedorBotones}>
              <button 
                type="button"
                onClick={onClose}
                className={`${styles.boton} ${styles.botonCancelar}`}
              >
                <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
              </button>
              
              <button
                type="button"
                onClick={() => setPaso('formulario')}
                disabled={!terminosAceptados}
                className={`${styles.boton} ${styles.botonContinuar}`}
              >
                <FontAwesomeIcon icon={faCheckCircle} /> Continuar
              </button>
            </div>
          </div>
        );

      case 'formulario':
        return (
          <form onSubmit={manejarEnviarFormulario} className={styles.contenidoFormulario}>
            <div className={styles.encabezado}>
              <h2>Datos de Inscripción</h2>
              <p className={styles.subtitulo}>Curso: {nombreCurso}</p>
            </div>

            {error && <div className={styles.mensajeError}>{error}</div>}

            <div className={styles.grupoFormulario}>
              <label htmlFor="numeroControl" className={styles.etiqueta}>
                Número de Control:
              </label>
              <input
                type="text"
                id="numeroControl"
                name="numeroControl"
                value={datosFormulario.numeroControl}
                onChange={manejarCambioInput}
                className={styles.input}
                required
                pattern="[0-9]{8}"
                title="Ingresa tu número de control de 8 dígitos"
              />
            </div>

            <div className={styles.grupoFormulario}>
              <label htmlFor="telefono" className={styles.etiqueta}>
                Teléfono:
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={datosFormulario.telefono}
                onChange={manejarCambioInput}
                className={styles.input}
                required
                pattern="[0-9]{10}"
                title="Ingresa un número de teléfono válido de 10 dígitos"
              />
            </div>

            <div className={styles.contenedorBotones}>
              <button
                type="button"
                onClick={() => setPaso('terminos')}
                className={`${styles.boton} ${styles.botonRegresar}`}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> Regresar
              </button>
              
              <button
                type="submit"
                disabled={cargando}
                className={`${styles.boton} ${styles.botonConfirmar}`}
              >
                {cargando ? 'Procesando...' : 'Confirmar Inscripción'}
              </button>
            </div>
          </form>
        );

      case 'exito':
        return (
          <div className={styles.contenidoExito}>
            <FontAwesomeIcon icon={faCircleCheck} className={styles.iconoExito} />
            <h2>¡Inscripción Exitosa!</h2>
            <p>Te has inscrito correctamente al curso:</p>
            <p className={styles.nombreCurso}>{nombreCurso}</p>
            <button
              onClick={onClose}
              className={styles.botonCerrarExito}
            >
              Cerrar
            </button>
          </div>
        );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {paso !== 'exito' && (
          <button onClick={onClose} className={styles.botonCerrar}>
            &times;
          </button>
        )}
        {renderizarContenido()}
      </div>
    </div>
  );
};

export default ModalInscripcion;
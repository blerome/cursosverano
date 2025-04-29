import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import styles from './AdminPage.module.css';

interface CourseFormData {
  carrera: string;
  materia: string;
  horario: string;
  creditos: number;
  imagen: string;
  whatsapp: string;
  cupo: number;
  descripcion: string;
  clave: string;
}

interface Carrera {
  id: string;
  nombre: string;
}

interface Materia {
  id: string;
  nombre: string;
  creditos: number;
  imagen: string;
  clave: string;
}

const AdminPage: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>({
    carrera: "",
    materia: "",
    horario: "",
    creditos: 0,
    imagen: "",
    whatsapp: "",
    cupo: 30,
    descripcion: "",
    clave: ""
  });

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);

  // Cargar carreras desde Firestore
  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const q = query(collection(db, 'carreras'));
        const querySnapshot = await getDocs(q);
        
        const carrerasData: Carrera[] = [];
        querySnapshot.forEach((doc) => {
          carrerasData.push({
            id: doc.id,
            nombre: doc.data().nombre
          });
        });
        
        setCarreras(carrerasData);
        if (carrerasData.length > 0) {
          setFormData(prev => ({
            ...prev,
            carrera: carrerasData[0].id
          }));
        }
      } catch (error) {
        console.error('Error al cargar carreras:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCarreras();
  }, []);

  // Cargar materias cuando cambia la carrera seleccionada
  useEffect(() => {
    const fetchMaterias = async () => {
      if (!formData.carrera) return;
      
      try {
        const materiasRef = collection(db, `carreras/${formData.carrera}/materias`);
        const q = query(materiasRef);
        const querySnapshot = await getDocs(q);
        
        const materiasData: Materia[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          materiasData.push({
            id: doc.id,
            nombre: data.nombre,
            creditos: data.creditos,
            imagen: data.imagen,
            clave: data.clave
          });
        });
        
        setMaterias(materiasData);
        // Resetear campos relacionados con la materia
        setFormData(prev => ({
          ...prev,
          materia: "",
          creditos: 0,
          imagen: "",
          clave: ""
        }));
        setPreviewImage('');
      } catch (error) {
        console.error('Error al cargar materias:', error);
      }
    };

    fetchMaterias();
  }, [formData.carrera]);

  const handleCarreraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const carreraId = e.target.value;
    setFormData(prev => ({
      ...prev,
      carrera: carreraId,
      materia: "",
      creditos: 0,
      imagen: "",
      clave: ""
    }));
    setPreviewImage('');
  };

  const handleMateriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const materiaId = e.target.value;
    const materiaSeleccionada = materias.find(m => m.id === materiaId);
    
    if (materiaSeleccionada) {
      setFormData(prev => ({
        ...prev,
        materia: materiaSeleccionada.nombre,
        creditos: materiaSeleccionada.creditos,
        imagen: materiaSeleccionada.imagen,
        clave: materiaSeleccionada.clave
      }));

      setPreviewImage(materiaSeleccionada.imagen);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cupo' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'courses'), {
        ...formData,
        nombre: formData.materia,
        inscritos: 0,
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        // Resetear formulario pero mantener la carrera seleccionada
        setFormData(prev => ({
          ...prev,
          materia: "",
          horario: "",
          creditos: 0,
          imagen: "",
          whatsapp: "",
          cupo: 30,
          descripcion: "",
          clave: ""
        }));
        setPreviewImage('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      alert('Error al guardar el curso');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando datos iniciales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <a href="/" className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} /> Volver a cursos
        </a>
        <h1>Crear Nuevo Curso</h1>
        <p className={styles.subtitle}>Complete todos los campos para registrar un nuevo curso</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.courseForm}>
        {/* Sección Carrera */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Información de Carrera</h2>
          
          <div className={styles.radioGroupContainer}>
            <label className={styles.sectionLabel}>Seleccione la carrera:</label>
            <div className={styles.radioGrid}>
              {carreras.map((carrera) => (
                <div key={carrera.id} className={styles.radioOption}>
                  <input
                    type="radio"
                    id={`carrera-${carrera.id}`}
                    name="carrera"
                    value={carrera.id}
                    checked={formData.carrera === carrera.id}
                    onChange={handleCarreraChange}
                    className={styles.radioInput}
                  />
                  <label htmlFor={`carrera-${carrera.id}`} className={styles.radioLabel}>
                    {carrera.nombre.split(' ').map(word => word[0]).join('') === 'Ing' ? 
                     carrera.nombre.replace('Ingeniería', 'Ing.') : 
                     carrera.nombre.replace('Licenciatura', 'Lic.')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="materia" className={styles.inputLabel}>
              Materia <span className={styles.required}>*</span>
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="materia"
                value={formData.materia}
                onChange={handleMateriaChange}
                required
                className={styles.formSelect}
                disabled={!formData.carrera || materias.length === 0}
              >
                <option value="">-- Seleccione una materia --</option>
                {materias.map(materia => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección Detalles del Curso */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Detalles del Curso</h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="clave" className={styles.inputLabel}>
                Clave
              </label>
              <input
                type="text"
                id="clave"
                name="clave"
                value={formData.clave}
                readOnly
                className={`${styles.formInput} ${styles.readOnlyInput}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="horario" className={styles.inputLabel}>
                Horario <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="horario"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                placeholder="Ej: Lun-Vie 9:00-12:00"
                required
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="creditos" className={styles.inputLabel}>
                Créditos
              </label>
              <input
                type="number"
                id="creditos"
                name="creditos"
                value={formData.creditos}
                readOnly
                className={`${styles.formInput} ${styles.readOnlyInput}`}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cupo" className={styles.inputLabel}>
                Cupo Máximo <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="cupo"
                name="cupo"
                value={formData.cupo}
                onChange={handleChange}
                min="1"
                max="30"
                required
                className={styles.formInput}
              />
            </div>
          </div>

          {previewImage && (
            <div className={styles.previewContainer}>
              <div className={styles.previewHeader}>
                <label className={styles.inputLabel}>Vista previa de la imagen</label>
              </div>
              <img 
                src={previewImage} 
                alt="Vista previa de la imagen" 
                className={styles.previewImage}
              />
            </div>
          )}
        </div>

        {/* Sección Información Adicional */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Información Adicional</h2>
          
          <div className={styles.formGroup}>
            <label htmlFor="whatsapp" className={styles.inputLabel}>
              Enlace al Grupo de WhatsApp <span className={styles.required}>*</span>
            </label>
            <input
              type="url"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="https://chat.whatsapp.com/..."
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descripcion" className={styles.inputLabel}>
              Descripción del Curso <span className={styles.required}>*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              required
              className={styles.formTextarea}
              placeholder="Describa los objetivos, contenidos y requisitos del curso..."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || !formData.materia}
          >
            {loading ? (
              <span className={styles.buttonLoading}>
                <span className={styles.spinner}></span>
                Guardando...
              </span>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                Guardar Curso
              </>
            )}
          </button>

          {success && (
            <div className={styles.successMessage}>
              <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
              ¡Curso registrado exitosamente!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
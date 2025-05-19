import { FaPlus } from 'react-icons/fa';
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './NewProjectPage.module.css';

interface FormData {
  nombre: string;
  paterno: string;
  materno: string;
  noControl: string;
  telefono: string;
  fecha: string;
  clave: string;
  materia: string;
  horario: string;
  turno: string;
  plan: string;
  motivo: string;
}

const NewProjectPage = () => {
  const [selectedCareer, setSelectedCareer] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    paterno: '',
    materno: '',
    noControl: '',
    telefono: '',
    fecha: '',
    clave: '',
    materia: '',
    horario: '',
    turno: '',
    plan: '',
    motivo: ''
  });

  // Datos de las carreras y sus materias
  const careers: Record<string, string[]> = {
    'Turismo': ['Turismo y Hotelería', 'Patrimonio Cultural', 'Gestión Turística'],
    'Ingeniería en Sistemas': ['Programación', 'Bases de Datos', 'Redes'],
    'Electromecánica': ['Mecánica Industrial', 'Electricidad', 'Termodinámica'],
    'Ferroviaria': ['Infraestructura Ferroviaria', 'Operaciones', 'Logística'],
    'Civil': ['Estructuras', 'Construcción', 'Topografía'],
    'Administración': ['Contabilidad', 'Recursos Humanos', 'Mercadotecnia'],
    'Ingeniería en Administración': ['Gestión Empresarial', 'Finanzas', 'Proyectos'],
    'Contador Público': ['Contabilidad', 'Auditoría', 'Fiscal'],
    'Industrial': ['Procesos', 'Calidad', 'Logística'],
    'Mecatrónica': ['Robótica', 'Automatización', 'Control'],
    'Química': ['Química Orgánica', 'Bioquímica', 'Análisis Instrumental']
  };

  // Generar clave automática
  const generateCode = (): string => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${randomLetter}${randomNumber}`;
  };

  const handleCareerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const career = e.target.value;
    setSelectedCareer(career);
    
    // Actualizar clave cuando se selecciona carrera
    setFormData({
      ...formData,
      clave: generateCode(),
      materia: '', // Reset materia al cambiar carrera
      turno: '', // Reset turno al cambiar carrera
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Datos enviados:', formData);
    alert('Curso de verano creado exitosamente!');
  };

  return (
    <div className={styles.contentPage}>
      <div className={styles.pageContent}>
        <FaPlus className={styles.pageIcon} />
        <h1 className={styles.pageTitle}>Crear nuevo curso de verano</h1>
        
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          {/* Selección de carrera */}
          <div className={styles.formSection}>
            <h2>Selecciona tu carrera:</h2>
            <div className={styles.radioGroup}>
              {Object.keys(careers).map((career) => (
                <label key={career} className={styles.radioOption}>
                  <input
                    type="radio"
                    name="career"
                    value={career}
                    checked={selectedCareer === career}
                    onChange={handleCareerChange}
                  />
                  {career}
                </label>
              ))}
            </div>
          </div>

          {/* Información personal */}
          <div className={styles.formSection}>
            <h2>Información Personal</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Nombre(s):</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Apellido Paterno:</label>
                <input
                  type="text"
                  name="paterno"
                  value={formData.paterno}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Apellido Materno:</label>
                <input
                  type="text"
                  name="materno"
                  value={formData.materno}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Número de Control:</label>
                <input
                  type="text"
                  name="noControl"
                  value={formData.noControl}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Información académica */}
          {selectedCareer && (
            <div className={styles.formSection}>
              <h2>Información Académica</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Clave:</label>
                  <input
                    type="text"
                    name="clave"
                    value={formData.clave}
                    readOnly
                    className={styles.readOnly}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Materia:</label>
                  <select
                    name="materia"
                    value={formData.materia}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una materia</option>
                    {careers[selectedCareer].map((materia) => (
                      <option key={materia} value={materia}>{materia}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Horario (HH:MM:SS - HH:MM:SS):</label>
                  <input
                    type="text"
                    name="horario"
                    value={formData.horario}
                    onChange={handleInputChange}
                    placeholder="07:00:00 - 12:00:00"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Turno:</label>
                  <select
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona turno</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Plan:</label>
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Motivo:</label>
                  <textarea
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Crear Curso
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;
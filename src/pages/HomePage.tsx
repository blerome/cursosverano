import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faUsers, 
  faCalendarAlt, 
  faCertificate,
  faArrowRight,
  faBookOpen,
  faLaptopCode,
  faChartLine,
  faStar,
  faQuoteLeft,
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import styles from './HomePage.module.css';
import OpenClassesSection from './home/components/OpenClassesSection';

const HomePage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: faGraduationCap,
      title: "Educación de Calidad",
      description: "Programas académicos reconocidos por su excelencia y pertinencia en el mercado laboral."
    },
    {
      icon: faLaptopCode,
      title: "Tecnología Avanzada",
      description: "Laboratorios equipados con la última tecnología para una formación práctica integral."
    },
    {
      icon: faUsers,
      title: "Comunidad Estudiantil",
      description: "Únete a una comunidad vibrante de estudiantes comprometidos con su crecimiento profesional."
    },
    {
      icon: faChartLine,
      title: "Crecimiento Profesional",
      description: "Desarrolla las habilidades que demanda el mercado laboral actual y futuro."
    }
  ];

  const stats = [
    { number: "15,000+", label: "Estudiantes Activos" },
    { number: "50+", label: "Programas Académicos" },
    { number: "25", label: "Años de Experiencia" },
    { number: "95%", label: "Empleabilidad" }
  ];

  const testimonials = [
    {
      name: "María González",
      career: "Ingeniería en Sistemas",
      text: "El ITC me brindó las herramientas necesarias para destacar en mi carrera profesional. La calidad educativa es excepcional."
    },
    {
      name: "Carlos Rodríguez",
      career: "Ingeniería Industrial",
      text: "Los profesores y las instalaciones del instituto superaron mis expectativas. Recomiendo totalmente estudiar aquí."
    },
    {
      name: "Ana Martínez",
      career: "Ingeniería en Gestión Empresarial",
      text: "La formación integral que recibí me permitió conseguir trabajo antes de graduarme. Excelente institución."
    }
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Instituto Tecnológico de Cancún
            </h1>
            <h2 className={styles.heroSubtitle}>
              Forjando el Futuro de la Tecnología
            </h2>
            <p className={styles.heroDescription}>
              Descubre una educación superior de excelencia en el corazón del Caribe Mexicano. 
              Únete a la comunidad de profesionales que están transformando el mundo con tecnología e innovación.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/classes" className={styles.primaryButton}>
                <FontAwesomeIcon icon={faGraduationCap} />
                Explorar Programas
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link to="/Reglamento-General" className={styles.secondaryButton}>
                <FontAwesomeIcon icon={faBookOpen} />
                Conocer Más
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.floatingCard}>
              <FontAwesomeIcon icon={faGraduationCap} className={styles.cardIcon} />
              <h3>Cursos de Verano {currentYear}</h3>
              <p>¡Inscripciones Abiertas!</p>
            </div>
          </div>
        </div>
        <div className={styles.heroWave}></div>
      </section>

      <OpenClassesSection />

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>¿Por qué elegir el ITC?</h2>
            <p className={styles.sectionSubtitle}>
              Descubre las ventajas de formar parte de nuestra comunidad educativa
            </p>
          </div>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FontAwesomeIcon icon={feature.icon} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lo que dicen nuestros estudiantes</h2>
            <p className={styles.sectionSubtitle}>
              Experiencias reales de quienes han confiado en nuestra educación
            </p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} />
                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorInfo}>
                    <h4 className={styles.authorName}>{testimonial.name}</h4>
                    <p className={styles.authorCareer}>{testimonial.career}</p>
                  </div>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className={styles.starIcon} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>¿Listo para comenzar tu futuro?</h2>
            <p className={styles.ctaDescription}>
              Únete a miles de estudiantes que ya están construyendo su carrera profesional con nosotros.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/classes" className={styles.ctaPrimaryButton}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                Ver Cursos Disponibles
              </Link>
              <Link to="/login" className={styles.ctaSecondaryButton}>
                <FontAwesomeIcon icon={faSignInAlt} />
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h3 className={styles.contactTitle}>Contáctanos</h3>
              <p className={styles.contactDescription}>
                ¿Tienes preguntas? Estamos aquí para ayudarte en tu camino hacia el éxito profesional.
              </p>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.contactIcon} />
                  <div>
                    <h4>Ubicación</h4>
                    <p>Av. Kabah Km. 3, Cancún, Quintana Roo</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <FontAwesomeIcon icon={faPhone} className={styles.contactIcon} />
                  <div>
                    <h4>Teléfono</h4>
                    <p>(998) 881-4400</p>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.contactIcon} />
                  <div>
                    <h4>Email</h4>
                    <p>informes@itcancun.edu.mx</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.contactVisual}>
              <div className={styles.campusImage}>
                <div className={styles.imageOverlay}>
                  <FontAwesomeIcon icon={faGraduationCap} className={styles.overlayIcon} />
                  <h4>Campus ITC</h4>
                  <p>Instalaciones modernas en el paraíso</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

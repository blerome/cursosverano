import React from 'react';
import styles from './ReglamentoEstudiante.module.css';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registramos los plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

const ReglamentoGeneral: React.FC = () => {
  const tucanRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLParagraphElement>(null);
  const wingsRef = useRef<SVGPathElement[]>([]);
  const beakRef = useRef<SVGPathElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const eyeRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Configuración inicial de animaciones
    const tucan = tucanRef.current;
    const content = contentRef.current;
    const arrowEl = arrowRef.current;
    const wings = wingsRef.current;
    const beak = beakRef.current;
    const body = bodyRef.current;
    const eye = eyeRef.current;

    if (!tucan || !content || !arrowEl || !wings.length || !beak || !body || !eye) return;

    gsap.set(wings, { transformOrigin: "center center" });
    gsap.set(beak, { transformOrigin: "left center" });
    gsap.set(body, { transformOrigin: "center center" });

    // Animación de alas
    const wingAnimation = gsap.timeline({
      repeat: -1,
      paused: true
    })
    .to(wings, {
      duration: 0.5,
      scaleY: 0.9,
      ease: "sine.inOut"
    })
    .to(wings, {
      duration: 0.5,
      scaleY: 1.1,
      ease: "sine.inOut"
    });

    // Animación del pico
    const beakAnimation = gsap.timeline({
      repeat: -1,
      paused: true,
      yoyo: true
    })
    .to(beak, {
      duration: 1,
      rotation: -3,
      ease: "sine.inOut"
    });

    // Animación del cuerpo (flotar)
    const floatAnimation = gsap.timeline({
      repeat: -1,
      paused: true
    })
    .to(tucan, {
      duration: 1,
      y: -15,
      ease: "sine.inOut",
      yoyo: true
    });

    // Animación de ojos (parpadeo ocasional)
    const blinkAnimation = gsap.timeline({
      repeat: -1,
      repeatDelay: 3,
      paused: true
    })
    .to(eye, {
      duration: 0.1,
      scaleY: 0.1,
      transformOrigin: "center center"
    })
    .to(eye, {
      duration: 0.1,
      scaleY: 1
    });

    // Integración con ScrollTrigger
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: `.${styles.page}`,
        scrub: true,
        start: "top top",
        end: "bottom bottom",
      }
    })
    .to(arrowEl, {
      opacity: 0,
      duration: 0.5
    }, 0)
    .fromTo(content, {
      xPercent: 0
    }, {
      xPercent: -66.66,
      ease: "none"
    }, 0)
    .fromTo(wingAnimation, {
      time: 0
    }, {
      time: 2,
      ease: "none"
    }, 0)
    .fromTo(floatAnimation, {
      time: 0
    }, {
      time: 2,
      ease: "none"
    }, 0)
    .fromTo(beakAnimation, {
      time: 0
    }, {
      time: 1,
      ease: "none"
    }, 0)
    .to(tucan, {
      x: -100,
      rotation: -5,
      ease: "none"
    }, 0);

    // Iniciar animación de parpadeo
    blinkAnimation.play();

    // Limpieza
    return () => {
      scrollTl.kill();
      wingAnimation.kill();
      beakAnimation.kill();
      floatAnimation.kill();
      blinkAnimation.kill();
      ScrollTrigger.getAll().forEach(instance => instance.kill());
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.page}></div>
      
      <div className={styles.content} ref={contentRef}>
        <div className={styles.contentSection}>
          <div>
            <h1>Aspirantes</h1>
            <p className={styles.justified}>
            La duración del Curso de Verano será equivalente al mismo número de horas que se imparten en un período semestral: 60, 75 y 90 horas según los créditos de la asignatura.
            </p>
            
            <p className={`${styles.arrowAnimated}`} ref={arrowRef}>↓</p>
          </div>
        </div>
        <div className={styles.contentSection}>
          <div>
            <h1>Requisitos</h1>
            <h2>Integrantes</h2>
            <p className={styles.justified}>
            Los grupos en Curso de Verano podrán formarse con un máximo de 30 alumnos
(as) y un mínimo de 15 por asignatura, considerando 5 lugares adicionales para los
alumnos(as) en movilidad, provenientes de otros Institutos Tecnológicos. 

            </p>
  
            <p className={styles.justified}>
            ✳Los objetivos y contenidos de las asignaturas impartidas en Cursos de Verano,
deberán ser cubiertos al 100% en un lapso de cuatro a seis semanas de clases
efectivas, incluyendo las evaluaciones, por lo que los Cursos de Verano iniciarán el
26 de Junio y finalizarán el 4 de Agosto del presente año.
            </p>
           
           
          </div>
        </div>
        <div className={styles.contentSection}>
          <div>
            <h1>Costos</h1>
            <p className={styles.justified}>
            El costo por alumno para los Cursos de Verano, dependerá del número de horas de
            la asignatura: 
            </p>
            <table>
        <tr>
            <th>TOTAL DE HORAS</th>
            <th>COSTO x ALUMNO</th>
        </tr>
        <tr>
            <td>60 HORAS</td>
            <td>$1,000.00</td>
        </tr>
        <tr>
            <td>75 HORAS</td>
            <td>$1,125.00</td>
        </tr>
        <tr>
            <td>90 HORAS</td>
            <td>$1,250.00</td>
        </tr>
    </table>
            <p className={styles.justified}>
            Cubrir la cuota correspondiente.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.animationContainer}>
        <svg 
          ref={tucanRef}
          version="1.1" 
          viewBox="0 0 366.766 366.766" 
          className={styles.tucan}
        >
          <g>
            <g>
              <path className={styles.perch} d="M205.791,279.735c-0.365-1.787-1.945-3.131-3.841-3.131h-5.485c-2.164,0-3.919,1.756-3.919,3.92 c0,2.167,1.755,3.922,3.919,3.922h1.564v6.97c0,2.166,1.756,3.921,3.921,3.921c2.166,0,3.921-1.755,3.921-3.921v-10.892 C205.871,280.255,205.843,279.991,205.791,279.735z"></path>
              <g>
                <path className={styles.perch} d="M197.95,279.735c-0.365-1.787-1.946-3.131-3.841-3.131h-5.484c-2.166,0-3.921,1.756-3.921,3.92 c0,2.167,1.755,3.922,3.921,3.922h1.563v6.97c0,2.166,1.755,3.921,3.921,3.921s3.92-1.755,3.92-3.921v-10.892 C198.029,280.255,198.003,279.991,197.95,279.735z"></path>
              </g>
              <path className={styles.perch} d="M190.109,279.735c-0.366-1.787-1.946-3.131-3.842-3.131h-5.483c-2.166,0-3.921,1.756-3.921,3.92 c0,2.167,1.755,3.922,3.921,3.922h1.564v6.97c0,2.166,1.755,3.921,3.919,3.921c2.166,0,3.921-1.755,3.921-3.921v-10.892 C190.188,280.255,190.16,279.991,190.109,279.735z"></path>
            </g>
            <path 
              ref={el => wingsRef.current[0] = el!}
              className={styles.wing} 
              d="M183.535,217.635c-19.753,0-35.763-16.01-35.763-35.764c0-19.751,16.011-35.762,35.763-35.761 h102.684c0,39.5-32.023,71.523-71.526,71.525L183.535,217.635L183.535,217.635z"
            ></path>
            <path 
              ref={bodyRef}
              className={styles.body} 
              d="M77.149,340.034c71.61,0,129.663-58.052,129.663-129.663V26.731 c-71.61,0-129.662,58.052-129.662,129.663"
            ></path>
            <path 
              className={styles.body} 
              d="M77.149,340.034c71.61,0,129.663-58.052,129.663-129.663V26.731 c-71.61,0-129.662,58.052-129.662,129.663"
            ></path>
            <path 
              className={styles.body} 
              d="M77.149,340.034H0l77.149-77.148l0.001-106.491c0-71.611,58.052-129.663,129.662-129.663v183.64 C206.811,281.982,148.759,340.034,77.149,340.034"
            ></path>
            <path 
              ref={el => wingsRef.current[1] = el!}
              className={styles.wing} 
              d="M140.582,106.708c0,24.53,13.344,45.928,33.16,57.374v48.189c0,19.131,9.347,36.069,23.714,46.528 l0,0c6.302-15.125,9.355-30.761,9.355-48.429V40.479C170.234,40.479,140.582,70.13,140.582,106.708z"
            ></path>
            <path 
              ref={el => wingsRef.current[2] = el!}
              className={styles.wing} 
              d="M107.085,219.146c19.753,0,35.764-16.011,35.764-35.764c0-19.751-16.011-35.763-35.764-35.762H4.403 c0,39.501,32.022,71.523,71.525,71.525h31.157V219.146z"
            ></path>
            <circle 
              ref={eyeRef}
              className={styles.eye} 
              cx="176.863" 
              cy="81.613" 
              r="8.256"
            ></circle>
            <g>
              <path 
                ref={beakRef}
                className={styles.beak} 
                d="M366.766,106.708c0-44.17-35.807-79.977-79.977-79.977h-79.978v79.977H366.766z"
              ></path>
              <path 
                className={styles.beak} 
                d="M343.61,50.439c-16.964,9.549-28.429,27.715-28.429,48.568c0,2.614,0.193,5.182,0.541,7.7h51.043 C366.766,84.764,357.922,64.89,343.61,50.439z"
              ></path>
              <rect 
                className={styles.beak} 
                x="206.811" 
                y="106.708" 
                width="159.954" 
                height="13.447"
              ></rect>
            </g>
            <g>
              <path className={styles.feet} d="M190.108,279.735c-0.365-1.787-1.946-3.131-3.841-3.131h-5.485c-2.164,0-3.919,1.756-3.919,3.92 c0,2.167,1.755,3.922,3.919,3.922h1.564v6.97c0,2.166,1.756,3.921,3.921,3.921c2.166,0,3.921-1.755,3.921-3.921v-10.892 C190.188,280.255,190.16,279.991,190.108,279.735z"></path>
              <g>
                <path className={styles.feet} d="M182.268,279.735c-0.366-1.787-1.947-3.131-3.841-3.131h-5.485c-2.166,0-3.921,1.756-3.921,3.92 c0,2.167,1.755,3.922,3.921,3.922h1.564v6.97c0,2.166,1.755,3.921,3.921,3.921c2.165,0,3.919-1.755,3.919-3.921v-10.892 C182.346,280.255,182.32,279.991,182.268,279.735z"></path>
              </g>
              <path className={styles.feet} d="M174.426,279.735c-0.366-1.787-1.946-3.131-3.842-3.131h-5.483c-2.166,0-3.921,1.756-3.921,3.92 c0,2.167,1.755,3.922,3.921,3.922h1.563v6.97c0,2.166,1.755,3.921,3.92,3.921c2.166,0,3.921-1.755,3.921-3.921v-10.892 C174.506,280.255,174.477,279.991,174.426,279.735z"></path>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ReglamentoGeneral;
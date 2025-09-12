import { useState, useEffect, useRef } from 'react';

interface Slide {
  id: number;
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
  description: string;
  location: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/principal-desplazamiento-1-optimizado.webp',
    alt: 'BLACK GYM - Área de entrenamiento con equipos profesionales de gimnasio en San Martín Jilotepeque',
    title: 'BLACK GYM',
    description: 'Tu destino para implementos de gimnasio y suplementación de alta calidad',
    location: 'San Martín Jilotepeque, Chimaltenango'
  },
  {
    id: 2,
    image: '/principal-desplazamiento-2-optimizado.webp',
    alt: 'BLACK GYM - Zona de entrenamiento funcional y equipos cardiovasculares',
    title: 'BLACK GYM',
    subtitle: '¡TRANSFORMA TU CUERPO!',
    description: 'Equipos profesionales y suplementación de calidad',
    location: 'San Martín Jilotepeque, Chimaltenango'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);

  // Auto slide functionality
  const startAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    stopAutoSlide();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
      }
    }
    startAutoSlide();
  };

  // Handle CTA button click
  const handleCTAClick = () => {
    const aboutSection = document.querySelector('#nosotros');
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Initialize auto slide
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  // Pause on mouse enter, resume on mouse leave
  const handleMouseEnter = () => stopAutoSlide();
  const handleMouseLeave = () => startAutoSlide();

  return (
    <section id="inicio" className="h-screen relative overflow-hidden bg-black">
      <div 
        className="hero-slider relative w-full h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full' 
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <img 
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>
            
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-center max-w-4xl px-10">
                <h1 className="text-6xl lg:text-8xl font-black mb-6 text-white text-shadow-lg uppercase tracking-wider">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i}>
                      {word === 'GYM' ? (
                        <span className="text-neon-green">{word}</span>
                      ) : (
                        word
                      )}
                      {i < slide.title.split(' ').length - 1 && ' '}
                    </span>
                  ))}
                </h1>
                
                {slide.subtitle && (
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-white uppercase tracking-wide">
                    {slide.subtitle}
                  </h2>
                )}
                
                <p className="text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto leading-relaxed">
                  {slide.description}
                </p>
                
                <button 
                  onClick={handleCTAClick}
                  className="bg-green-500 text-black text-lg font-black px-8 py-3 rounded-full hover:bg-green-400 hover:scale-105 transition-all duration-300 uppercase tracking-wide"
                >
                  {index === 0 ? 'DESCUBRE MÁS' : 'DESCUBRE MÁS'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              stopAutoSlide();
              goToSlide(index);
              startAutoSlide();
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              index === currentSlide
                ? 'bg-neon-green border-white shadow-neon scale-125'
                : 'bg-white bg-opacity-50 border-transparent hover:bg-neon-green hover:scale-110'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="text-3xl text-neon-green animate-bounce cursor-pointer"
             onClick={() => {
               const aboutSection = document.querySelector('#nosotros');
               if (aboutSection) {
                 aboutSection.scrollIntoView({ behavior: 'smooth' });
               }
             }}>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>
  );
}

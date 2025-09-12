import { useState, useEffect, useRef } from 'react';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#productos', label: 'Productos' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/#servicios', label: 'Servicios' },
  { href: '/#planes', label: 'Planes' },
  { href: '/#contacto', label: 'Contacto' }
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    closeMenu();
    
    // Si estamos en la página de la tienda, siempre navegamos a la URL directamente
    const isInShopPage = window.location.pathname.includes('/tienda');
    if (isInShopPage) {
      window.location.href = href;
      return;
    }
    
    // Handle different link types
    if (href.startsWith('/tienda') || href === '/') {
      // Direct navigation to pages
      window.location.href = href;
    } else if (href.startsWith('/#')) {
      // Navigate to home and scroll to section
      const sectionId = href.substring(2); // Remove '/#'
      if (window.location.pathname !== '/') {
        window.location.href = href;
      } else {
        // Already on homepage, just scroll
        setTimeout(() => {
          const target = document.querySelector(`#${sectionId}`);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 300);
      }
    } else {
      // For hash-only links (legacy)
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && 
        hamburgerRef.current &&
        !menuRef.current.contains(target) && 
        !hamburgerRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        ref={hamburgerRef}
        onClick={toggleMenu}
        className={`md:hidden flex flex-col cursor-pointer z-50 relative transition-all duration-300 ${
          isOpen ? 'hamburger-active' : ''
        }`}
        aria-label="Toggle navigation menu"
      >
        <span className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}></span>
        <span className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}></span>
        <span className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}></span>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-0 right-0 h-screen w-80 max-w-[80vw] bg-black z-50 transform transition-transform duration-300 ease-out border-l border-gray-800 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ maxHeight: '100vh', overflowY: 'auto' }}
      >
        <div className="pt-8 px-4 pb-8 bg-black">
          {/* Logo in mobile menu */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <img 
              src="/logo-principal-optimizado.webp" 
              alt="BLACK GYM Logo" 
              className="h-10 w-auto object-contain"
            />
            <div className="text-xl font-black text-white tracking-wider uppercase">
              BLACK <span className="text-neon-green">GYM</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith('/tienda') || item.href === '/' ? (
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="block w-full text-left py-3 px-4 text-gray-300 hover:text-neon-green hover:bg-gray-900 rounded-lg transition-all duration-300 text-lg font-medium"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left py-3 px-4 text-gray-300 hover:text-neon-green hover:bg-gray-900 rounded-lg transition-all duration-300 text-lg font-medium"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Carrito para móviles */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <a
              href="/carrito"
              onClick={closeMenu}
              className="flex items-center justify-between w-full py-3 px-4 text-gray-300 hover:text-neon-green hover:bg-gray-900 rounded-lg transition-all duration-300 text-lg font-medium"
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-shopping-cart"></i>
                <span>Mi Carrito</span>
              </div>
              {/* TODO: Agregar contador desde el store */}
              <i className="fas fa-chevron-right text-sm"></i>
            </a>
          </div>

          {/* Contact info in mobile menu */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-2">Ubicación:</p>
            <p className="text-neon-green font-semibold">
              <i className="fas fa-map-marker-alt mr-2"></i>
              San Martín Jilotepeque, Chimaltenango
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

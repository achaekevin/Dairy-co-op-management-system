import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  HiBeaker,
  HiSparkles,
  HiBars3,
  HiXMark,
  HiMoon,
  HiSun,
} from 'react-icons/hi2';
import LoginCard from '../../components/auth/LoginCard';
import HeroSection from '../../components/landing/HeroSection';
import AboutSection from '../../components/landing/AboutSection';
import ProductsSection from '../../components/landing/ProductsSection';
import DairyAnimalsSection from '../../components/landing/DairyAnimalsSection';
import ServicesSection from '../../components/landing/ServicesSection';
import WhyChooseUsSection from '../../components/landing/WhyChooseUsSection';
import TimelineSection from '../../components/landing/TimelineSection';
import StatisticsSection from '../../components/landing/StatisticsSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import GallerySection from '../../components/landing/GallerySection';
import NewsSection from '../../components/landing/NewsSection';
import FaqSection from '../../components/landing/FaqSection';
import ContactSection from '../../components/landing/ContactSection';
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.8)']);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'products', 'services', 'gallery', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMobileMenu(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Stories' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/20">
      {/* Navigation Bar */}
      <motion.nav
        style={{ backgroundColor: navBg as any }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-lg shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => scrollToSection('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiBeaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white drop-shadow-lg">DairyCoop</h1>
                <p className="text-xs text-white/90 font-medium drop-shadow">Management Suite</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-semibold transition-all ${
                    activeSection === item.id
                      ? 'text-white scale-110'
                      : 'text-white/80 hover:text-white hover:scale-105'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isDark ? (
                  <HiSun className="w-5 h-5 text-white" />
                ) : (
                  <HiMoon className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Desktop Buttons */}
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2.5 bg-white/10 text-white hover:bg-white/20 font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="px-6 py-2.5 bg-white text-primary-700 hover:bg-white/90 font-semibold rounded-xl shadow-lg transition-all hover:scale-105"
                >
                  Sign Up
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {showMobileMenu ? (
                  <HiXMark className="w-6 h-6 text-white" />
                ) : (
                  <HiBars3 className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLoginModal(true);
                }}
                className="block w-full px-4 py-3 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  window.location.href = '/signup';
                }}
                className="block w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-lg"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <div className="pt-16">
        <div id="home">
          <HeroSection onLoginClick={() => setShowLoginModal(true)} />
        </div>

        <div id="about">
          <AboutSection />
        </div>

        <div id="products">
          <ProductsSection />
        </div>

        <DairyAnimalsSection />

        <div id="services">
          <ServicesSection />
        </div>

        <WhyChooseUsSection />

        <TimelineSection />

        <div id="statistics">
          <StatisticsSection />
        </div>

        <div id="testimonials">
          <TestimonialsSection />
        </div>

        <div id="gallery">
          <GallerySection />
        </div>

        <div id="news">
          <NewsSection />
        </div>

        <FaqSection />

        <div id="contact">
          <ContactSection />
        </div>

        <Footer />
      </div>

      {/* Mobile Floating Login Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowLoginModal(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <HiSparkles className="w-6 h-6" />
      </motion.button>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginCard onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default LandingPage;

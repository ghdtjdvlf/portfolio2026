import HeroSection from './components/HeroSection';
import CircularGallery from './components/CircularGallery';
import ProgramSection from './components/ProgramSection';
import ReviewSection from './components/ReviewSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import FloatingNav from './components/FloatingNav';
import './App.css';

function App() {
  return (
    <main>
      <FloatingNav />
      <section id="hero">
        <HeroSection />
      </section>
      <div style={{ height: '600px', background: '#09090b' }}>
        <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} />
      </div>
      <div>
        <ProgramSection />
      </div>
      <section id="reviews">
        <ReviewSection />
      </section>
      <FaqSection />
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}

export default App;

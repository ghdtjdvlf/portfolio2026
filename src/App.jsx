import { useEffect } from 'react';
import ResizableNavbar from './components/ResizableNavbar';
import MobileDock from './components/MobileDock';
import HeroSection from './components/HeroSection';
import IntroSection from './components/IntroSection';
import ProgramSection from './components/ProgramSection';
import ReviewSection from './components/ReviewSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import { trackPageView, trackSession } from './lib/analytics';
import './App.css';

function App() {
  useEffect(() => {
    trackPageView();
    const start = Date.now();
    const onUnload = () => {
      const sec = Math.round((Date.now() - start) / 1000);
      if (sec >= 3) trackSession(sec);
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);
  const navItems = [
    { name: '소개', link: '#intro' },
    { name: '컨텐츠', link: '#program' },
    { name: '후기', link: '#reviews' },
    { name: '신청', link: '#contact' },
  ];

  const logo = <div>Logo</div>;

  return (
    <main className="lg:pb-0 pb-24">
      <ResizableNavbar navItems={navItems} logo={logo} />
      <MobileDock />

      <section id="hero">
        <HeroSection />
      </section>

      <section id="intro">
        <IntroSection />
      </section>

      <section id="program">
        <ProgramSection />
      </section>

      <section id="reviews">
        <ReviewSection />
      </section>

      <section id="contact">
        <ContactSection />
      </section>

      <section id="faq">
        <FaqSection />
      </section>

      
    </main>
  );
}

export default App;

import { useEffect, useState } from 'react';
import ResizableNavbar from './components/ResizableNavbar';
import MobileDock from './components/MobileDock';
import BentoGallery from './components/BentoGallery';
import IntroSection from './components/IntroSection';
import ProgramSection from './components/ProgramSection';
import ReviewSection from './components/ReviewSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import ResumeToast from './components/ResumeToast';
import { trackPageView, trackSession, trackVisitor } from './lib/analytics';
import './App.css';

function App() {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    trackPageView();

    // 세션당 1회만 위치 수집
    if (!sessionStorage.getItem('loc_tracked')) {
      fetch('https://ipwho.is/')
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            trackVisitor(data);
            sessionStorage.setItem('loc_tracked', '1');
          }
        })
        .catch(() => {});
    }

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
      <ResizableNavbar navItems={navItems} logo={logo} show={showNavbar} />
      <MobileDock show={showNavbar} />
      <ResumeToast />

      <section id="hero">
        <BentoGallery
          onLeave={() => setShowNavbar(true)}
          onEnterBack={() => setShowNavbar(false)}
        />
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

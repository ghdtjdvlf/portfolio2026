import ResizableNavbar from './components/ResizableNavbar';
import MobileDock from './components/MobileDock';
import HeroSection from './components/HeroSection';
import CircularGallery from './components/CircularGallery';
import ProgramSection from './components/ProgramSection';
import ReviewSection from './components/ReviewSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import './App.css';

function App() {
  const navItems = [
    { name: "메인", link: "#hero" },
    { name: "1부", link: "#part1" },
    { name: "2부", link: "#part2" },
    { name: "후기", link: "#faq" },
    { name: "리뷰", link: "#reviews" },
  ];

  const logo = <div>Logo</div>;

  return (
    <main className="lg:pb-0 pb-24">
      <ResizableNavbar navItems={navItems} logo={logo} />
      <MobileDock />
      <section id="hero">
        <HeroSection />
      </section>
      <div>
        <ProgramSection />
      </div>
      <section id="reviews">
        <ReviewSection />
      </section>
      <section id="faq">
        <FaqSection />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
    </main>
  );
}

export default App;

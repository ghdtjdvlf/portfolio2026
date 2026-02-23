const HeroSection = () => {
  return (
    <section className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* 2.35:1 시네마 비율 컨테이너 */}
      <div className="relative w-full aspect-[4/3] md:aspect-[235/100]">
        {/* 배경 비디오 */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/portfolio2026/video-01.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 딤 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />

        {/* 텍스트 */}
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <h1
            className="font-bold tracking-widest text-white text-center"
            style={{ fontSize: 'clamp(2.8rem, 10vw, 6rem)' }}
          >
            레전드
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { Image } from "lucide-react";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-shell">
        <div className="hero-grid">
          <div>
            <span className="eyebrow mb-4">
              <div className="w-36 h-3.5 skeleton" />
            </span>
            <div className="w-96 h-14 skeleton mb-2" />
            <div className="w-72 h-14 skeleton mb-8" />
            <div className="w-md h-5 skeleton mb-2" />
            <div className="w-80 h-5 skeleton mb-8" />
            <div className="buttons">
              <div className="w-36 h-11 rounded-full skeleton" />
            </div>
            <div className="stats">
              <div>
                <div className="w-12 h-8 skeleton" />
                <div className="mt-0.5 w-24 h-5 skeleton" />
              </div>
              <div>
                <div className="w-12 h-8 skeleton" />
                <div className="mt-0.5 w-24 h-5 skeleton" />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="slider-section">
              <div className="h-140 w-auto skeleton rounded-[28px] flex items-center justify-center">
                <Image className="w-64 h-64 text-slate-100 dark:text-slate-600" />
              </div>
            </div>
            <div className="slider-note">
              <div className="note">
                <div className="icon">
                  <div className="w-4 h-4 skeleton" />
                </div>
                <div>
                  <div className="headline">
                    <div className="mt-0.5 w-28 h-4 skeleton" />
                  </div>
                  <div className="info">
                    <div className="mt-0.5 w-28 h-6 skeleton" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

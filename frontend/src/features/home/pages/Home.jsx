import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { Button, Meta } from '@/features/shared';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, CheckCircle, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const imgFrameRef = useRef(null);
  const revealSections = useRef([]);

  useEffect(() => {
    // 1. Cinematic Hero Intro Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 }
      );

      gsap.fromTo(imgFrameRef.current,
        { scale: 1.1, filter: 'brightness(0)' },
        { scale: 1, filter: 'brightness(0.85)', duration: 2, ease: 'power3.out', delay: 0.4 }
      );

      // 2. Scroll Trigger: Collapse Hero Downward & Reveal next section
      gsap.to(heroRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          pin: true,
          pinSpacing: false
        },
        scale: 0.95,
        opacity: 0.1,
        y: 50,
        ease: 'none'
      });

      // 3. Reveal elements on scroll
      revealSections.current.forEach((section) => {
        if (!section) return;
        gsap.fromTo(section.querySelectorAll('.scroll-reveal-item'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const addToRef = (el) => {
    if (el && !revealSections.current.includes(el)) {
      revealSections.current.push(el);
    }
  };

  const editorialHighlights = [
    {
      title: 'Honed Travertine',
      category: 'MODERN FURNITURE',
      price: '$780',
      image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80',
      link: '/products/travertine-accent-table'
    },
    {
      title: 'Minimalist Overcoat',
      category: 'LUXURY APPAREL',
      price: '$450',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      link: '/products/minimalist-wool-overcoat'
    },
    {
      title: 'Titanium Headset',
      category: 'PREMIUM TECH',
      price: '$420',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      link: '/products/titanium-noise-cancelling-headphones'
    }
  ];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'SHOPIFI',
    'url': window.location.origin,
    'description': 'Exquisite architectural artifacts and minimal lifestyle essentials crafted for modern living.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${window.location.origin}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="w-full bg-canvas-night text-white overflow-hidden">
      <Meta 
        title="SHOPIFI — Cinematic Editorial Commerce" 
        description="Aesthetic artifacts and minimal lifestyle essentials crafted for modern living. Explore curated modern furniture, luxury apparel, and premium tech."
        schema={websiteSchema}
      />
      
      {/* 1. Cinematic Full-screen Hero Section */}
      <section 
        ref={heroRef} 
        className="relative w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-black overflow-hidden z-10"
      >
        <div ref={imgFrameRef} className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80" 
            alt="Merchant craft" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-20 flex flex-col items-center gap-6">
          <span className="text-xs uppercase tracking-[0.4em] text-aloe-10 font-medium">
            THE NEW STANDARD
          </span>
          <h1 
            ref={titleRef}
            className="text-5xl md:text-8xl tracking-wider leading-none max-w-5xl font-light"
          >
            AESTHETIC ARTIFACTS FOR MODERN LIVING.
          </h1>
          <div className="mt-8">
            <Link to="/products">
              <Button variant="outline-on-dark" className="group">
                Discover Catalog <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer to handle the pinned reveal effect */}
      <div className="relative h-20 bg-black z-20" />

      {/* 2. Editorial Narrative Section (Full Bleed Image Parallax Reveal) */}
      <section 
        ref={addToRef}
        className="relative py-32 bg-canvas-night-elevated border-t border-zinc-900 z-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal-item flex flex-col gap-6">
            <span className="text-xs uppercase tracking-widest text-shade-40">OUR PHILOSOPHY</span>
            <h2 className="text-4xl md:text-6xl tracking-tight leading-tight text-white font-light">
              Crafted to resist trends and endure lifetimes.
            </h2>
            <p className="text-shade-30 text-base leading-relaxed max-w-lg">
              We cooperate exclusively with local family merchants, selecting only high-grade materials: FSC-certified European oak, hand-honed Classico travertine, long-staple Peruvian cotton, and custom mechanical keycap brass. No synthetic fillers, no mass production.
            </p>
            <div className="pt-4">
              <Link to="/products">
                <Button variant="outline-on-dark">Read The Story</Button>
              </Link>
            </div>
          </div>
          
          <div className="scroll-reveal-item relative rounded-2xl overflow-hidden aspect-[4/5] bg-zinc-950">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80" 
              alt="Artisan workspace" 
              className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </section>

      {/* 3. Product Highlights - Bento Grid Style */}
      <section 
        ref={addToRef}
        className="py-32 bg-black z-20 relative border-t border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="scroll-reveal-item flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest text-shade-40">FEATURED EDITION</span>
              <h2 className="text-3xl md:text-5xl font-light">Selected Highlights</h2>
            </div>
            <Link to="/products">
              <span className="text-sm font-semibold tracking-wider hover:underline flex items-center gap-1.5 cursor-pointer">
                View All Releases <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {editorialHighlights.map((prod, idx) => (
              <Link 
                key={idx}
                to={prod.link} 
                className="scroll-reveal-item group flex flex-col gap-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-zinc-900">
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-widest uppercase text-aloe-10">{prod.category}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">{prod.title}</span>
                    <span className="text-base font-semibold text-shade-30">{prod.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Editorial Testimonial Block */}
      <section 
        ref={addToRef}
        className="py-32 bg-zinc-950 z-20 relative border-t border-zinc-900 text-center"
      >
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-8">
          <Quote size={40} className="text-aloe-10 opacity-40 scroll-reveal-item" />
          <p className="scroll-reveal-item text-2xl md:text-4xl font-light leading-relaxed text-shade-30">
            "SHOPIFI has completely reset our expectations for everyday furniture and tools. The monolithic oak chair is a pure piece of museum art that we use every single afternoon."
          </p>
          <div className="scroll-reveal-item flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-wider">MARCUS & AURELIA VANCE</span>
            <span className="text-[10px] tracking-widest text-shade-40">DESIGN DIRECTORS, COPENHAGEN</span>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Sign-up */}
      <section 
        ref={addToRef}
        className="py-32 bg-black z-20 relative border-t border-zinc-900"
      >
        <div className="max-w-md mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="scroll-reveal-item text-xs uppercase tracking-widest text-aloe-10">NEWSLETTER</span>
          <h2 className="scroll-reveal-item text-3xl md:text-5xl font-light">Join The Circle</h2>
          <p className="scroll-reveal-item text-sm text-shade-30">
            Receive early notifications on new product runs, curated editorials, and seasonal releases.
          </p>
          <form 
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}
            className="scroll-reveal-item w-full flex flex-col gap-3 mt-4"
          >
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              required
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-full px-6 py-3.5 text-center text-sm tracking-wider focus:outline-none focus:border-white transition-colors"
            />
            <Button type="submit" variant="primary-pill" className="w-full justify-center">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
      
    </div>
  );
};

export default Home;

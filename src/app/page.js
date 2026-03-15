"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import Logo from "@/assets/Markz Digital Logo.svg";
import styles from "./page.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Expertise Data ─────────────────────────────────
const EXPERTISE_CARDS = [
  {
    id: "growth",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Growth Strategy",
    desc: "Comprehensive, data-driven roadmaps designed for aggressive but sustainable brand expansion in competitive markets.",
    size: "large",
  },
  {
    id: "perf",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    ),
    title: "Performance Ads",
    desc: "High-conversion paid campaigns across social and search.",
    size: "small",
  },
  {
    id: "brand",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    title: "Brand Identity",
    desc: "Visual story-telling that resonates with premium audiences.",
    size: "small",
  },
  {
    id: "tech",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
    title: "Marketing Tech Stack",
    desc: "Cutting-edge implementations of CRM, attribution, and analytics platforms for fuller visibility.",
    size: "wide",
  },
  {
    id: "content",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Content Direction",
    desc: "Strategic content that converts.",
    size: "small",
  },
  {
    id: "seo",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "SEO Architecture",
    desc: "Technical foundations for organic growth.",
    size: "small",
  },
];

// ─── Main Page ───────────────────────────────────────
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Growth Strategy",
    overview: "",
  });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Refs for GSAP
  const heroRef = useRef(null);
  const expertiseRef = useRef(null);
  const contactRef = useRef(null);
  const footerRef = useRef(null);
  const heroMockupRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  // ── Nav scroll effect ──
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── GSAP ScrollTrigger Animations ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(`.${styles.heroTag}`, { opacity: 0, y: 30, duration: 0.8, delay: 0.2 })
        .from(`.${styles.heroTitle}`, { opacity: 0, y: 40, duration: 0.9 }, "-=0.5")
        .from(`.${styles.heroSub}`, { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        .from(`.${styles.heroBtns}`, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from(`.${styles.heroMockup}`, {
          opacity: 0,
          x: 60,
          rotateY: -15,
          duration: 1,
          ease: "power2.out",
        }, "-=0.8");

      // Expertise section — staggered card reveals
      const cardEls = document.querySelectorAll(`.${styles.expertiseCard}`);
      if (cardEls.length) {
        gsap.set(cardEls, { opacity: 0, y: 50, scale: 0.95 });
        ScrollTrigger.create({
          trigger: expertiseRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(cardEls, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
        // Fallback: ensure cards are visible after 3s
        setTimeout(() => {
          cardEls.forEach((el) => {
            if (parseFloat(getComputedStyle(el).opacity) < 0.5) {
              gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5 });
            }
          });
        }, 3000);
      }

      // Expertise heading
      gsap.from(`.${styles.expertiseHeading}`, {
        scrollTrigger: {
          trigger: expertiseRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      // Contact section — slide in from sides
      gsap.from(`.${styles.contactLeft}`, {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 75%",
        },
        opacity: 0,
        x: -60,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(`.${styles.contactForm}`, {
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 75%",
        },
        opacity: 0,
        x: 60,
        duration: 0.9,
        ease: "power3.out",
      });

      // Footer
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });

      // Parallax on hero mockup
      gsap.to(`.${styles.heroMockup}`, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 80,
        ease: "none",
      });

      // Subtle glow pulse parallax
      gsap.to(`.${styles.heroGlow}`, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: -60,
        scale: 1.2,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  const openModal = useCallback(() => setShowModal(true), []);

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setToast(null);
    }, 300);
  }, []);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.email) return;
      setSending(true);
      setToast(null);
      try {
        await addDoc(collection(db, "prebooking_leads"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        setToast({ type: "ok", msg: "Request received! We'll be in touch within 24 hours." });
        setFormData({ name: "", email: "", service: "Growth Strategy", overview: "" });
      } catch {
        setToast({
          type: "err",
          msg: "Something went wrong. Please try again.",
        });
      } finally {
        setSending(false);
      }
    },
    [formData]
  );

  const scrollToSection = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className={styles.page}>
      {/* ── Navigation ── */}
      <nav className={`${styles.nav} ${navScrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <div className={styles.navBrand} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Image
              src={Logo}
              alt="Markz Digital Logo"
              width={32}
              height={32}
              style={{ borderRadius: "6px" }}
              priority
            />
            <span className={styles.navName}>MARKZ DIGITAL</span>
          </div>

          <div className={styles.navLinks}>
            <button className={styles.navLink} onClick={() => scrollToSection("expertise")}>
              Services
            </button>
            <button className={styles.navLink} onClick={() => scrollToSection("portfolio")}>
              Results
            </button>
            <button className={styles.navLink} onClick={() => scrollToSection("contact")}>
              About
            </button>
          </div>

          <button className={styles.navCta} onClick={openModal}>
            Get Started
          </button>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen1 : ""}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen2 : ""}`} />
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineOpen3 : ""}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.menuPanel} onClick={(e) => e.stopPropagation()}>
            <button className={styles.menuLink} onClick={() => scrollToSection("expertise")}>Services</button>
            <button className={styles.menuLink} onClick={() => scrollToSection("portfolio")}>Results</button>
            <button className={styles.menuLink} onClick={() => scrollToSection("contact")}>About</button>
            <button className={styles.menuCtaBtn} onClick={() => { setMenuOpen(false); openModal(); }}>
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════ */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <span className={styles.heroTag}>
              <span className={styles.heroTagDot} />
              PREMIUM DIGITAL GROWTH
            </span>
            <h1 className={styles.heroTitle}>
              Elevate Your
              <br />
              Brand with
              <br />
              <span className={styles.highlight}>Precision</span>
              <br />
              Marketing
            </h1>
            <p className={styles.heroSub}>
              We combine high-performance growth strategy with elite creative direction to drive measurable, scalable results for category-leading brands.
            </p>
            <div className={styles.heroBtns}>
              <button className={styles.heroBtn} onClick={openModal}>
                Start a Project
              </button>
              <button className={styles.heroBtnOutline} onClick={() => scrollToSection("portfolio")}>
                View Our Work
              </button>
            </div>
          </div>
          <div className={styles.heroMockup} ref={heroMockupRef}>
            <div className={styles.mockupCard}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupDots}>
                  <span /><span /><span />
                </div>
              </div>
              <div className={styles.mockupVideoWrap}>
                <video
                  ref={videoRef}
                  className={styles.mockupVideo}
                  src="/Final Website Video.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
                <button
                  className={styles.muteToggle}
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          OUR EXPERTISE SECTION
          ══════════════════════════════════════════════ */}
      <section className={styles.expertiseSection} id="expertise" ref={expertiseRef}>
        <div className={styles.sectionInner}>
          <div className={styles.expertiseHeading}>
            <h2 className={styles.expertiseTitle}>OUR EXPERTISE</h2>
            <div className={styles.expertiseLine} />
          </div>
          <div className={styles.expertiseGrid}>
            {EXPERTISE_CARDS.map((card) => (
              <div
                key={card.id}
                className={`${styles.expertiseCard} ${styles[`card_${card.size}`]}`}
              >
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PORTFOLIO SECTION (Scrollytelling)
          ══════════════════════════════════════════════ */}
      <section className={styles.portfolioSection} id="portfolio">
        <div className={styles.sectionInner}>
          <span className={styles.sectionTag}>Our Work</span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.highlight}>Portfolio</span>
          </h2>
          <p className={styles.portfolioDesc}>
            Explore our full range of projects, case studies, and creative work for brands worldwide.
          </p>
          <div className={styles.portfolioEmbed}>
            <iframe
              src="/PORTFOLIO.pdf"
              className={styles.pdfViewer}
              title="Markz Digital Portfolio"
            />
          </div>
          <a
            href="/PORTFOLIO.pdf"
            download
            className={styles.downloadBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Full Portfolio
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          READY TO SCALE? — CONTACT SECTION
          ══════════════════════════════════════════════ */}
      <section className={styles.contactSection} id="contact" ref={contactRef}>
        <div className={styles.contactInner}>
          <div className={styles.contactLeft}>
            <h2 className={styles.contactTitle}>
              READY TO SCALE?
            </h2>
            <p className={styles.contactDesc}>
              Every project starts with a conversation. Tell us about your goals, and we&apos;ll show you the roadmap to achieve them.
            </p>
            <div className={styles.contactCards}>
              <div className={styles.contactCard}>
                <div className={styles.contactCardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <span className={styles.contactCardLabel}>Direct Outreach</span>
                  <span className={styles.contactCardValue}>hello@markz.digital</span>
                </div>
              </div>
              <div className={styles.contactCard}>
                <div className={styles.contactCardIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div>
                  <span className={styles.contactCardLabel}>Global Studio</span>
                  <span className={styles.contactCardValue}>Remote-First • NY Office</span>
                </div>
              </div>
            </div>
          </div>

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>FULL NAME</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>WORK EMAIL</label>
                <input
                  className={styles.formInput}
                  type="email"
                  name="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>INTERESTED SERVICE</label>
              <select
                className={styles.formSelect}
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option>Growth Strategy</option>
                <option>Performance Ads</option>
                <option>Brand Identity</option>
                <option>Marketing Tech Stack</option>
                <option>Content Direction</option>
                <option>SEO Architecture</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>PROJECT OVERVIEW</label>
              <textarea
                className={styles.formTextarea}
                name="overview"
                placeholder="Tell us about your brand..."
                value={formData.overview}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <button
              className={styles.formSubmit}
              type="submit"
              disabled={sending}
            >
              {sending ? (
                <span className={styles.spinnerSm} />
              ) : (
                "REQUEST CONSULTATION"
              )}
            </button>
            {toast && (
              <div className={`${styles.toast} ${toast.type === "ok" ? styles.toastOk : styles.toastErr}`}>
                {toast.msg}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer} ref={footerRef}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image
              src={Logo}
              alt="Markz Digital Logo"
              width={28}
              height={28}
              style={{ borderRadius: "4px" }}
            />
            <span className={styles.footerName}>MARKZ DIGITAL</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>LinkedIn</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>Instagram</a>
          </div>
          <span className={styles.copyright}>
            © 2026 MARKZ DIGITAL AGENCY. ALL RIGHTS RESERVED.
          </span>
        </div>
      </footer>

      {/* ── Booking Modal ── */}
      {showModal && (
        <div
          className={`${styles.modalOverlay} ${closing ? styles.modalClosing : ""}`}
          onClick={closeModal}
        >
          <div
            className={`${styles.modalCard} ${closing ? styles.modalCardClosing : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.modalClose} onClick={closeModal}>
              ×
            </button>
            <h2 className={styles.modalTitle}>Get Started</h2>
            <p className={styles.modalDesc}>
              Fill in your details and our team will reach out within 24 hours to schedule your free strategy session.
            </p>
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <input
                className={styles.modalInput}
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className={styles.modalInput}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <select
                className={styles.modalInput}
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option>Growth Strategy</option>
                <option>Performance Ads</option>
                <option>Brand Identity</option>
                <option>Marketing Tech Stack</option>
                <option>Content Direction</option>
                <option>SEO Architecture</option>
              </select>
              <button
                className={styles.modalSubmitBtn}
                type="submit"
                disabled={sending}
              >
                {sending ? <span className={styles.spinnerSm} /> : "Reserve My Spot"}
              </button>
            </form>
            {toast && (
              <div className={`${styles.toast} ${toast.type === "ok" ? styles.toastOk : styles.toastErr}`}>
                {toast.msg}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
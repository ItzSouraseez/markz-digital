"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "./page.module.css";
import DotGrid from './DotGrid';
import Image from "next/image";
import Logo from "@/assets/Markz Digital Logo.svg";

const LAUNCH_DATE = new Date("2026-02-21T00:00:00+05:30").getTime();

function getTimeRemaining() {
  const diff = Math.max(0, LAUNCH_DATE - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n) => String(n).padStart(2, "0");

// ─── Main Page ───────────────────────────────────────
export default function Home() {
  const [time, setTime] = useState(getTimeRemaining());
  const [showModal, setShowModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null); // { type: "ok" | "err", msg }

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
      setToast(null);
    }, 300);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSending(true);
    setToast(null);
    try {
      await addDoc(collection(db, "prebooking_leads"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setToast({ type: "ok", msg: "You're in! We'll be in touch soon." });
      setFormData({ name: "", email: "", phone: "" });
    } catch {
      setToast({ type: "err", msg: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }, [formData]);

  return (
    <div className={styles.heroWrapper}>
      <div className={styles.dotGridBg}>
        <DotGrid
          dotSize={6}
          gap={24}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={100}
          returnDuration={1}
        />
      </div>
      <div className={styles.glassCard}>
        {/* ── Top Bar: Logo ── */}
        <div className={styles.topBar}>
          <Image src={Logo} alt="Markz Digital Logo" width={44} height={44} style={{ borderRadius: '8px' }} />
          <span className={styles.topBarBrand}>markz digital</span>
        </div>

        {/* ── Main Content ── */}
        <div className={styles.cardContent}>
          <span className={styles.tagLabel}>🚀 Grand Launch</span>
          <h1 className={styles.heroTitle}>
            We&apos;re Building<br />Something <span className={styles.highlight}>Amazing</span>
          </h1>
          <p className={styles.heroSub}>
            A full-service digital marketing agency crafting strategies that drive real growth.
          </p>

          {/* Countdown */}
          <div className={styles.countdown}>
            {[
              { label: "Days", value: pad(time.days) },
              { label: "Hrs", value: pad(time.hours) },
              { label: "Min", value: pad(time.minutes) },
              { label: "Sec", value: pad(time.seconds) },
            ].map(({ label, value }) => (
              <div key={label} className={styles.timerBox}>
                <span className={styles.timerValue}>{value}</span>
                <span className={styles.timerLabel}>{label}</span>
              </div>
            ))}
          </div>

          {/* Pre-booking offer */}
          <div className={styles.offerSection}>
            <h3 className={styles.offerTitle}>🎁 Pre-Launch Offer — Limited Spots</h3>
            <div className={styles.perksRow}>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>💬</span>
                <span className={styles.perkText}>Free Strategy<br />Consultation</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>🏷️</span>
                <span className={styles.perkText}>20% Off First<br />Campaign</span>
              </div>
              <div className={styles.perkItem}>
                <span className={styles.perkIcon}>⚡</span>
                <span className={styles.perkText}>Priority<br />Onboarding</span>
              </div>
            </div>
          </div>

          <button className={styles.bookBtn} onClick={() => setShowModal(true)}>Book Your Spot →</button>
        </div>

        {/* ── Footer ── */}
        <div className={styles.cardFooter}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.instaLink} aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <span className={styles.copyright}>© 2026 Markz Digital. All rights reserved.</span>
        </div>
      </div>

      {/* ── BOOKING MODAL ── */}
      {showModal && (
        <div className={`${styles.modalOverlay} ${closing ? styles.modalClosing : ''}`} onClick={closeModal}>
          <div className={`${styles.modalCard} ${closing ? styles.modalCardClosing : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>×</button>
            <h2 className={styles.modalTitle}>Book Your Spot</h2>
            <p className={styles.modalDesc}>
              Reserve your pre-launch offer now. Fill in your details and our team will reach out within 24 hours.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                className={styles.input}
                type="tel"
                name="phone"
                placeholder="Phone Number (optional)"
                value={formData.phone}
                onChange={handleChange}
              />
              <button className={styles.submitBtn} type="submit" disabled={sending}>
                {sending ? <span className={styles.spinner} /> : "Reserve My Spot"}
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
    </div>
  );
}
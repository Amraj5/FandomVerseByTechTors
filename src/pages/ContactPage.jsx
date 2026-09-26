import React, { useState } from "react";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  if (submitted) {
    return (
      <div className={styles.contactPage}>
        <header className={styles.pageHeader}>
          <h1>Message Sent!</h1>
          <p className={styles.pageSubtitle}>Thanks for reaching out. We'll get back to you soon.</p>
        </header>
        <div className={styles.contactForm} style={{ textAlign: "center", padding: "var(--space-10)" }}>
          <div style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-4)" }}>✓</div>
          <h2 style={{ margin: "0 0 var(--space-2)" }}>Message Sent Successfully</h2>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 var(--space-6)" }}>
            Our team will review your message and respond within 1-2 business days.
          </p>
          <button onClick={() => setSubmitted(false)} className="submitBtn" style={{ width: "auto" }}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contactPage}>
      <header className={styles.pageHeader}>
        <h1>Contact Us</h1>
        <p className={styles.pageSubtitle}>Get in touch with the FandomVerse team</p>
      </header>

      <p className={styles.contactIntro}>
        Have questions, feedback, or just want to say hi? We'd love to hear from you. 
        Fill out the form below or reach out through any of our channels.
      </p>

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Question about the site / Feedback / Partnership"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Tell us what's on your mind..."
          />
        </div>

        <button type="submit" className={`submitBtn btn btn-primary`}>
          Send Message
        </button>
      </form>

      <div className={styles.contactInfo}>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>📧</span>
          <h3>Email</h3>
          <p><a href="mailto:hello@fandomverse.app">hello@fandomverse.app</a></p>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>🐦</span>
          <h3>Twitter / X</h3>
          <p><a href="https://twitter.com/fandomverse" target="_blank" rel="noopener">@fandomverse</a></p>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>💬</span>
          <h3>Discord</h3>
          <p><a href="https://discord.gg/fandomverse" target="_blank" rel="noopener">Join our server</a></p>
        </div>
      </div>
    </div>
  );
}
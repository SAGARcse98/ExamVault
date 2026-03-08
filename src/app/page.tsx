import Link from "next/link";
import {
  BookOpen,
  Video,
  FileText,
  Calculator,
  Brain,
  Star,
  ArrowRight,
  GraduationCap,
  Zap,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Video className="w-7 h-7" />,
      title: "Video Lectures",
      description: "Topic-wise video lectures with progress tracking and favorites",
      gradient: "subject-card-1",
      href: "/dashboard/videos",
    },
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Notes & PDFs",
      description: "Categorized notes with PDF viewer and download capability",
      gradient: "subject-card-2",
      href: "/dashboard/notes",
    },
    {
      icon: <Brain className="w-7 h-7" />,
      title: "Formulas & Tricks",
      description: "Quick-access formula sheets and memory tips by topic",
      gradient: "subject-card-3",
      href: "/dashboard/formulas",
    },
    {
      icon: <Calculator className="w-7 h-7" />,
      title: "Smart Calculator",
      description: "Table generator, squares, cubes, and power calculator",
      gradient: "subject-card-4",
      href: "/dashboard/calculator",
    },
    {
      icon: <Star className="w-7 h-7" />,
      title: "Favorites & Progress",
      description: "Bookmark important content and track your learning progress",
      gradient: "subject-card-5",
      href: "/dashboard/favorites",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Admin Management",
      description: "Full content management system for admins",
      gradient: "subject-card-1",
      href: "/admin",
    },
  ];

  const subjects = [
    "Quantitative Aptitude",
    "Reasoning",
    "English",
    "General Awareness",
    "Computer Knowledge",
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "16px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            className="gradient-primary"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ExamVault
          </span>
        </Link>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" className="btn-secondary" style={{ textDecoration: "none" }}>
            Login
          </Link>
          <Link href="/register" className="btn-primary" style={{ textDecoration: "none" }}>
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="gradient-hero"
        style={{
          paddingTop: 140,
          paddingBottom: 100,
          paddingLeft: 40,
          paddingRight: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
          className="animate-float"
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
          className="animate-float"
        />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(79,70,229,0.2)",
              padding: "8px 20px",
              borderRadius: 50,
              marginBottom: 24,
              border: "1px solid rgba(79,70,229,0.3)",
            }}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span style={{ color: "#A5B4FC", fontSize: 14, fontWeight: 600 }}>
              Your Exam Preparation Vault
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            Master Banking & SSC Exams{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #06B6D4, #F59E0B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              with Confidence
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#94A3B8",
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 600,
              margin: "0 auto 40px",
            }}
          >
            Access video lectures, comprehensive notes, formula sheets, and smart
            tools — everything you need to crack IBPS, SBI, SSC exams in one place.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration: "none", padding: "14px 32px", fontSize: 16 }}>
              Start Learning Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: 16,
                borderRadius: 12,
                border: "2px solid rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.3s",
              }}
            >
              <BookOpen className="w-5 h-5" /> Explore Content
            </Link>
          </div>

          {/* Subject pills */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 48,
            }}
          >
            {subjects.map((s) => (
              <span
                key={s}
                style={{
                  padding: "8px 20px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.08)",
                  color: "#CBD5E1",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2
            style={{
              fontSize: 36,
              fontWeight: 800,
              marginBottom: 16,
              color: "#0F172A",
            }}
          >
            Everything You Need to{" "}
            <span style={{ color: "#4F46E5" }}>Succeed</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 500, margin: "0 auto" }}>
            Comprehensive tools and resources designed specifically for Banking & SSC aspirants
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {features.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: 32,
                  border: "1px solid #E2E8F0",
                  cursor: "pointer",
                  height: "100%",
                }}
              >
                <div
                  className={feature.gradient}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginBottom: 20,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#0F172A" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary" style={{ padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 16 }}>
          Ready to Start Your Preparation?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          Join thousands of aspirants who trust ExamVault for their Banking & SSC exam preparation.
        </p>
        <Link
          href="/register"
          style={{
            textDecoration: "none",
            background: "white",
            color: "#4F46E5",
            padding: "14px 40px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 16,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.3s",
          }}
        >
          Create Free Account <ChevronRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: "linear-gradient(180deg, #0F172A 0%, #020617 100%)", color: "#94A3B8" }}>
        {/* Main Footer */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gradient-primary"
                  style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 20, color: "white" }}>ExamVault</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
                Your ultimate preparation platform for Banking & SSC exams. Access video lectures, notes, mock tests, and smart tools — all in one place.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "Twitter", icon: "𝕏" },
                  { label: "YouTube", icon: "▶" },
                  { label: "Telegram", icon: "✈" },
                  { label: "Instagram", icon: "📷" },
                ].map((s) => (
                  <a key={s.label} href="#" title={s.label}
                    style={{
                      width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 14, color: "#94A3B8", textDecoration: "none",
                      transition: "all 0.2s",
                    }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 18, letterSpacing: 0.3 }}>
                Quick Links
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Video Lectures", href: "/dashboard/videos" },
                  { label: "Notes & PDFs", href: "/dashboard/notes" },
                  { label: "Mock Tests", href: "/dashboard/mocktests" },
                  { label: "Smart Calculator", href: "/dashboard/calculator" },
                  { label: "Formulas & Tricks", href: "/dashboard/formulas" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}
                    style={{ fontSize: 14, color: "#94A3B8", textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                    <ChevronRight className="w-3 h-3" style={{ opacity: 0.5 }} /> {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 18, letterSpacing: 0.3 }}>
                Exam Resources
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "SBI PO Preparation",
                  "IBPS Clerk Guide",
                  "SSC CGL Strategy",
                  "RBI Grade B Tips",
                  "Previous Year Papers",
                  "Current Affairs",
                ].map((item) => (
                  <span key={item} style={{ fontSize: 14, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
                    <ChevronRight className="w-3 h-3" style={{ opacity: 0.5 }} /> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 18, letterSpacing: 0.3 }}>
                Stay Updated
              </h4>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                Get weekly study tips, exam notifications, and new content alerts straight to your inbox.
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <input type="email" placeholder="Your email address"
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)", fontSize: 13, color: "white", outline: "none",
                    minWidth: 0,
                  }} />
                <button className="btn-primary" style={{ padding: "10px 16px", fontSize: 13, borderRadius: 10, whiteSpace: "nowrap" }}>
                  Subscribe
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>📧</span> support@examvault.in
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>📞</span> +91 98XXX XXXXX
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>📍</span> India
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", marginBottom: 24 }} />

          {/* Bottom Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13 }}>
              © {new Date().getFullYear()} ExamVault. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Service", "Refund Policy", "Disclaimer"].map((item) => (
                <a key={item} href="#" style={{ fontSize: 13, color: "#64748B", textDecoration: "none", transition: "color 0.2s" }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

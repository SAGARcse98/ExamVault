"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="gradient-hero"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
            }}
        >
            {/* Decorative */}
            <div
                style={{
                    position: "absolute",
                    top: "20%",
                    right: "15%",
                    width: 300,
                    height: 300,
                    background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
                    borderRadius: "50%",
                }}
                className="animate-float"
            />

            <div
                className="animate-fade-in"
                style={{
                    background: "white",
                    borderRadius: 24,
                    padding: 44,
                    width: "100%",
                    maxWidth: 440,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <div
                            className="gradient-primary"
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <span
                            style={{
                                fontSize: 26,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            ExamVault
                        </span>
                    </Link>
                    <p style={{ color: "#64748B", marginTop: 12, fontSize: 15 }}>
                        Welcome back! Sign in to continue.
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#FEF2F2",
                            border: "1px solid #FECACA",
                            color: "#DC2626",
                            padding: "12px 16px",
                            borderRadius: 12,
                            fontSize: 14,
                            marginBottom: 20,
                            fontWeight: 500,
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Email Address
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail
                                className="w-5 h-5"
                                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-styled"
                                style={{ paddingLeft: 44 }}
                                placeholder="you@example.com"
                                required
                                id="login-email"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <Lock
                                className="w-5 h-5"
                                style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-styled"
                                style={{ paddingLeft: 44, paddingRight: 44 }}
                                placeholder="••••••••"
                                required
                                id="login-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: 14,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#94A3B8",
                                }}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        id="login-submit"
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            padding: "13px 24px",
                            fontSize: 15,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? (
                            "Signing in..."
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: 24, color: "#64748B", fontSize: 14 }}>
                    Don't have an account?{" "}
                    <Link href="/register" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

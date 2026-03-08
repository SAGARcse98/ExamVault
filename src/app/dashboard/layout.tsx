"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    Home,
    BookOpen,
    Video,
    FileText,
    Star,
    Eye,
    Brain,
    Calculator,
    ClipboardList,
    GraduationCap,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Shield,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/subjects", label: "Subjects", icon: BookOpen },
    { href: "/dashboard/videos", label: "Video Lectures", icon: Video },
    { href: "/dashboard/notes", label: "Notes & PDFs", icon: FileText },
    { href: "/dashboard/mocktests", label: "Mock Tests", icon: ClipboardList },
    { href: "/dashboard/favorites", label: "Favorites", icon: Star },
    { href: "/dashboard/watched", label: "Watched", icon: Eye },
    { href: "/dashboard/formulas", label: "Formulas & Tricks", icon: Brain },
    { href: "/dashboard/calculator", label: "Smart Calculator", icon: Calculator },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 39,
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar ${sidebarOpen ? "open" : ""}`}
                style={{ display: "flex", flexDirection: "column" }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: "20px 20px 24px",
                        borderBottom: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Link
                        href="/dashboard"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            textDecoration: "none",
                        }}
                    >
                        <div
                            className="gradient-primary"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #4F46E5, #06B6D4)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            ExamVault
                        </span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="btn-icon"
                        style={{ display: "none" }}
                        id="close-sidebar-btn"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`sidebar-link ${isActive ? "active" : ""}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                                {isActive && (
                                    <ChevronRight
                                        className="w-4 h-4"
                                        style={{ marginLeft: "auto" }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {/* Admin link */}
                    {(session?.user as any)?.role === "admin" && (
                        <>
                            <div
                                style={{
                                    height: 1,
                                    background: "#E2E8F0",
                                    margin: "16px 20px",
                                }}
                            />
                            <p
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: "#94A3B8",
                                    padding: "0 20px 8px",
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                }}
                            >
                                Admin
                            </p>
                            <Link
                                href="/admin"
                                className={`sidebar-link ${pathname.startsWith("/admin") ? "active" : ""
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Shield className="w-5 h-5" />
                                <span>Admin Panel</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* User */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #E2E8F0",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 12,
                        }}
                    >
                        <div
                            className="gradient-primary"
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: 700,
                                fontSize: 14,
                            }}
                        >
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "#0F172A",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {session?.user?.name || "User"}
                            </p>
                            <p
                                style={{
                                    fontSize: 12,
                                    color: "#94A3B8",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {session?.user?.email || ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="btn-secondary"
                        style={{
                            width: "100%",
                            justifyContent: "center",
                            padding: "8px 16px",
                            fontSize: 13,
                            color: "#EF4444",
                            borderColor: "#FEE2E2",
                        }}
                        id="logout-btn"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="main-content" style={{ marginLeft: 260 }}>
                {/* Top bar */}
                <header
                    style={{
                        height: 64,
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 28px",
                        position: "sticky",
                        top: 0,
                        zIndex: 30,
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="btn-icon mobile-menu-btn"
                        style={{ marginRight: 16, display: "none" }}
                        id="open-sidebar-btn"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#0F172A",
                        }}
                    >
                        {navItems.find((i) => i.href === pathname)?.label ||
                            (pathname.startsWith("/admin") ? "Admin Panel" : "ExamVault")}
                    </h1>
                </header>

                {/* Page content */}
                <main style={{ padding: 28, minHeight: "calc(100vh - 64px)" }}>
                    {children}
                </main>
            </div>

        </div>
    );
}

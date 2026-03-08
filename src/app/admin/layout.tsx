"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import {
    LayoutDashboard,
    BookOpen,
    Video,
    FileText,
    Brain,
    ArrowLeft,
    Shield,
    ChevronRight,
    ClipboardList,
} from "lucide-react";

const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/subjects", label: "Subjects", icon: BookOpen },
    { href: "/admin/videos", label: "Videos", icon: Video },
    { href: "/admin/notes", label: "Notes", icon: FileText },
    { href: "/admin/formulas", label: "Formulas", icon: Brain },
    { href: "/admin/mocktests", label: "Mock Tests", icon: ClipboardList },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
            router.push("/dashboard");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
                <div className="skeleton" style={{ width: 200, height: 30, borderRadius: 8 }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
            {/* Admin Header */}
            <header
                style={{
                    background: "linear-gradient(135deg, #0F172A, #1E293B)",
                    padding: "16px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #EF4444, #F59E0B)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span style={{ fontSize: 18, fontWeight: 800, color: "white" }}>
                            Admin Panel
                        </span>
                    </div>
                </div>
                <Link
                    href="/dashboard"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        color: "rgba(255,255,255,0.7)",
                        textDecoration: "none",
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </header>

            <div style={{ display: "flex" }}>
                {/* Admin sidebar nav */}
                <nav
                    className="admin-sidebar"
                    style={{
                        width: 220,
                        background: "white",
                        borderRight: "1px solid #E2E8F0",
                        minHeight: "calc(100vh - 68px)",
                        padding: "20px 0",
                    }}
                >
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "10px 20px",
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? "#4F46E5" : "#64748B",
                                    background: isActive ? "#EEF2FF" : "transparent",
                                    borderRight: isActive ? "3px solid #4F46E5" : "3px solid transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Main */}
                <main className="admin-main" style={{ flex: 1, padding: 28 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

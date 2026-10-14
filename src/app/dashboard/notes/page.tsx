"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
    FileText, Download, Star, Search, X,
    ExternalLink, BookOpen, Maximize2, Loader2,
} from "lucide-react";

// ─────────────────────────────────────────────
// PDF Viewer Modal
// ─────────────────────────────────────────────
function PdfViewerModal({
    note,
    onClose,
    onDownload,
}: {
    note: any;
    onClose: () => void;
    onDownload: (note: any) => void;
}) {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Cloudinary raw URLs have aggressive Content-Disposition headers that force downloads
    // and block iframe rendering. We route the PDF through our server-side proxy which
    // fetches the file and streams it back with `Content-Disposition: inline` and
    // no cross-origin restrictions.
    const embedUrl = note.pdfUrl
        ? `/api/pdf-proxy?url=${encodeURIComponent(note.pdfUrl)}`
        : "";

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                animation: "fadeIn 0.15s ease",
            }}
        >
            {/* Modal panel */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: 900,
                    height: "90vh",
                    background: "#0F172A",
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* ── Toolbar ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        background: "rgba(255,255,255,0.05)",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        flexShrink: 0,
                    }}
                >
                    {/* File icon */}
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <FileText style={{ width: 18, height: 18, color: "#fff" }} />
                    </div>

                    {/* Title + breadcrumb */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#F1F5F9",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {note.title}
                        </div>
                        {(note.subjectId?.name || note.topicId?.name) && (
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#64748B",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    marginTop: 2,
                                }}
                            >
                                <BookOpen style={{ width: 11, height: 11 }} />
                                {note.subjectId?.name || ""}
                                {note.topicId?.name ? ` › ${note.topicId.name}` : ""}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        {/* Download */}
                        <button
                            onClick={() => onDownload(note)}
                            title="Download PDF"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "7px 14px",
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.06)",
                                color: "#CBD5E1",
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        >
                            <Download style={{ width: 14, height: 14 }} />
                            <span className="hide-mobile">Download</span>
                        </button>

                        {/* Open in new tab */}
                        <a
                            href={embedUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Open in new tab"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "7px 14px",
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.06)",
                                color: "#CBD5E1",
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                textDecoration: "none",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                        >
                            <Maximize2 style={{ width: 14, height: 14 }} />
                            <span className="hide-mobile">Full Screen</span>
                        </a>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            title="Close (Esc)"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(239,68,68,0.15)",
                                color: "#F87171",
                                cursor: "pointer",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.3)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                        >
                            <X style={{ width: 16, height: 16 }} />
                        </button>
                    </div>
                </div>

                {/* ── PDF iframe ── */}
                <div style={{ flex: 1, position: "relative", background: "#1E293B" }}>
                    {/* Loading spinner */}
                    {loading && !loadError && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                                color: "#64748B",
                                zIndex: 1,
                            }}
                        >
                            <Loader2
                                style={{
                                    width: 36,
                                    height: 36,
                                    color: "#3B82F6",
                                    animation: "spin 1s linear infinite",
                                }}
                            />
                            <span style={{ fontSize: 14 }}>Loading PDF securely…</span>
                            <span style={{ fontSize: 12, color: "#475569" }}>Fetching from server</span>
                        </div>
                    )}

                    {/* Error fallback */}
                    {loadError && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 16,
                                color: "#94A3B8",
                                padding: 32,
                                textAlign: "center",
                            }}
                        >
                            <FileText style={{ width: 48, height: 48, color: "#475569" }} />
                            <div>
                                <p style={{ fontSize: 16, fontWeight: 600, color: "#CBD5E1", marginBottom: 6 }}>
                                    Preview unavailable
                                </p>
                                <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
                                    The PDF could not be displayed inline. Use the buttons below.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                                <a
                                    href={embedUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "10px 20px",
                                        background: "#3B82F6",
                                        color: "white",
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        textDecoration: "none",
                                    }}
                                >
                                    <ExternalLink style={{ width: 16, height: 16 }} />
                                    Open in New Tab
                                </a>
                                <button
                                    onClick={() => onDownload(note)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "10px 20px",
                                        background: "rgba(255,255,255,0.08)",
                                        color: "#CBD5E1",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: 10,
                                        fontWeight: 600,
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    <Download style={{ width: 16, height: 16 }} />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Google Docs Viewer iframe */}
                    <iframe
                        key={embedUrl}
                        src={embedUrl}
                        title={note.title}
                        onLoad={() => setLoading(false)}
                        onError={() => { setLoading(false); setLoadError(true); }}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            display: loadError ? "none" : "block",
                            opacity: loading ? 0 : 1,
                            transition: "opacity 0.4s",
                        }}
                    />
                </div>
            </div>

            {/* Hint */}
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 10 }}>
                Press <kbd style={{ padding: "1px 6px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.2)", fontFamily: "monospace" }}>Esc</kbd> or click outside to close
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main page shell (Suspense boundary for useSearchParams)
// ─────────────────────────────────────────────
export default function NotesPage() {
    return (
        <Suspense
            fallback={
                <div className="animate-fade-in">
                    <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
                </div>
            }
        >
            <NotesContent />
        </Suspense>
    );
}

// ─────────────────────────────────────────────
// Notes content
// ─────────────────────────────────────────────
function NotesContent() {
    const searchParams = useSearchParams();
    const [notes, setNotes] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subjectId") || "");
    const [user, setUser] = useState<any>(null);
    const [openNote, setOpenNote] = useState<any>(null); // note currently open in PDF viewer

    useEffect(() => {
        Promise.all([
            fetch("/api/subjects").then((r) => r.json()),
            fetch("/api/users").then((r) => r.json()),
        ])
            .then(([subData, userData]) => {
                setSubjects(Array.isArray(subData) ? subData : []);
                setUser(userData);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedSubject) params.set("subjectId", selectedSubject);
        const topicId = searchParams.get("topicId");
        if (topicId) params.set("topicId", topicId);

        fetch(`/api/notes?${params}`)
            .then((r) => r.json())
            .then((data) => setNotes(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedSubject, searchParams]);

    const toggleFavorite = async (noteId: string) => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggleFavorite", itemId: noteId }),
        });
        const res = await fetch("/api/users");
        setUser(await res.json());
    };

    const handleDownload = useCallback(async (note: any) => {
        const url = note.pdfDownloadUrl || note.pdfUrl;
        const fileName = note.title.replace(/[^a-z0-9]/gi, "_") + ".pdf";
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(url, "_blank");
        }
    }, []);

    const filteredNotes = notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            {/* PDF Viewer Modal */}
            {openNote && (
                <PdfViewerModal
                    note={openNote}
                    onClose={() => setOpenNote(null)}
                    onDownload={handleDownload}
                />
            )}

            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Notes &amp; PDFs
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Access and download topic-wise notes and PDF materials
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                    <Search
                        className="w-4 h-4"
                        style={{
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94A3B8",
                        }}
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-styled"
                        style={{ paddingLeft: 40 }}
                        placeholder="Search notes..."
                        id="search-notes"
                    />
                </div>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="input-styled"
                    style={{ maxWidth: 200 }}
                >
                    <option value="">All Subjects</option>
                    {subjects.map((s: any) => (
                        <option key={s._id} value={s._id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 20,
                    }}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                    ))}
                </div>
            ) : filteredNotes.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 20,
                    }}
                >
                    {filteredNotes.map((note: any) => {
                        const isFav = user?.favorites?.includes(note._id);
                        return (
                            <div
                                key={note._id}
                                className="card-hover"
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    overflow: "hidden",
                                    border: "1px solid #E2E8F0",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Card header – clickable to open PDF */}
                                <button
                                    onClick={() => setOpenNote(note)}
                                    style={{
                                        height: 90,
                                        background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                        border: "none",
                                        cursor: "pointer",
                                        width: "100%",
                                        transition: "filter 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.filter = "brightness(1.1)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.filter = "brightness(1)")
                                    }
                                    title="Click to open PDF"
                                >
                                    <FileText
                                        style={{ width: 40, height: 40, color: "#fff", opacity: 0.7 }}
                                    />
                                    {/* Hover overlay hint */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(0,0,0,0)",
                                            color: "white",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            opacity: 0,
                                            transition: "opacity 0.15s, background 0.15s",
                                        }}
                                        className="pdf-hover-hint"
                                    >
                                        📄 Open PDF
                                    </div>
                                    {note.isImportant && (
                                        <span
                                            className="badge-important"
                                            style={{ position: "absolute", top: 10, right: 10 }}
                                        >
                                            ★ Important
                                        </span>
                                    )}
                                </button>

                                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                                    {/* Title — click to open PDF viewer */}
                                    <h4
                                        onClick={() => setOpenNote(note)}
                                        style={{
                                            fontSize: 16,
                                            fontWeight: 600,
                                            color: "#0F172A",
                                            marginBottom: 4,
                                            cursor: "pointer",
                                            lineHeight: 1.4,
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color = "#3B82F6")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.color = "#0F172A")
                                        }
                                    >
                                        {note.title}
                                    </h4>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                                        {note.subjectId?.name || "General"}
                                        {note.topicId?.name ? ` › ${note.topicId.name}` : ""}
                                    </p>
                                    {note.description && (
                                        <p
                                            style={{
                                                fontSize: 13,
                                                color: "#64748B",
                                                marginBottom: 12,
                                                lineHeight: 1.5,
                                                flex: 1,
                                            }}
                                        >
                                            {note.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                            marginTop: "auto",
                                            paddingTop: 12,
                                        }}
                                    >
                                        {/* Open PDF (primary) */}
                                        <button
                                            onClick={() => setOpenNote(note)}
                                            className="btn-primary"
                                            style={{ fontSize: 12, padding: "6px 14px" }}
                                        >
                                            <FileText className="w-3 h-3" /> Open PDF
                                        </button>

                                        {/* Download */}
                                        <button
                                            onClick={() => handleDownload(note)}
                                            className="btn-secondary"
                                            style={{
                                                fontSize: 12,
                                                padding: "6px 14px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 4,
                                            }}
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </button>

                                        {/* External link (small icon button) */}
                                        <a
                                            href={note.pdfUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="Open in new tab"
                                            className="btn-icon"
                                            style={{ color: "#94A3B8" }}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>

                                        {/* Favourite */}
                                        <button
                                            onClick={() => toggleFavorite(note._id)}
                                            className="btn-icon"
                                            style={{
                                                marginLeft: "auto",
                                                color: isFav ? "#F59E0B" : "#94A3B8",
                                            }}
                                        >
                                            <Star className="w-5 h-5" fill={isFav ? "#F59E0B" : "none"} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div
                    style={{
                        background: "white",
                        borderRadius: 16,
                        padding: 60,
                        textAlign: "center",
                        border: "1px solid #E2E8F0",
                    }}
                >
                    <FileText
                        className="w-16 h-16"
                        style={{ color: "#CBD5E1", margin: "0 auto 16px" }}
                    />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                        No Notes Found
                    </h3>
                    <p style={{ color: "#94A3B8" }}>
                        {search
                            ? "Try a different search term."
                            : "Notes will appear once the admin uploads them."}
                    </p>
                </div>
            )}

            {/* Inline styles for hover effects and spinner */}
            <style>{`
                .pdf-hover-hint { pointer-events: none; }
                button:hover .pdf-hover-hint,
                button:focus .pdf-hover-hint {
                    opacity: 1 !important;
                    background: rgba(0,0,0,0.35) !important;
                }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 520px) { .hide-mobile { display: none; } }
            `}</style>
        </div>
    );
}

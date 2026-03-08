"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText, Download, Star, Search, ExternalLink, Clock } from "lucide-react";

export default function NotesPage() {
    return (
        <Suspense fallback={<div className="animate-fade-in"><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>}>
            <NotesContent />
        </Suspense>
    );
}

function NotesContent() {
    const searchParams = useSearchParams();
    const [notes, setNotes] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subjectId") || "");
    const [user, setUser] = useState<any>(null);

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

    const filteredNotes = notes.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Notes & PDFs
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Access and download topic-wise notes and PDF materials
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                    <Search className="w-4 h-4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
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
                        <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                </select>
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                    ))}
                </div>
            ) : filteredNotes.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
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
                                }}
                            >
                                <div
                                    style={{
                                        height: 80,
                                        background: "linear-gradient(135deg, #06B6D4, #3B82F6)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "relative",
                                    }}
                                >
                                    <FileText className="w-10 h-10 text-white" style={{ opacity: 0.6 }} />
                                    {note.isImportant && (
                                        <span className="badge-important" style={{ position: "absolute", top: 10, right: 10 }}>
                                            ★ Important
                                        </span>
                                    )}
                                </div>
                                <div style={{ padding: 16 }}>
                                    <h4 style={{ fontSize: 16, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>
                                        {note.title}
                                    </h4>
                                    <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                                        {note.subjectId?.name || "General"} {note.topicId?.name ? `→ ${note.topicId.name}` : ""}
                                    </p>
                                    {note.description && (
                                        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12, lineHeight: 1.5 }}>
                                            {note.description}
                                        </p>
                                    )}
                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                        <a
                                            href={note.pdfUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-primary"
                                            style={{ fontSize: 12, padding: "6px 14px" }}
                                        >
                                            <ExternalLink className="w-3 h-3" /> View PDF
                                        </a>
                                        <a
                                            href={note.pdfUrl}
                                            download
                                            className="btn-secondary"
                                            style={{ fontSize: 12, padding: "6px 14px" }}
                                        >
                                            <Download className="w-3 h-3" /> Download
                                        </a>
                                        <button
                                            onClick={() => toggleFavorite(note._id)}
                                            className="btn-icon"
                                            style={{ marginLeft: "auto", color: isFav ? "#F59E0B" : "#94A3B8" }}
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
                <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <FileText className="w-16 h-16" style={{ color: "#CBD5E1", margin: "0 auto 16px" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Notes Found</h3>
                    <p style={{ color: "#94A3B8" }}>
                        {search ? "Try a different search term." : "Notes will appear once the admin uploads them."}
                    </p>
                </div>
            )}
        </div>
    );
}

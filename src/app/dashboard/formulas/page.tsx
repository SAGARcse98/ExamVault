"use client";

import { useEffect, useState } from "react";
import { Brain, Search, ChevronDown, ChevronUp, BookOpen, Tag } from "lucide-react";

export default function FormulasPage() {
    const [formulas, setFormulas] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        Promise.all([
            fetch("/api/subjects").then((r) => r.json()),
            fetch("/api/formulas").then((r) => r.json()),
        ])
            .then(([subData, formulaData]) => {
                setSubjects(Array.isArray(subData) ? subData : []);
                setFormulas(Array.isArray(formulaData) ? formulaData : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const expandAll = () => setExpandedIds(new Set(filteredFormulas.map((f) => f._id)));
    const collapseAll = () => setExpandedIds(new Set());

    const filteredFormulas = formulas.filter((f) => {
        const matchesSearch =
            f.title.toLowerCase().includes(search.toLowerCase()) ||
            f.content.toLowerCase().includes(search.toLowerCase()) ||
            f.tags?.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesSubject = !selectedSubject || f.subjectId?._id === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    // Group by subject
    const grouped = filteredFormulas.reduce((acc: any, formula: any) => {
        const subName = formula.subjectId?.name || "General";
        if (!acc[subName]) acc[subName] = [];
        acc[subName].push(formula);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                    Formulas & Tricks
                </h2>
                <p style={{ color: "#64748B", fontSize: 15 }}>
                    Quick-access formula sheets, short tricks, and memory tips
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 250px" }}>
                    <Search className="w-4 h-4" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-styled"
                        style={{ paddingLeft: 40 }}
                        placeholder="Search formulas, tricks..."
                        id="search-formulas"
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
                <button onClick={expandAll} className="btn-secondary" style={{ fontSize: 12, padding: "8px 14px" }}>
                    Expand All
                </button>
                <button onClick={collapseAll} className="btn-secondary" style={{ fontSize: 12, padding: "8px 14px" }}>
                    Collapse All
                </button>
            </div>

            {/* Grouped Accordion */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 70, borderRadius: 14 }} />
                    ))}
                </div>
            ) : Object.keys(grouped).length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {Object.entries(grouped).map(([subjectName, formulas]: [string, any]) => (
                        <div key={subjectName}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                <BookOpen className="w-5 h-5 text-primary" />
                                {subjectName}
                                <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 50, background: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }}>
                                    {formulas.length}
                                </span>
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {formulas.map((formula: any) => {
                                    const isExpanded = expandedIds.has(formula._id);
                                    return (
                                        <div
                                            key={formula._id}
                                            style={{
                                                background: "white",
                                                borderRadius: 14,
                                                border: "1px solid #E2E8F0",
                                                overflow: "hidden",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleExpand(formula._id)}
                                                style={{
                                                    width: "100%",
                                                    padding: "16px 20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    border: "none",
                                                    background: "transparent",
                                                    cursor: "pointer",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <div>
                                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
                                                        {formula.title}
                                                    </h4>
                                                    {formula.topicId?.name && (
                                                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{formula.topicId.name}</span>
                                                    )}
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-muted" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-muted" />
                                                )}
                                            </button>
                                            {isExpanded && (
                                                <div
                                                    style={{
                                                        padding: "0 20px 20px",
                                                        borderTop: "1px solid #F1F5F9",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            padding: "16px 20px",
                                                            background: "#F8FAFC",
                                                            borderRadius: 10,
                                                            fontSize: 14,
                                                            lineHeight: 1.8,
                                                            color: "#334155",
                                                            whiteSpace: "pre-wrap",
                                                            marginTop: 12,
                                                            fontFamily: "'Inter', system-ui, sans-serif",
                                                        }}
                                                    >
                                                        {formula.content}
                                                    </div>
                                                    {formula.tags?.length > 0 && (
                                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                                                            {formula.tags.map((tag: string, i: number) => (
                                                                <span
                                                                    key={i}
                                                                    style={{
                                                                        fontSize: 11,
                                                                        padding: "3px 10px",
                                                                        borderRadius: 50,
                                                                        background: "#EEF2FF",
                                                                        color: "#4F46E5",
                                                                        fontWeight: 500,
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: 4,
                                                                    }}
                                                                >
                                                                    <Tag className="w-3 h-3" /> {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ background: "white", borderRadius: 16, padding: 60, textAlign: "center", border: "1px solid #E2E8F0" }}>
                    <Brain className="w-14 h-14" style={{ color: "#CBD5E1", margin: "0 auto 12px" }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#374151", marginBottom: 8 }}>No Formulas Found</h3>
                    <p style={{ color: "#94A3B8" }}>
                        {search ? "Try a different search term." : "Formulas will appear once the admin adds them."}
                    </p>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Brain, X, Tag } from "lucide-react";

export default function AdminFormulasPage() {
    const [formulas, setFormulas] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [form, setForm] = useState({
        title: "", content: "", subjectId: "", topicId: "", tags: "",
    });

    const fetchData = async () => {
        try {
            const [fRes, subRes, topicRes] = await Promise.all([
                fetch("/api/formulas"), fetch("/api/subjects"), fetch("/api/topics"),
            ]);
            setFormulas(await fRes.json().then(d => Array.isArray(d) ? d : []));
            setSubjects(await subRes.json().then(d => Array.isArray(d) ? d : []));
            setTopics(await topicRes.json().then(d => Array.isArray(d) ? d : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/api/formulas/${editItem._id}` : "/api/formulas";
        const payload = {
            ...form,
            tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        };
        await fetch(url, {
            method: editItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        setShowModal(false); setEditItem(null);
        setForm({ title: "", content: "", subjectId: "", topicId: "", tags: "" });
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this formula?")) return;
        await fetch(`/api/formulas/${id}`, { method: "DELETE" });
        fetchData();
    };

    const openEdit = (f: any) => {
        setEditItem(f);
        setForm({
            title: f.title, content: f.content || "",
            subjectId: f.subjectId?._id || f.subjectId || "",
            topicId: f.topicId?._id || f.topicId || "",
            tags: (f.tags || []).join(", "),
        });
        setShowModal(true);
    };

    const filteredTopics = form.subjectId ? topics.filter((t: any) => (t.subjectId?._id || t.subjectId) === form.subjectId) : topics;

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Formula Management</h2>
                <button onClick={() => { setEditItem(null); setForm({ title: "", content: "", subjectId: "", topicId: "", tags: "" }); setShowModal(true); }} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Formula
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editItem ? "Edit Formula" : "Add Formula"}</h3>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Title *</label>
                                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-styled" required />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Subject *</label>
                                    <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value, topicId: "" })} className="input-styled" required>
                                        <option value="">Select</option>
                                        {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Topic *</label>
                                    <select value={form.topicId} onChange={(e) => setForm({ ...form, topicId: e.target.value })} className="input-styled" required>
                                        <option value="">Select</option>
                                        {filteredTopics.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Content * (formula text, tricks, tips)</label>
                                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input-styled" style={{ minHeight: 130, resize: "vertical", fontFamily: "'Inter', monospace" }} required placeholder="Write formula or trick here..." />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Tags (comma-separated)</label>
                                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-styled" placeholder="e.g. percentage, ratio, shortcut" />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                                {editItem ? "Update Formula" : "Add Formula"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 120, borderRadius: 8 }} /></div>
                ) : formulas.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr><th>Title</th><th>Subject</th><th>Topic</th><th>Tags</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {formulas.map((f) => (
                                <tr key={f._id}>
                                    <td style={{ fontWeight: 600, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.title}</td>
                                    <td style={{ color: "#64748B" }}>{f.subjectId?.name || "—"}</td>
                                    <td style={{ color: "#64748B" }}>{f.topicId?.name || "—"}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                            {f.tags?.slice(0, 3).map((tag: string, i: number) => (
                                                <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 50, background: "#EEF2FF", color: "#4F46E5", fontWeight: 500 }}>{tag}</span>
                                            ))}
                                            {f.tags?.length > 3 && <span style={{ fontSize: 11, color: "#94A3B8" }}>+{f.tags.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => openEdit(f)} className="btn-icon"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(f._id)} className="btn-icon" style={{ color: "#EF4444" }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No formulas yet.</div>
                )}
            </div>
        </div>
    );
}

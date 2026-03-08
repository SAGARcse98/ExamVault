"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, FileText, X, Upload, Link2 } from "lucide-react";

export default function AdminNotesPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        title: "", pdfUrl: "", description: "", subjectId: "", topicId: "", isImportant: false,
    });

    const fetchData = async () => {
        try {
            const [noteRes, subRes, topicRes] = await Promise.all([
                fetch("/api/notes"), fetch("/api/subjects"), fetch("/api/topics"),
            ]);
            setNotes(await noteRes.json().then(d => Array.isArray(d) ? d : []));
            setSubjects(await subRes.json().then(d => Array.isArray(d) ? d : []));
            setTopics(await topicRes.json().then(d => Array.isArray(d) ? d : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "pdf");
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({ ...prev, pdfUrl: data.url }));
            } else {
                alert("Upload failed: " + data.error);
            }
        } catch (e) {
            alert("Upload failed. Please try again.");
            console.error(e);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/api/notes/${editItem._id}` : "/api/notes";
        await fetch(url, {
            method: editItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setShowModal(false); setEditItem(null);
        setForm({ title: "", pdfUrl: "", description: "", subjectId: "", topicId: "", isImportant: false });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this note?")) return;
        await fetch(`/api/notes/${id}`, { method: "DELETE" });
        fetchData();
    };

    const openEdit = (n: any) => {
        setEditItem(n);
        setForm({
            title: n.title, pdfUrl: n.pdfUrl, description: n.description || "",
            subjectId: n.subjectId?._id || n.subjectId || "",
            topicId: n.topicId?._id || n.topicId || "",
            isImportant: n.isImportant || false,
        });
        setUploadMode("url");
        setShowModal(true);
    };

    const filteredTopics = form.subjectId ? topics.filter((t: any) => (t.subjectId?._id || t.subjectId) === form.subjectId) : topics;

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Notes Management</h2>
                <button onClick={() => { setEditItem(null); setUploadMode("file"); setForm({ title: "", pdfUrl: "", description: "", subjectId: "", topicId: "", isImportant: false }); setShowModal(true); }} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Note
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editItem ? "Edit Note" : "Add Note"}</h3>
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

                            {/* Upload Mode Toggle */}
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>PDF Source *</label>
                                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                                    <button type="button" onClick={() => setUploadMode("file")}
                                        style={{
                                            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                            border: "1px solid", display: "flex", alignItems: "center", gap: 6,
                                            background: uploadMode === "file" ? "#4F46E5" : "white",
                                            color: uploadMode === "file" ? "white" : "#64748B",
                                            borderColor: uploadMode === "file" ? "#4F46E5" : "#E2E8F0",
                                        }}>
                                        <Upload className="w-4 h-4" /> Upload File
                                    </button>
                                    <button type="button" onClick={() => setUploadMode("url")}
                                        style={{
                                            padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                            border: "1px solid", display: "flex", alignItems: "center", gap: 6,
                                            background: uploadMode === "url" ? "#4F46E5" : "white",
                                            color: uploadMode === "url" ? "white" : "#64748B",
                                            borderColor: uploadMode === "url" ? "#4F46E5" : "#E2E8F0",
                                        }}>
                                        <Link2 className="w-4 h-4" /> Paste URL
                                    </button>
                                </div>

                                {uploadMode === "file" ? (
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(file);
                                            }}
                                            className="input-styled"
                                            style={{ padding: 10 }}
                                        />
                                        {uploading && (
                                            <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: "#EEF2FF", color: "#4F46E5", fontSize: 13, fontWeight: 500 }}>
                                                ⏳ Uploading PDF...
                                            </div>
                                        )}
                                        {form.pdfUrl && !uploading && uploadMode === "file" && (
                                            <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: "#F0FDF4", color: "#16A34A", fontSize: 13, fontWeight: 500 }}>
                                                ✓ PDF uploaded successfully
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input value={form.pdfUrl} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className="input-styled" required placeholder="https://example.com/file.pdf" />
                                )}
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-styled" style={{ minHeight: 70, resize: "vertical" }} />
                            </div>
                            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                                <div className={`toggle-switch ${form.isImportant ? "active" : ""}`} onClick={() => setForm({ ...form, isImportant: !form.isImportant })} />
                                <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Mark as Important</label>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={uploading || !form.pdfUrl}>
                                {uploading ? "Uploading..." : editItem ? "Update Note" : "Add Note"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 120, borderRadius: 8 }} /></div>
                ) : notes.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr><th>Title</th><th>Subject</th><th>Topic</th><th>Important</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {notes.map((n) => (
                                <tr key={n._id}>
                                    <td style={{ fontWeight: 600, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</td>
                                    <td style={{ color: "#64748B" }}>{n.subjectId?.name || "—"}</td>
                                    <td style={{ color: "#64748B" }}>{n.topicId?.name || "—"}</td>
                                    <td>{n.isImportant ? <span className="badge-important">★ Yes</span> : <span style={{ color: "#94A3B8", fontSize: 13 }}>No</span>}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => openEdit(n)} className="btn-icon"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(n._id)} className="btn-icon" style={{ color: "#EF4444" }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No notes yet.</div>
                )}
            </div>
        </div>
    );
}

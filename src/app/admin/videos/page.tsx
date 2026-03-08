"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Edit2, Trash2, Video, X, Upload, Link2 } from "lucide-react";

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        title: "", description: "", videoUrl: "", thumbnail: "", duration: "",
        subjectId: "", topicId: "", isImportant: false,
    });

    const fetchData = async () => {
        try {
            const [vidRes, subRes, topicRes] = await Promise.all([
                fetch("/api/videos"), fetch("/api/subjects"), fetch("/api/topics"),
            ]);
            setVideos(await vidRes.json().then(d => Array.isArray(d) ? d : []));
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
            formData.append("type", "video");
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setForm(prev => ({ ...prev, videoUrl: data.url }));
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
        const url = editItem ? `/api/videos/${editItem._id}` : "/api/videos";
        await fetch(url, {
            method: editItem ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        setShowModal(false); setEditItem(null);
        setForm({ title: "", description: "", videoUrl: "", thumbnail: "", duration: "", subjectId: "", topicId: "", isImportant: false });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this video?")) return;
        await fetch(`/api/videos/${id}`, { method: "DELETE" });
        fetchData();
    };

    const openEdit = (v: any) => {
        setEditItem(v);
        setForm({
            title: v.title, description: v.description || "", videoUrl: v.videoUrl,
            thumbnail: v.thumbnail || "", duration: v.duration || "",
            subjectId: v.subjectId?._id || v.subjectId || "",
            topicId: v.topicId?._id || v.topicId || "",
            isImportant: v.isImportant || false,
        });
        setUploadMode("url");
        setShowModal(true);
    };

    const filteredTopics = form.subjectId ? topics.filter((t: any) => (t.subjectId?._id || t.subjectId) === form.subjectId) : topics;

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Video Management</h2>
                <button onClick={() => { setEditItem(null); setUploadMode("file"); setForm({ title: "", description: "", videoUrl: "", thumbnail: "", duration: "", subjectId: "", topicId: "", isImportant: false }); setShowModal(true); }} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Video
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editItem ? "Edit Video" : "Add Video"}</h3>
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
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Video Source *</label>
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
                                            accept="video/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(file);
                                            }}
                                            className="input-styled"
                                            style={{ padding: 10 }}
                                        />
                                        {uploading && (
                                            <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: "#EEF2FF", color: "#4F46E5", fontSize: 13, fontWeight: 500 }}>
                                                ⏳ Uploading video...
                                            </div>
                                        )}
                                        {form.videoUrl && !uploading && uploadMode === "file" && (
                                            <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 8, background: "#F0FDF4", color: "#16A34A", fontSize: 13, fontWeight: 500 }}>
                                                ✓ Video uploaded successfully
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="input-styled" required placeholder="https://youtube.com/watch?v=..." />
                                )}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Duration</label>
                                    <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-styled" placeholder="e.g. 15:30" />
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Thumbnail URL</label>
                                    <input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="input-styled" placeholder="Optional" />
                                </div>
                            </div>
                            <div style={{ marginBottom: 14 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-styled" style={{ minHeight: 80, resize: "vertical" }} />
                            </div>
                            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                                <div className={`toggle-switch ${form.isImportant ? "active" : ""}`} onClick={() => setForm({ ...form, isImportant: !form.isImportant })} />
                                <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Mark as Important</label>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={uploading || !form.videoUrl}>
                                {uploading ? "Uploading..." : editItem ? "Update Video" : "Add Video"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 120, borderRadius: 8 }} /></div>
                ) : videos.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr><th>Title</th><th>Subject</th><th>Topic</th><th>Important</th><th>Duration</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {videos.map((v) => (
                                <tr key={v._id}>
                                    <td style={{ fontWeight: 600, maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</td>
                                    <td style={{ color: "#64748B" }}>{v.subjectId?.name || "—"}</td>
                                    <td style={{ color: "#64748B" }}>{v.topicId?.name || "—"}</td>
                                    <td>{v.isImportant ? <span className="badge-important">★ Yes</span> : <span style={{ color: "#94A3B8", fontSize: 13 }}>No</span>}</td>
                                    <td style={{ color: "#94A3B8" }}>{v.duration || "—"}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => openEdit(v)} className="btn-icon"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(v._id)} className="btn-icon" style={{ color: "#EF4444" }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No videos yet.</div>
                )}
            </div>
        </div>
    );
}

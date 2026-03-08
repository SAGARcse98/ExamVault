"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, BookOpen, Hash, X } from "lucide-react";

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [topics, setTopics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [editTopic, setEditTopic] = useState<any>(null);
    const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "BookOpen", order: 0 });
    const [topicForm, setTopicForm] = useState({ name: "", slug: "", subjectId: "" });
    const [selectedSubjectForTopics, setSelectedSubjectForTopics] = useState("");

    const fetchData = async () => {
        try {
            const [subRes, topicRes] = await Promise.all([
                fetch("/api/subjects"),
                fetch("/api/topics"),
            ]);
            const [subData, topicData] = await Promise.all([
                subRes.json(),
                topicRes.json(),
            ]);
            setSubjects(Array.isArray(subData) ? subData : []);
            setTopics(Array.isArray(topicData) ? topicData : []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const slugify = (text: string) => text.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editItem ? `/api/subjects/${editItem._id}` : "/api/subjects";
        const method = editItem ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, slug: form.slug || slugify(form.name) }),
        });
        setShowModal(false);
        setEditItem(null);
        setForm({ name: "", slug: "", description: "", icon: "BookOpen", order: 0 });
        fetchData();
    };

    const handleTopicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editTopic ? `/api/topics/${editTopic._id}` : "/api/topics";
        const method = editTopic ? "PUT" : "POST";
        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...topicForm, slug: topicForm.slug || slugify(topicForm.name) }),
        });
        setShowTopicModal(false);
        setEditTopic(null);
        setTopicForm({ name: "", slug: "", subjectId: "" });
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subject?")) return;
        await fetch(`/api/subjects/${id}`, { method: "DELETE" });
        fetchData();
    };

    const handleDeleteTopic = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/topics/${id}`, { method: "DELETE" });
        fetchData();
    };

    const openEdit = (subject: any) => {
        setEditItem(subject);
        setForm({ name: subject.name, slug: subject.slug, description: subject.description || "", icon: subject.icon || "BookOpen", order: subject.order || 0 });
        setShowModal(true);
    };

    const openEditTopic = (topic: any) => {
        setEditTopic(topic);
        setTopicForm({ name: topic.name, slug: topic.slug, subjectId: topic.subjectId?._id || topic.subjectId });
        setShowTopicModal(true);
    };

    const filteredTopics = selectedSubjectForTopics
        ? topics.filter((t: any) => (t.subjectId?._id || t.subjectId) === selectedSubjectForTopics)
        : topics;

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Subject & Topic Management</h2>
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        onClick={() => { setEditItem(null); setForm({ name: "", slug: "", description: "", icon: "BookOpen", order: 0 }); setShowModal(true); }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Subject
                    </button>
                    <button
                        onClick={() => { setEditTopic(null); setTopicForm({ name: "", slug: "", subjectId: subjects[0]?._id || "" }); setShowTopicModal(true); }}
                        className="btn-secondary"
                    >
                        <Plus className="w-4 h-4" /> Add Topic
                    </button>
                </div>
            </div>

            {/* Subject Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editItem ? "Edit Subject" : "Add Subject"}</h3>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Name *</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="input-styled" required />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Slug</label>
                                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-styled" />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Description</label>
                                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-styled" />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Order</label>
                                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="input-styled" />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                                {editItem ? "Update Subject" : "Create Subject"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Topic Modal */}
            {showTopicModal && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>{editTopic ? "Edit Topic" : "Add Topic"}</h3>
                            <button onClick={() => setShowTopicModal(false)} className="btn-icon"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleTopicSubmit}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Subject *</label>
                                <select value={topicForm.subjectId} onChange={(e) => setTopicForm({ ...topicForm, subjectId: e.target.value })} className="input-styled" required>
                                    <option value="">Select Subject</option>
                                    {subjects.map((s: any) => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Topic Name *</label>
                                <input value={topicForm.name} onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value, slug: slugify(e.target.value) })} className="input-styled" required />
                            </div>
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Slug</label>
                                <input value={topicForm.slug} onChange={(e) => setTopicForm({ ...topicForm, slug: e.target.value })} className="input-styled" />
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                                {editTopic ? "Update Topic" : "Create Topic"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Subjects Table */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <BookOpen className="w-5 h-5 text-primary" /> Subjects
                    </h3>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: "center" }}><div className="skeleton" style={{ height: 100, borderRadius: 8 }} /></div>
                ) : subjects.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((s) => (
                                <tr key={s._id}>
                                    <td style={{ fontWeight: 600, color: "#4F46E5" }}>{s.order}</td>
                                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ color: "#94A3B8" }}>{s.slug}</td>
                                    <td style={{ color: "#64748B", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description || "—"}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => openEdit(s)} className="btn-icon" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(s._id)} className="btn-icon" style={{ color: "#EF4444" }} title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No subjects yet. Add one above.</div>
                )}
            </div>

            {/* Topics Table */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                        <Hash className="w-5 h-5 text-secondary" /> Topics
                    </h3>
                    <select
                        value={selectedSubjectForTopics}
                        onChange={(e) => setSelectedSubjectForTopics(e.target.value)}
                        className="input-styled"
                        style={{ maxWidth: 200, padding: "6px 12px" }}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((s: any) => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                {filteredTopics.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr>
                                <th>Topic</th>
                                <th>Subject</th>
                                <th>Slug</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTopics.map((t: any) => (
                                <tr key={t._id}>
                                    <td style={{ fontWeight: 600 }}>{t.name}</td>
                                    <td style={{ color: "#64748B" }}>{t.subjectId?.name || "—"}</td>
                                    <td style={{ color: "#94A3B8" }}>{t.slug}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: 6 }}>
                                            <button onClick={() => openEditTopic(t)} className="btn-icon" title="Edit"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteTopic(t._id)} className="btn-icon" style={{ color: "#EF4444" }} title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>No topics yet. Add one above.</div>
                )}
            </div>
        </div>
    );
}

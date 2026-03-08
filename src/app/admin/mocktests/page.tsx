"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";

interface Question {
    questionText: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    marks: number;
}

const emptyQuestion: Question = {
    questionText: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "", marks: 1,
};

export default function AdminMockTestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [expandedTest, setExpandedTest] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: "", description: "", duration: 30, negativeMarking: 0.25,
        difficulty: "medium" as string, isPublished: true,
    });
    const [questions, setQuestions] = useState<Question[]>([{ ...emptyQuestion }]);
    const [activeQ, setActiveQ] = useState(0);

    const fetchData = async () => {
        try {
            // Fetch all tests including unpublished (admin view)
            const res = await fetch("/api/mocktests/admin");
            if (!res.ok) {
                // Fallback to regular endpoint
                const res2 = await fetch("/api/mocktests");
                setTests(await res2.json().then(d => Array.isArray(d) ? d : []));
                return;
            }
            setTests(await res.json().then(d => Array.isArray(d) ? d : []));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setForm({ title: "", description: "", duration: 30, negativeMarking: 0.25, difficulty: "medium", isPublished: true });
        setQuestions([{ ...emptyQuestion }]);
        setActiveQ(0);
        setEditItem(null);
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = async (test: any) => {
        // Fetch full test with questions
        try {
            const res = await fetch(`/api/mocktests/${test._id}`);
            const fullTest = await res.json();
            setEditItem(fullTest);
            setForm({
                title: fullTest.title || "",
                description: fullTest.description || "",
                duration: fullTest.duration || 30,
                negativeMarking: fullTest.negativeMarking ?? 0.25,
                difficulty: fullTest.difficulty || "medium",
                isPublished: fullTest.isPublished ?? true,
            });
            setQuestions(fullTest.questions?.length > 0
                ? fullTest.questions.map((q: any) => ({
                    questionText: q.questionText || "",
                    options: q.options?.length === 4 ? [...q.options] : ["", "", "", ""],
                    correctAnswer: q.correctAnswer ?? 0,
                    explanation: q.explanation || "",
                    marks: q.marks ?? 1,
                }))
                : [{ ...emptyQuestion }]
            );
            setActiveQ(0);
            setShowForm(true);
        } catch (e) {
            console.error(e);
            alert("Failed to load test details.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this mock test and all its data?")) return;
        await fetch(`/api/mocktests/${id}`, { method: "DELETE" });
        fetchData();
    };

    const updateQuestion = (idx: number, field: string, value: any) => {
        setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
    };

    const updateOption = (qIdx: number, optIdx: number, value: string) => {
        setQuestions(prev => prev.map((q, i) => {
            if (i !== qIdx) return q;
            const opts = [...q.options];
            opts[optIdx] = value;
            return { ...q, options: opts };
        }));
    };

    const addQuestion = () => {
        setQuestions(prev => [...prev, { ...emptyQuestion }]);
        setActiveQ(questions.length);
    };

    const removeQuestion = (idx: number) => {
        if (questions.length <= 1) return;
        setQuestions(prev => prev.filter((_, i) => i !== idx));
        if (activeQ >= questions.length - 1) setActiveQ(Math.max(0, questions.length - 2));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) { alert(`Question ${i + 1} text is empty.`); setActiveQ(i); return; }
            if (q.options.some(o => !o.trim())) { alert(`Question ${i + 1} has empty options.`); setActiveQ(i); return; }
        }

        setSaving(true);
        try {
            const totalQuestions = questions.length;
            const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
            const payload = { ...form, questions, totalQuestions, totalMarks };

            const url = editItem ? `/api/mocktests/${editItem._id}` : "/api/mocktests";
            const res = await fetch(url, {
                method: editItem ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                alert("Error: " + (err.error || "Failed to save"));
                return;
            }

            setShowForm(false);
            resetForm();
            fetchData();
        } catch (e) {
            console.error(e);
            alert("Failed to save mock test.");
        } finally {
            setSaving(false);
        }
    };

    const diffColors: any = {
        easy: { bg: "#F0FDF4", color: "#16A34A" },
        medium: { bg: "#FEF9C3", color: "#CA8A04" },
        hard: { bg: "#FEF2F2", color: "#DC2626" },
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: 10,
        border: "1px solid #E2E8F0", fontSize: 14, color: "#0F172A",
        outline: "none", boxSizing: "border-box", background: "white",
    };

    const labelStyle: React.CSSProperties = {
        display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#374151",
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A" }}>Mock Tests Management</h2>
                <button onClick={openCreate} className="btn-primary">
                    <Plus className="w-4 h-4" /> Add Mock Test
                </button>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>
                                {editItem ? "Edit Mock Test" : "Create Mock Test"}
                            </h3>
                            <button onClick={() => { setShowForm(false); resetForm(); }} className="btn-icon"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Test Info */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Title *</label>
                                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    style={inputStyle} required placeholder="e.g. Quantitative Aptitude - Practice Set 1" />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} placeholder="Brief description of this test..." />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                                <div>
                                    <label style={labelStyle}>Duration (min) *</label>
                                    <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })}
                                        style={inputStyle} required min={1} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Difficulty *</label>
                                    <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                        style={{ ...inputStyle, cursor: "pointer" }}>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Negative Marking</label>
                                    <input type="number" value={form.negativeMarking} onChange={(e) => setForm({ ...form, negativeMarking: +e.target.value })}
                                        style={inputStyle} step={0.05} min={0} max={1} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                                <div className={`toggle-switch ${form.isPublished ? "active" : ""}`}
                                    onClick={() => setForm({ ...form, isPublished: !form.isPublished })} />
                                <label style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Published (visible to users)</label>
                            </div>

                            {/* Questions Section */}
                            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 20, marginBottom: 16 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                    <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                                        Questions ({questions.length})
                                    </h4>
                                    <button type="button" onClick={addQuestion} className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }}>
                                        <Plus className="w-3.5 h-3.5" /> Add Question
                                    </button>
                                </div>

                                {/* Question nav grid */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                    {questions.map((q, i) => (
                                        <button key={i} type="button" onClick={() => setActiveQ(i)}
                                            style={{
                                                width: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600,
                                                border: "1px solid", cursor: "pointer",
                                                background: activeQ === i ? "#4F46E5" : q.questionText.trim() ? "#F0FDF4" : "#F8FAFC",
                                                color: activeQ === i ? "white" : q.questionText.trim() ? "#16A34A" : "#94A3B8",
                                                borderColor: activeQ === i ? "#4F46E5" : q.questionText.trim() ? "#BBF7D0" : "#E2E8F0",
                                            }}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                {/* Active question editor */}
                                {questions[activeQ] && (
                                    <div style={{ background: "#F8FAFC", borderRadius: 14, padding: 20, border: "1px solid #E2E8F0" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#4F46E5" }}>
                                                Question {activeQ + 1}
                                            </span>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <input type="number" value={questions[activeQ].marks}
                                                    onChange={(e) => updateQuestion(activeQ, "marks", +e.target.value)}
                                                    style={{ ...inputStyle, width: 70, padding: "4px 8px", textAlign: "center" as const }}
                                                    min={1} title="Marks" />
                                                <span style={{ fontSize: 12, color: "#94A3B8", alignSelf: "center" }}>marks</span>
                                                {questions.length > 1 && (
                                                    <button type="button" onClick={() => removeQuestion(activeQ)}
                                                        className="btn-icon" style={{ color: "#EF4444" }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 14 }}>
                                            <label style={labelStyle}>Question Text *</label>
                                            <textarea value={questions[activeQ].questionText}
                                                onChange={(e) => updateQuestion(activeQ, "questionText", e.target.value)}
                                                style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
                                                placeholder="Enter your question here..." required />
                                        </div>

                                        <div style={{ marginBottom: 14 }}>
                                            <label style={labelStyle}>Options *</label>
                                            {questions[activeQ].options.map((opt, oi) => (
                                                <div key={oi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                                                    <div onClick={() => updateQuestion(activeQ, "correctAnswer", oi)}
                                                        style={{
                                                            width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
                                                            border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 13, fontWeight: 700, flexShrink: 0,
                                                            background: questions[activeQ].correctAnswer === oi ? "#16A34A" : "white",
                                                            color: questions[activeQ].correctAnswer === oi ? "white" : "#94A3B8",
                                                            borderColor: questions[activeQ].correctAnswer === oi ? "#16A34A" : "#E2E8F0",
                                                        }}>
                                                        {String.fromCharCode(65 + oi)}
                                                    </div>
                                                    <input value={opt} onChange={(e) => updateOption(activeQ, oi, e.target.value)}
                                                        style={{ ...inputStyle, flex: 1 }}
                                                        placeholder={`Option ${String.fromCharCode(65 + oi)}`} required />
                                                </div>
                                            ))}
                                            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                                                Click the circle to mark as correct answer (green = correct)
                                            </p>
                                        </div>

                                        <div>
                                            <label style={labelStyle}>Explanation</label>
                                            <textarea value={questions[activeQ].explanation}
                                                onChange={(e) => updateQuestion(activeQ, "explanation", e.target.value)}
                                                style={{ ...inputStyle, minHeight: 50, resize: "vertical" }}
                                                placeholder="Explain why this answer is correct..." />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Nav buttons */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                <button type="button" disabled={activeQ === 0}
                                    onClick={() => setActiveQ(prev => prev - 1)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: "1px solid #E2E8F0", background: "white", color: "#64748B",
                                        cursor: activeQ === 0 ? "not-allowed" : "pointer", opacity: activeQ === 0 ? 0.5 : 1,
                                    }}>
                                    ← Previous
                                </button>
                                <button type="button" disabled={activeQ === questions.length - 1}
                                    onClick={() => setActiveQ(prev => prev + 1)}
                                    style={{
                                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        border: "1px solid #E2E8F0", background: "white", color: "#64748B",
                                        cursor: activeQ === questions.length - 1 ? "not-allowed" : "pointer",
                                        opacity: activeQ === questions.length - 1 ? 0.5 : 1,
                                    }}>
                                    Next →
                                </button>
                            </div>

                            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
                                disabled={saving}>
                                {saving ? "Saving..." : editItem ? "Update Mock Test" : "Create Mock Test"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Test List */}
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                {loading ? (
                    <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 120, borderRadius: 8 }} /></div>
                ) : tests.length > 0 ? (
                    <table className="table-styled">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Questions</th>
                                <th>Duration</th>
                                <th>Difficulty</th>
                                <th>Published</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tests.map((t) => {
                                const dc = diffColors[t.difficulty] || diffColors.medium;
                                return (
                                    <tr key={t._id}>
                                        <td style={{ fontWeight: 600, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <ClipboardList className="w-4 h-4" style={{ color: "#4F46E5", flexShrink: 0 }} />
                                                {t.title}
                                            </div>
                                        </td>
                                        <td style={{ color: "#64748B" }}>{t.totalQuestions} Qs</td>
                                        <td style={{ color: "#64748B" }}>{t.duration} min</td>
                                        <td>
                                            <span style={{
                                                fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 50,
                                                background: dc.bg, color: dc.color,
                                            }}>
                                                {t.difficulty}
                                            </span>
                                        </td>
                                        <td>
                                            {t.isPublished ? (
                                                <span style={{ color: "#16A34A", fontSize: 13, fontWeight: 600 }}>✓ Yes</span>
                                            ) : (
                                                <span style={{ color: "#94A3B8", fontSize: 13 }}>Draft</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => openEdit(t)} className="btn-icon"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(t._id)} className="btn-icon" style={{ color: "#EF4444" }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                        No mock tests yet. Click &quot;Add Mock Test&quot; to create one.
                    </div>
                )}
            </div>
        </div>
    );
}

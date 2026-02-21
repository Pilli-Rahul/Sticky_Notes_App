import { useEffect, useMemo, useState } from "react";
import API from "./services/Api";

const FORM_KEY = "sticky-notes:form";
const THEME_KEY = "sticky-notes:theme";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [form, setForm] = useState({ title: "", content: "", tags: "", color: "#7f60f9" });
  const [editingId, setEditingId] = useState(null);
  const [theme, setTheme] = useState("dark");
  const palette = ["#7f60f9", "#22d3ee", "#f59e0b", "#10b981", "#ef4444", "#111827", "#e5e7eb"];

  useEffect(() => {
    const savedForm = localStorage.getItem(FORM_KEY);
    if (savedForm) {
      try {
        setForm({ ...form, ...JSON.parse(savedForm) });
      } catch (_) {
        // ignore parse errors
      }
    }
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(FORM_KEY, JSON.stringify(form));
    }, 400);
    return () => clearTimeout(id);
  }, [form]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/notes");
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ title: "", content: "", tags: "", color: "#7f60f9" });
    setEditingId(null);
    localStorage.removeItem(FORM_KEY);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() && !form.content.trim()) return;

    const payload = {
      title: form.title.trim() || "Untitled",
      content: form.content.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      color: form.color || "#111827",
    };

    try {
      setSaving(true);
      if (editingId) {
        const { data } = await API.put(`/notes/${editingId}`, payload);
        setNotes((prev) => prev.map((n) => (n._id === editingId ? data : n)));
      } else {
        const { data } = await API.post("/notes", payload);
        setNotes((prev) => [data, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({
      title: note.title,
      content: note.content,
      tags: (note.tags || []).join(", "),
      color: note.color || "#7f60f9",
    });
  };

  const togglePin = async (note) => {
    try {
      const { data } = await API.put(`/notes/${note._id}`, {
        ...note,
        isPinned: !note.isPinned,
      });
      setNotes((prev) => prev.map((n) => (n._id === note._id ? data : n)));
    } catch (err) {
      console.error("Pin toggle failed", err);
    }
  };

  const filteredNotes = useMemo(() => {
    const q = search.toLowerCase();
    return notes
      .filter((n) => {
        const inText =
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q));
        const tagMatch = tagFilter === "all" || (n.tags || []).includes(tagFilter);
        return inText && tagMatch;
      })
        .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [notes, search, tagFilter]);

  const tags = useMemo(() => {
    const unique = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => unique.add(t)));
    return Array.from(unique);
  }, [notes]);

  const pinned = filteredNotes.filter((n) => n.isPinned);
  const others = filteredNotes.filter((n) => !n.isPinned);

  const summary = {
    total: notes.length,
    pinned: notes.filter((n) => n.isPinned).length,
    tags: tags.length,
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  const shellTheme = theme === "dark"
    ? "bg-black text-white"
    : "bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-900";

  return (
    <div className={`min-h-screen ${shellTheme} transition-colors duration-300`}>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Organize quickly</p>
              <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Sticky Notes</h1>
              <p className="mt-2 max-w-2xl text-slate-400">Capture ideas, pin priorities, and keep your day in view.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                className="w-60 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-inherit placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10"
                placeholder="Search by title, text, or tag"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-inherit focus:border-indigo-400 focus:outline-none dark:border-white/10"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="all">All tags</option>
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-inherit transition hover:-translate-y-0.5 hover:border-indigo-400"
                onClick={loadNotes}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-inherit transition hover:-translate-y-0.5 hover:border-indigo-400"
                onClick={toggleTheme}
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total" value={summary.total} />
            <Stat label="Pinned" value={summary.pinned} />
            <Stat label="Tags" value={summary.tags} />
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur dark:border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">New note</p>
              <h2 className="text-2xl font-semibold">{editingId ? "Update note" : "Create a note"}</h2>
            </div>
            {editingId && (
              <button
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-inherit transition hover:border-indigo-400"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="col-span-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-inherit placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none md:col-span-2"
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Content"
              rows={4}
              className="col-span-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-inherit placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none md:col-span-2"
            />
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Tags (comma separated)"
              className="col-span-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-inherit placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
            <div className="col-span-1 flex flex-col gap-2">
              <label className="text-sm text-slate-400">Note color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="h-11 w-16 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0"
                />
                <div className="flex flex-wrap gap-2">
                  {palette.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`h-8 w-8 rounded-lg border-2 ${form.color === c ? "border-white" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                      aria-label={`Set color ${c}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              className="col-span-1 rounded-xl bg-gradient-to-r from-cyan-300 to-indigo-500 px-4 py-3 font-semibold text-slate-900 transition hover:brightness-105 md:col-span-2"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : editingId ? "Save changes" : "Add note"}
            </button>
          </form>
        </section>

        <section className="mt-10 space-y-6">
          {loading && <p className="text-sm text-slate-400">Loading notes...</p>}
          {!loading && filteredNotes.length === 0 && (
            <p className="text-sm text-slate-400">No notes yet. Add one above.</p>
          )}

          {pinned.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">Pinned</h3>
                <span className="text-sm text-slate-400">Priority notes</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pinned.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => handleDelete(note._id)}
                    onPin={() => togglePin(note)}
                  />
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-semibold">All notes</h3>
                <span className="text-sm text-slate-400">Sorted by newest</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {others.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => handleDelete(note._id)}
                    onPin={() => togglePin(note)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete, onPin }) {
  const created = new Date(note.createdAt).toLocaleDateString();
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:border-indigo-400">
      <div className="absolute inset-0 opacity-90" style={{ backgroundColor: note.color || "#111827" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/30" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">{note.isPinned ? "Pinned" : "Note"}</p>
          <h3 className="mt-1 text-xl font-semibold text-white">{note.title}</h3>
        </div>
        <button
          className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/30"
          onClick={onPin}
        >
          {note.isPinned ? "Unpin" : "Pin"}
        </button>
      </div>

      <p className="relative mt-3 min-h-[64px] text-sm text-white/90">{note.content || "(No content)"}</p>

      <div className="relative mt-3 flex flex-wrap gap-2">
        {(note.tags || []).map((t) => (
          <span key={t} className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white/90">
            {t}
          </span>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-white/80">
        <span>Created {created}</span>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-white/40 px-3 py-1 font-medium text-white transition hover:bg-white/20"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="rounded-lg border border-white/40 px-3 py-1 font-medium text-white transition hover:bg-white/20"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-card">
      <span className="text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}

export default App;
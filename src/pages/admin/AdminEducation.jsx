import { useEffect, useState } from "react";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  CalendarDays,
  X,
} from "lucide-react";

import {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/educationApi";

const emptyForm = {
  institution_name: "",
  degree: "",
  field_of_study: "",
  location: "",
  start_year: "",
  end_year: "",
  grade: "",
  description: "",
  institution_url: "",
  sort_order: 0,
  is_active: true,
};

function AdminEducation() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEducation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllEducation();

      if (response.success) {
        setEducation(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch education:", error);

      setError(error.response?.data?.message || "Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEducation = async () => {
      await fetchEducation();
    };

    loadEducation();
  }, []);

  const openAddModal = () => {
    setEditingEducation(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingEducation(item);

    setForm({
      institution_name: item.institution_name || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      location: item.location || "",
      start_year: item.start_year || "",
      end_year: item.end_year || "",
      grade: item.grade || "",
      description: item.description || "",
      institution_url: item.institution_url || "",
      sort_order: item.sort_order ?? 0,
      is_active: Boolean(item.is_active),
    });

    setMessage("");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setEditingEducation(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      let response;

      const payload = {
        ...form,
        start_year: Number(form.start_year),
        end_year: form.end_year ? Number(form.end_year) : null,
        sort_order: Number(form.sort_order) || 0,
      };

      if (editingEducation) {
        response = await updateEducation(editingEducation.id, payload);
      } else {
        response = await createEducation(payload);
      }

      if (response.success) {
        setMessage(
          editingEducation
            ? "Education updated successfully"
            : "Education added successfully",
        );

        await fetchEducation();

        setTimeout(() => {
          closeModal();
        }, 500);
      }
    } catch (error) {
      console.error("Failed to save education:", error);

      setError(error.response?.data?.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await deleteEducation(id);

      if (response.success) {
        setMessage("Education deleted successfully");
        await fetchEducation();
      }
    } catch (error) {
      console.error("Failed to delete education:", error);

      setError(error.response?.data?.message || "Failed to delete education");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-purple-400">
            Portfolio Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Education
          </h1>

          <p className="mt-2 text-sm text-white/40">
            Manage your academic background displayed on the portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-400"
        >
          <Plus size={17} />
          Add Education
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
          {message}
        </div>
      )}

      {error && !isModalOpen && (
        <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
        </div>
      ) : education.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
          <GraduationCap
            size={40}
            strokeWidth={1.3}
            className="text-white/20"
          />

          <h2 className="mt-4 text-lg font-medium text-white">
            No education records
          </h2>

          <p className="mt-2 max-w-md text-sm text-white/40">
            Add your educational qualifications to display them on your
            portfolio.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white transition hover:bg-white/5"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/15 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                {/* Main */}
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <GraduationCap
                      size={21}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">
                        {item.degree}
                      </h2>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          item.is_active
                            ? "border-green-400/20 bg-green-400/10 text-green-300"
                            : "border-red-400/20 bg-red-400/10 text-red-300"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {item.field_of_study && (
                      <p className="mt-1 text-sm text-purple-400">
                        {item.field_of_study}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-white/60">
                      {item.institution_name}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40">
                      {(item.start_year || item.end_year) && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {item.start_year || ""} — {item.end_year || "Present"}
                        </span>
                      )}

                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} />
                          {item.location}
                        </span>
                      )}

                      {item.grade && (
                        <span className="rounded-full border border-white/10 px-2.5 py-1">
                          {item.grade}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-4 max-w-3xl text-sm leading-6 text-white/40">
                        {item.description}
                      </p>
                    )}

                    {item.institution_url && (
                      <a
                        href={item.institution_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
                      >
                        <ExternalLink size={14} />
                        Institution website
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 px-3.5 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />

                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111111] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingEducation ? "Edit Education" : "Add Education"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Update the academic information shown on your portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6">
              {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Institution */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    Institution Name *
                  </label>

                  <input
                    type="text"
                    name="institution_name"
                    value={form.institution_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rajasthan Technical University"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Degree */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Degree *
                  </label>

                  <input
                    type="text"
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    required
                    placeholder="e.g. B.Tech"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Field */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Field of Study
                  </label>

                  <input
                    type="text"
                    name="field_of_study"
                    value={form.field_of_study}
                    onChange={handleChange}
                    placeholder="e.g. Electronics & Communication Engineering"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Kota, Rajasthan"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Grade */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Grade / CGPA
                  </label>

                  <input
                    type="text"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    placeholder="e.g. 9.78 CGPA"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Start year */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Start Year *
                  </label>

                  <input
                    type="number"
                    name="start_year"
                    value={form.start_year}
                    onChange={handleChange}
                    required
                    min="1900"
                    max="2100"
                    placeholder="2021"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* End year */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    End Year
                  </label>

                  <input
                    type="number"
                    name="end_year"
                    value={form.end_year}
                    onChange={handleChange}
                    min="1900"
                    max="2100"
                    placeholder="2025"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Institution URL */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    Institution URL
                  </label>

                  <input
                    type="url"
                    name="institution_url"
                    value={form.institution_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-white/60">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your education, specialization, achievements, etc."
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Sort order */}
                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    name="sort_order"
                    value={form.sort_order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-purple-400/40"
                  />
                </div>

                {/* Active */}
                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="h-4 w-4 accent-purple-500"
                    />

                    <span>
                      <span className="block text-sm text-white">Active</span>

                      <span className="mt-0.5 block text-xs text-white/40">
                        Show this education on the public portfolio
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingEducation
                      ? "Update Education"
                      : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEducation;

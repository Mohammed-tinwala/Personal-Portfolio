import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createExperience,
  deleteExperience,
  getAllExperience,
  updateExperience,
} from "../../services/experienceApi";

const emptyForm = {
  company_name: "",
  job_title: "",
  location: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  technologies: "",
  company_url: "",
  sort_order: 0,
  is_active: true,
};

function AdminExperience() {
  const [experience, setExperience] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadExperience = async () => {
      try {
        const response = await getAllExperience();

        if (!isMounted) return;

        if (response.success) {
          setExperience(response.data || []);
        } else {
          setErrorMessage(
            response.message || "Failed to load experience."
          );
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load experience:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load experience."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadExperience();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshExperience = async () => {
    try {
      const response = await getAllExperience();

      if (response.success) {
        setExperience(response.data || []);
      }
    } catch (error) {
      console.error("Failed to refresh experience:", error);
    }
  };

  const openAddModal = () => {
    setEditingExperience(null);
    setForm(emptyForm);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    const technologies = Array.isArray(item.technologies)
      ? item.technologies.join(", ")
      : item.technologies || "";

    setEditingExperience(item);

    setForm({
      company_name: item.company_name || "",
      job_title: item.job_title || "",
      location: item.location || "",
      employment_type: item.employment_type || "",
      start_date: item.start_date
        ? String(item.start_date).slice(0, 10)
        : "",
      end_date:
        item.end_date && !item.is_current
          ? String(item.end_date).slice(0, 10)
          : "",
      is_current: Boolean(item.is_current),
      description: item.description || "",
      technologies,
      company_url: item.company_url || "",
      sort_order: item.sort_order ?? 0,
      is_active: Boolean(item.is_active),
    });

    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingExperience(null);
    setForm(emptyForm);
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

    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    const payload = {
      ...form,
      sort_order: Number(form.sort_order) || 0,
      technologies: form.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      end_date: form.is_current ? null : form.end_date || null,
    };

    try {
      let response;

      if (editingExperience) {
        response = await updateExperience(
          editingExperience.id,
          payload
        );
      } else {
        response = await createExperience(payload);
      }

      if (!response.success) {
        setErrorMessage(
          response.message || "Failed to save experience."
        );
        return;
      }

      setSuccessMessage(
        editingExperience
          ? "Experience updated successfully."
          : "Experience created successfully."
      );

      await refreshExperience();

      setTimeout(() => {
        setIsModalOpen(false);
        setEditingExperience(null);
        setForm(emptyForm);
        setSuccessMessage("");
      }, 700);
    } catch (error) {
      console.error("Failed to save experience:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save experience."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await deleteExperience(id);

      if (!response.success) {
        setErrorMessage(
          response.message || "Failed to delete experience."
        );
        return;
      }

      setSuccessMessage("Experience deleted successfully.");

      await refreshExperience();
    } catch (error) {
      console.error("Failed to delete experience:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete experience."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10">
                <BriefcaseBusiness
                  size={19}
                  className="text-purple-400"
                />
              </div>

              <div>
                <h1 className="text-xl font-semibold">
                  Experience
                </h1>

                <p className="mt-1 text-sm text-white/40">
                  Manage your professional experience.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-400"
          >
            <Plus size={17} />
            Add Experience
          </button>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="shrink-0 text-red-300/70 transition hover:text-red-300"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            <Check size={17} />
            {successMessage}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && experience.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <BriefcaseBusiness
              size={32}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-lg font-medium">
              No experience added
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Add your first professional experience.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-400"
            >
              <Plus size={17} />
              Add Experience
            </button>
          </div>
        )}

        {/* Experience list */}
        {!isLoading && experience.length > 0 && (
          <div className="mt-8 space-y-5">
            {experience.map((item) => (
              <ExperienceCard
                key={item.id}
                item={item}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDelete(item.id)}
                isDeleting={deletingId === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="my-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold">
                  {editingExperience
                    ? "Edit Experience"
                    : "Add Experience"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Manage the experience shown on your portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
                {/* Company + Job title */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Company Name"
                    name="company_name"
                    value={form.company_name}
                    onChange={handleChange}
                    placeholder="Doorstep Services"
                    required
                  />

                  <FormField
                    label="Job Title"
                    name="job_title"
                    value={form.job_title}
                    onChange={handleChange}
                    placeholder="Frontend Developer"
                    required
                  />
                </div>

                {/* Location + Employment */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Kota, Rajasthan"
                  />

                  <FormField
                    label="Employment Type"
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                    placeholder="Full-time"
                  />
                </div>

                {/* Dates */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                  />

                  <FormField
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={form.end_date}
                    onChange={handleChange}
                    disabled={form.is_current}
                  />
                </div>

                {/* Current job */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_current"
                    checked={form.is_current}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-500"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      I currently work here
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      End date will be automatically ignored.
                    </p>
                  </div>
                </label>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    required
                    placeholder="Describe your responsibilities, achievements and work..."
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40"
                  />
                </div>

                {/* Technologies */}
                <FormField
                  label="Technologies"
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Tailwind CSS, REST API"
                  helper="Separate technologies with commas."
                />

                {/* Company URL */}
                <FormField
                  label="Company Website"
                  name="company_url"
                  type="url"
                  value={form.company_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />

                {/* Sort order */}
                <FormField
                  label="Sort Order"
                  name="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  helper="Lower numbers appear first."
                />

                {/* Active */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-500"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Active
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      Inactive experience will not appear publicly.
                    </p>
                  </div>
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}

                  {editingExperience
                    ? "Update Experience"
                    : "Create Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
   EXPERIENCE CARD
========================================= */

function ExperienceCard({
  item,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const technologies = Array.isArray(item.technologies)
    ? item.technologies
    : [];

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {/* Title */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h2 className="text-xl font-semibold">
              {item.job_title}
            </h2>

            {item.is_current && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Current
              </span>
            )}

            {!item.is_active && (
              <span className="inline-flex w-fit rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[11px] font-medium text-red-300">
                Inactive
              </span>
            )}
          </div>

          {/* Company */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Building2 size={14} />
              {item.company_name}
            </span>

            {item.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {item.location}
              </span>
            )}
          </div>

          {/* Date */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/35">
            <CalendarDays size={14} />

            <span>
              {formatDate(item.start_date)} —{" "}
              {item.is_current
                ? "Present"
                : formatDate(item.end_date)}
            </span>

            {item.employment_type && (
              <>
                <span className="text-white/15">•</span>
                <span>{item.employment_type}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/45">
            {item.description}
          </p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-white/45"
                >
                  {technology}
                </span>
              ))}
            </div>
          )}

          {/* Company URL */}
          {item.company_url && (
            <a
              href={item.company_url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-xs text-purple-400 transition hover:text-purple-300"
            >
              <ExternalLink size={13} />
              Company Website
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/10 bg-red-400/5 px-3.5 py-2 text-xs text-red-300/70 transition hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-red-300/30 border-t-red-300" />
            ) : (
              <Trash2 size={14} />
            )}
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================
   FORM FIELD
========================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  helper,
  min,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-40"
      />

      {helper && (
        <p className="mt-1.5 text-xs text-white/25">
          {helper}
        </p>
      )}
    </div>
  );
}

/* =========================================
   DATE FORMATTER
========================================= */

function formatDate(date) {
  if (!date) return "Present";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default AdminExperience;

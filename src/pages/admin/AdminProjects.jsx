import { useEffect, useState } from "react";
import {
  ExternalLink,
  CodeXml,
  Pencil,
  Plus,
  Trash2,
  X,
  FolderKanban,
  Star,
} from "lucide-react";

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectsApi";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  technologies: "",
  live_url: "",
  github_url: "",
  category: "",
  is_featured: false,
  sort_order: 0,
  is_active: true,
};

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await getAllProjects();

        if (!isMounted) return;

        if (response.success) {
          setProjects(response.data || []);
        } else {
          setErrorMessage(response.message || "Failed to load projects.");
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load projects:", error);

        setErrorMessage(
          error.response?.data?.message || "Failed to load projects.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProjects = async () => {
    try {
      const response = await getAllProjects();

      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error("Failed to refresh projects:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to refresh projects.",
      );
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData(emptyForm);
    setSuccessMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);

    setFormData({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      technologies: project.technologies || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      category: project.category || "",
      is_featured: Boolean(project.is_featured),
      sort_order: project.sort_order ?? 0,
      is_active: Boolean(project.is_active),
    });

    setSuccessMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        sort_order: Number(formData.sort_order) || 0,
      };

      let response;

      if (editingProject) {
        response = await updateProject(editingProject.id, payload);
      } else {
        response = await createProject(payload);
      }

      if (!response.success) {
        setErrorMessage(response.message || "Something went wrong.");
        return;
      }

      setSuccessMessage(
        editingProject
          ? "Project updated successfully."
          : "Project created successfully.",
      );

      await refreshProjects();

      setTimeout(() => {
        setIsModalOpen(false);
        setEditingProject(null);
        setFormData(emptyForm);
        setSuccessMessage("");
      }, 700);
    } catch (error) {
      console.error("Save project error:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to save project.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    setDeletingId(id);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await deleteProject(id);

      if (!response.success) {
        setErrorMessage(response.message || "Failed to delete project.");
        return;
      }

      setSuccessMessage("Project deleted successfully.");

      await refreshProjects();
    } catch (error) {
      console.error("Delete project error:", error);

      setErrorMessage(
        error.response?.data?.message || "Failed to delete project.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <FolderKanban size={20} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-white">Projects</h1>

              <p className="text-sm text-white/50">
                Manage projects displayed on your portfolio.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
          <FolderKanban size={42} className="mx-auto mb-4 text-white/20" />

          <h2 className="text-lg font-medium text-white">No projects yet</h2>

          <p className="mt-2 text-sm text-white/40">
            Add your first portfolio project.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-500"
          >
            <Plus size={17} />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-white/[0.03]">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FolderKanban size={42} className="text-white/15" />
                  </div>
                )}

                {/* Status badges */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-md ${
                      project.is_active
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {project.is_active ? "Active" : "Inactive"}
                  </span>

                  {project.is_featured && (
                    <span className="flex items-center gap-1 rounded-full bg-yellow-500/20 px-2.5 py-1 text-xs font-medium text-yellow-300 backdrop-blur-md">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {project.title}
                    </h2>

                    {project.category && (
                      <p className="mt-1 text-xs text-purple-300">
                        {project.category}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-lg bg-white/5 px-2 py-1 text-xs text-white/40">
                    #{project.sort_order}
                  </span>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-white/50">
                  {project.description}
                </p>

                {/* Technologies */}
                {project.technologies && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(Array.isArray(project.technologies)
                      ? project.technologies
                      : String(project.technologies)
                          .split(",")
                          .map((technology) => technology.trim())
                          .filter(Boolean)
                    ).map((technology) => (
                      <span
                        key={technology}
                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/60"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
                    >
                      <CodeXml size={14} />
                      GitHub
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-400/20 px-3 py-2.5 text-sm text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    {deletingId === project.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111111] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {editingProject ? "Edit Project" : "Add Project"}
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Manage the project information shown on your portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {/* Title + Category */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Project Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="My Portfolio Website"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Web Application"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe what this project does..."
                  className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                />
              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/project-image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Technologies
                </label>

                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, Express, MySQL"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                />

                <p className="mt-1.5 text-xs text-white/30">
                  Separate technologies with commas.
                </p>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Live Project URL
                  </label>

                  <input
                    type="url"
                    name="live_url"
                    value={formData.live_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    GitHub URL
                  </label>

                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/50"
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="w-full md:w-1/3">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Sort Order
                </label>

                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Featured Project
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      Show this project in featured sections.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-500"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      Active Project
                    </p>

                    <p className="mt-0.5 text-xs text-white/35">
                      Show this project publicly.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-500"
                  />
                </label>
              </div>

              {/* Form Messages */}
              {successMessage && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingProject
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjects;

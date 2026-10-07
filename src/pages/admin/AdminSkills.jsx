import { useEffect, useState } from "react";
import { Edit3, Plus, Save, Trash2, Wrench, X } from "lucide-react";

import {
  createSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../../services/skillsApi";

const emptyForm = {
  name: "",
  category: "",
  icon: "",
  sort_order: 0,
  is_active: true,
};

function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSkills = async (showLoader = false) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      setErrorMessage("");

      const response = await getAllSkills();

      if (response.success) {
        setSkills(response.data || []);
      } else {
        setErrorMessage(response.message || "Failed to load skills.");
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to load skills. Please try again.",
      );
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        const response = await getAllSkills();

        if (!isMounted) return;

        if (response.success) {
          setSkills(response.data || []);
        } else {
          setErrorMessage(response.message || "Failed to load skills.");
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to load skills:", error);

        setErrorMessage(
          error.response?.data?.message || "Failed to load skills.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingSkillId(null);
    setFormData(emptyForm);
    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkillId(skill.id);

    setFormData({
      name: skill.name || "",
      category: skill.category || "",
      icon: skill.icon || "",
      sort_order: skill.sort_order ?? 0,
      is_active: Boolean(skill.is_active),
    });

    setErrorMessage("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setEditingSkillId(null);
    setFormData(emptyForm);
    setErrorMessage("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.category.trim()) {
      setErrorMessage("Skill name and category are required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        icon: formData.icon.trim(),
        sort_order: Number(formData.sort_order) || 0,
        is_active: Boolean(formData.is_active),
      };

      let response;

      if (editingSkillId) {
        response = await updateSkill(editingSkillId, payload);
      } else {
        response = await createSkill(payload);
      }

      if (!response.success) {
        setErrorMessage(response.message || "Failed to save skill.");
        return;
      }

      await fetchSkills(false);

      setSuccessMessage(response.message || "Skill saved successfully.");

      setIsModalOpen(false);
      setEditingSkillId(null);
      setFormData(emptyForm);
    } catch (error) {
      console.error("Failed to save skill:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save skill. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (skill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`,
    );

    if (!confirmed) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      const response = await deleteSkill(skill.id);

      if (!response.success) {
        setErrorMessage(response.message || "Failed to delete skill.");
        return;
      }

      setSkills((previous) => previous.filter((item) => item.id !== skill.id));

      setSuccessMessage(response.message || "Skill deleted successfully.");
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete skill. Please try again.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/40">
            Manage the technologies and skills displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-all hover:scale-[1.01] hover:bg-white/90"
        >
          <Plus size={17} strokeWidth={1.8} />
          Add Skill
        </button>
      </div>

      {/* ERROR */}
      {errorMessage && !isModalOpen && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {/* SUCCESS */}
      {successMessage && !isModalOpen && (
        <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300">
          {successMessage}
        </div>
      )}

      {/* SKILLS LIST */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <Wrench size={18} strokeWidth={1.7} className="text-purple-400" />

            <div>
              <h2 className="text-base font-medium text-white">Skills</h2>

              <p className="mt-1 text-sm text-white/35">
                {skills.length} skill
                {skills.length !== 1 ? "s" : ""} in your portfolio.
              </p>
            </div>
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Wrench
              size={30}
              className="mx-auto text-white/20"
              strokeWidth={1.5}
            />

            <p className="mt-4 text-sm text-white/40">
              No skills have been added yet.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 text-sm text-purple-300 transition-colors hover:text-purple-200"
            >
              Add your first skill
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Wrench
                      size={17}
                      strokeWidth={1.7}
                      className="text-purple-300"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-medium text-white">
                        {skill.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          skill.is_active
                            ? "bg-green-400/10 text-green-300"
                            : "bg-white/10 text-white/35"
                        }`}
                      >
                        {skill.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/35">
                      <span>{skill.category}</span>

                      {skill.icon && (
                        <>
                          <span className="text-white/15">•</span>
                          <span>{skill.icon}</span>
                        </>
                      )}

                      <span className="text-white/15">•</span>

                      <span>Order: {skill.sort_order}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(skill)}
                    className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Edit3 size={14} strokeWidth={1.7} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(skill)}
                    className="flex h-9 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 px-3 text-red-300/70 transition-colors hover:bg-red-400/10 hover:text-red-300"
                  >
                    <Trash2 size={14} strokeWidth={1.7} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-base font-medium text-white">
                  {editingSkillId ? "Edit Skill" : "Add Skill"}
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  {editingSkillId
                    ? "Update the selected skill."
                    : "Add a new technology or skill."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed"
              >
                <X size={18} strokeWidth={1.7} />
              </button>
            </div>

            {/* MODAL ERROR */}
            {errorMessage && (
              <div className="mx-6 mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {/* MODAL FORM */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-6">
                {/* NAME */}
                <div>
                  <label
                    htmlFor="skill-name"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Skill Name
                  </label>

                  <input
                    id="skill-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="React"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label
                    htmlFor="skill-category"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Category
                  </label>

                  <input
                    id="skill-category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Frontend"
                    required
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                {/* ICON */}
                <div>
                  <label
                    htmlFor="skill-icon"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Icon
                  </label>

                  <input
                    id="skill-icon"
                    name="icon"
                    type="text"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="SiReact"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                  />

                  <p className="mt-2 text-xs leading-5 text-white/25">
                    Enter the icon identifier used by your portfolio.
                  </p>
                </div>

                {/* SORT ORDER */}
                <div>
                  <label
                    htmlFor="skill-sort-order"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Sort Order
                  </label>

                  <input
                    id="skill-sort-order"
                    name="sort_order"
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-purple-400/50 focus:bg-white/[0.06]"
                  />
                </div>

                {/* ACTIVE */}
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Active Skill
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Show this skill on the public portfolio.
                    </p>
                  </div>

                  <input
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 accent-purple-500"
                  />
                </label>
              </div>

              {/* MODAL FOOTER */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="h-11 rounded-xl border border-white/10 px-5 text-sm text-white/60 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} strokeWidth={1.8} />
                  {isSaving
                    ? "Saving..."
                    : editingSkillId
                      ? "Update Skill"
                      : "Add Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSkills;

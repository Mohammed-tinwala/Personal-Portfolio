import { useEffect, useState } from "react";
import {
  AlignLeft,
  BookOpen,
  BriefcaseBusiness,
  Image,
  MapPin,
  Save,
} from "lucide-react";

import { getAbout, updateAbout } from "../../services/aboutApi";

function AdminAbout() {
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    education: "",
    experience: "",
    location: "",
    profile_image: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getAbout();

        if (response.success && response.data) {
          setFormData({
            heading: response.data.heading || "",
            description: response.data.description || "",
            education: response.data.education || "",
            experience: response.data.experience || "",
            location: response.data.location || "",
            profile_image: response.data.profile_image || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch about:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load About content. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await updateAbout(formData);

      if (response.success) {
        if (response.data) {
          setFormData({
            heading: response.data.heading || "",
            description: response.data.description || "",
            education: response.data.education || "",
            experience: response.data.experience || "",
            location: response.data.location || "",
            profile_image: response.data.profile_image || "",
          });
        }

        setSuccessMessage(
          response.message || "About content updated successfully."
        );
      } else {
        setErrorMessage(
          response.message || "Failed to update About content."
        );
      }
    } catch (error) {
      console.error("Failed to update about:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save About content. Please try again."
      );
    } finally {
      setIsSaving(false);
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
    <div className="mx-auto max-w-4xl">
      {/* HEADER */}
      <div>
        <p className="text-sm text-white/40">
          Manage the information displayed in your About section.
        </p>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {/* SUCCESS */}
      {successMessage && (
        <div className="mt-6 rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300">
          {successMessage}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          {/* CARD HEADER */}
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-base font-medium text-white">
              About Content
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Update the information visitors see in your About
              section.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* HEADING */}
            <div>
              <label
                htmlFor="heading"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Heading
              </label>

              <div className="relative">
                <BookOpen
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  id="heading"
                  name="heading"
                  type="text"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="About Me"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Description
              </label>

              <div className="relative">
                <AlignLeft
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-4 text-white/30"
                />

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short description about yourself"
                  rows={7}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* DETAILS */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5">
                <h3 className="text-sm font-medium text-white">
                  Professional Details
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Manage the basic information shown alongside your
                  About content.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* EDUCATION */}
                <div>
                  <label
                    htmlFor="education"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Education
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="education"
                      name="education"
                      type="text"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="B.Tech in Electronics & Communication"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div>
                  <label
                    htmlFor="experience"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Experience
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="2+ Years Experience"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* LOCATION */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Kota, Rajasthan, India"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* PROFILE IMAGE */}
                <div>
                  <label
                    htmlFor="profile_image"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Profile Image URL
                  </label>

                  <div className="relative">
                    <Image
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="profile_image"
                      name="profile_image"
                      type="text"
                      value={formData.profile_image}
                      onChange={handleChange}
                      placeholder="/images/profile.jpg"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE */}
            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.01] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
              >
                <Save size={16} strokeWidth={1.8} />

                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAbout;

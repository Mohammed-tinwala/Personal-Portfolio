import { useEffect, useState } from "react";
import {
  AlignLeft,
  ArrowRight,
  ExternalLink,
  Heading,
  Save,
  UserRound,
} from "lucide-react";

import { getHero, updateHero } from "../../services/heroApi";

function AdminHero() {
  const [formData, setFormData] = useState({
    name: "",
    headline: "",
    description: "",
    primary_button_text: "",
    primary_button_url: "",
    secondary_button_text: "",
    secondary_button_url: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getHero();

        if (response.success && response.data) {
          setFormData({
            name: response.data.name || "",
            headline: response.data.headline || "",
            description: response.data.description || "",
            primary_button_text:
              response.data.primary_button_text || "",
            primary_button_url:
              response.data.primary_button_url || "",
            secondary_button_text:
              response.data.secondary_button_text || "",
            secondary_button_url:
              response.data.secondary_button_url || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch hero:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load Hero content. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
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

      const response = await updateHero(formData);

      if (response.success) {
        setFormData({
          name: response.data?.name || formData.name,
          headline: response.data?.headline || formData.headline,
          description:
            response.data?.description || formData.description,
          primary_button_text:
            response.data?.primary_button_text ||
            formData.primary_button_text,
          primary_button_url:
            response.data?.primary_button_url ||
            formData.primary_button_url,
          secondary_button_text:
            response.data?.secondary_button_text ||
            formData.secondary_button_text,
          secondary_button_url:
            response.data?.secondary_button_url ||
            formData.secondary_button_url,
        });

        setSuccessMessage(
          response.message || "Hero content updated successfully."
        );
      } else {
        setErrorMessage(
          response.message || "Failed to update Hero content."
        );
      }
    } catch (error) {
      console.error("Failed to update hero:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to save Hero content. Please try again."
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
          Manage the main content and call-to-action buttons shown in
          your portfolio hero section.
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
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-base font-medium text-white">
              Hero Content
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Update the text visitors see when they first open your
              portfolio.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Name
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* HEADLINE */}
            <div>
              <label
                htmlFor="headline"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Headline
              </label>

              <div className="relative">
                <Heading
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  id="headline"
                  name="headline"
                  type="text"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="Your main professional headline"
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
                  placeholder="Short introduction about yourself"
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5">
                <h3 className="text-sm font-medium text-white">
                  Call-to-Action Buttons
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Configure the two buttons displayed in your Hero
                  section.
                </p>
              </div>

              <div className="space-y-6">
                {/* PRIMARY BUTTON */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-purple-300">
                    Primary Button
                  </p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="primary_button_text"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Button Text
                      </label>

                      <div className="relative">
                        <ArrowRight
                          size={17}
                          strokeWidth={1.7}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          id="primary_button_text"
                          name="primary_button_text"
                          type="text"
                          value={formData.primary_button_text}
                          onChange={handleChange}
                          placeholder="View Projects"
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="primary_button_url"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Button URL
                      </label>

                      <div className="relative">
                        <ExternalLink
                          size={17}
                          strokeWidth={1.7}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          id="primary_button_url"
                          name="primary_button_url"
                          type="text"
                          value={formData.primary_button_url}
                          onChange={handleChange}
                          placeholder="/projects"
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECONDARY BUTTON */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                    Secondary Button
                  </p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="secondary_button_text"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Button Text
                      </label>

                      <div className="relative">
                        <ArrowRight
                          size={17}
                          strokeWidth={1.7}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          id="secondary_button_text"
                          name="secondary_button_text"
                          type="text"
                          value={formData.secondary_button_text}
                          onChange={handleChange}
                          placeholder="Let's Talk"
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="secondary_button_url"
                        className="mb-2 block text-sm font-medium text-white/70"
                      >
                        Button URL
                      </label>

                      <div className="relative">
                        <ExternalLink
                          size={17}
                          strokeWidth={1.7}
                          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                        />

                        <input
                          id="secondary_button_url"
                          name="secondary_button_url"
                          type="text"
                          value={formData.secondary_button_url}
                          onChange={handleChange}
                          placeholder="/contact"
                          className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                        />
                      </div>
                    </div>
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

export default AdminHero;

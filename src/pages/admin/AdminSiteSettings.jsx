import { useEffect, useState } from "react";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  CodeXml,
  Link,
  Save,
} from "lucide-react";

import {
  getSiteSettings,
  updateSiteSettings,
} from "../../services/siteSettingsApi";

function AdminSiteSettings() {
  const [formData, setFormData] = useState({
    site_name: "",
    site_description: "",
    email: "",
    phone: "",
    location: "",
    github_url: "",
    linkedin_url: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await getSiteSettings();

        if (response.success && response.data) {
          setFormData({
            site_name: response.data.site_name || "",
            site_description: response.data.site_description || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
            location: response.data.location || "",
            github_url: response.data.github_url || "",
            linkedin_url: response.data.linkedin_url || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);

        setErrorMessage(
          error.response?.data?.message ||
            "Failed to load site settings. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
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

      const response = await updateSiteSettings(formData);

      if (response.success) {
        setFormData({
          site_name: response.data.site_name || "",
          site_description: response.data.site_description || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
          github_url: response.data.github_url || "",
          linkedin_url: response.data.linkedin_url || "",
        });

        setSuccessMessage(
          response.message || "Site settings updated successfully."
        );
      } else {
        setErrorMessage(
          response.message || "Failed to update site settings."
        );
      }
    } catch (error) {
      console.error("Failed to update site settings:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update site settings. Please try again."
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
          Manage the basic information displayed across your portfolio.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-base font-medium text-white">
              General Information
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Update the information visitors see on your website.
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* SITE NAME */}
            <div>
              <label
                htmlFor="site_name"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Site Name
              </label>

              <div className="relative">
                <Globe
                  size={17}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <input
                  id="site_name"
                  name="site_name"
                  type="text"
                  value={formData.site_name}
                  onChange={handleChange}
                  placeholder="Your site name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label
                htmlFor="site_description"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Site Description
              </label>

              <textarea
                id="site_description"
                name="site_description"
                value={formData.site_description}
                onChange={handleChange}
                placeholder="Short description of your portfolio"
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
              />
            </div>

            {/* CONTACT INFORMATION */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5">
                <h3 className="text-sm font-medium text-white">
                  Contact Information
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Contact details displayed throughout the portfolio.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* LOCATION */}
                <div className="md:col-span-2">
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
                      placeholder="Your location"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL LINKS */}
            <div className="border-t border-white/10 pt-6">
              <div className="mb-5">
                <h3 className="text-sm font-medium text-white">
                  Social Links
                </h3>

                <p className="mt-1 text-xs text-white/35">
                  Links used for your social profiles.
                </p>
              </div>

              <div className="space-y-6">
                {/* GITHUB */}
                <div>
                  <label
                    htmlFor="github_url"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    GitHub URL
                  </label>

                  <div className="relative">
                    <CodeXml
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="github_url"
                      name="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* LINKEDIN */}
                <div>
                  <label
                    htmlFor="linkedin_url"
                    className="mb-2 block text-sm font-medium text-white/70"
                  >
                    LinkedIn URL
                  </label>

                  <div className="relative">
                    <Link
                      size={17}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                    />

                    <input
                      id="linkedin_url"
                      name="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-purple-400/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-all duration-300 hover:scale-[1.01] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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

export default AdminSiteSettings;
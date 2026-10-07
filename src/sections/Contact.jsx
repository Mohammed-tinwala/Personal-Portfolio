import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  CodeXml,
  Link,
  ArrowUpRight,
} from "lucide-react";

import { getSiteSettings } from "../services/siteSettingsApi";
import { sendContactMessage } from "../services/contactApi";

function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSiteSettings();

        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      } finally {
        setLoading(false);
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

    setFormMessage({
      type: "",
      text: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormMessage({
        type: "error",
        text: "Please fill in your name, email and message.",
      });

      return;
    }

    try {
      setIsSubmitting(true);

      setFormMessage({
        type: "",
        text: "",
      });

      const response = await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response.success) {
        setFormMessage({
          type: "success",
          text: "Your message has been sent successfully.",
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Failed to send contact message:", error);

      setFormMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black py-28 sm:py-32">
      <div className="pointer-events-none absolute left-[-200px] top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="relative mx-auto w-[calc(100%-48px)] max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            Contact
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-7xl">
            Let's build something
            <br />
            <span className="text-white/40">useful together.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
            Have a project, opportunity, or just want to connect? Feel free to
            reach out.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* CONTACT INFORMATION */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Get in touch
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
              I'm always open to discussing new projects, development
              opportunities and interesting ideas.
            </p>

            <div className="mt-8 space-y-5">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Mail
                      size={19}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-white/70 transition-colors group-hover:text-white">
                      {settings.email}
                    </p>
                  </div>
                </a>
              )}

              {settings?.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <Phone
                      size={19}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-white/70 transition-colors group-hover:text-white">
                      {settings.phone}
                    </p>
                  </div>
                </a>
              )}

              {settings?.location && (
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <MapPin
                      size={19}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Location
                    </p>

                    <p className="mt-1 text-sm text-white/70">
                      {settings.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {(settings?.github_url || settings?.linkedin_url) && (
              <div className="mt-10 flex gap-3">
                {settings.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    aria-label="GitHub"
                  >
                    <CodeXml size={19} strokeWidth={1.5} />
                  </a>
                )}

                {settings.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <Link size={19} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-9"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Send a message
            </h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                disabled={isSubmitting}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-purple-400/40 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {formMessage.text && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    formMessage.type === "success"
                      ? "border-green-400/20 bg-green-400/5 text-green-300"
                      : "border-red-400/20 bg-red-400/5 text-red-300"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}

                {!isSubmitting && <ArrowUpRight size={17} />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
import { useEffect, useState } from "react";
import { CodeXml, Mail, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { getSiteSettings } from "../services/siteSettingsApi";

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSiteSettings();

        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch site settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1200px] py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              {settings?.site_name ? (
                <>
                  {settings.site_name.split(" ")[0]}
                  <span className="text-purple-400">.</span>
                </>
              ) : (
                <>
                  MT<span className="text-purple-400">.</span>
                </>
              )}
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              {settings?.site_description ||
                "MERN Stack Developer building practical web applications with clean and intuitive design."}
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/30">
              Navigation
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                About
              </Link>

              <Link
                to="/projects"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                Projects
              </Link>

              <Link
                to="/contact"
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/30">
              Connect
            </p>

            <div className="flex gap-3">
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  aria-label="Email"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <Mail size={17} strokeWidth={1.5} />
                </a>
              )}

              {settings?.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <CodeXml size={17} strokeWidth={1.5} />
                </a>
              )}

              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  <CodeXml size={17} strokeWidth={1.5} />
                </a>
              )}

              <Link
                to="/contact"
                aria-label="Contact"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowUpRight size={17} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {settings?.site_name || "Mohammed Tinwala"}. All
            rights reserved.
          </p>

          <p>Built with React & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
import { useEffect, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { getSiteSettings } from "../services/siteSettingsApi";

function ContactCTA() {
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

  return (
    <section className="w-full border-t border-white/10 bg-black px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center md:px-12 md:py-20"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-purple-400">
              <Mail size={20} />
            </div>

            <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
              Let's Connect
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Have a project or opportunity in mind?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/45 md:text-lg">
              {settings?.site_description ||
                "I'm always open to discussing interesting projects, collaborations and software development opportunities."}
            </p>

            <Link
              to="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:scale-105"
            >
              Get in touch

              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactCTA;
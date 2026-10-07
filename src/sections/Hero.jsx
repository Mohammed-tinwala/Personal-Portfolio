import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { getHero } from "../services/heroApi";
import api from "../services/api";

function Hero() {
  const [hero, setHero] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const [heroResponse, settingsResponse] = await Promise.all([
          getHero(),
          api.get("/site-settings"),
        ]);

        setHero(heroResponse.data);
        setSiteSettings(settingsResponse.data.data);
      } catch (error) {
        console.error("Failed to load hero data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroData();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-black pt-20">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-[calc(100%-48px)] max-w-[1200px] items-center">
          <div className="w-full max-w-[850px]">
            <div className="h-8 w-64 animate-pulse rounded-full bg-white/10" />

            <div className="mt-7 h-32 w-full max-w-[700px] animate-pulse rounded-2xl bg-white/10" />

            <div className="mt-8 h-6 w-64 animate-pulse rounded bg-white/10" />

            <div className="mt-4 h-20 w-full max-w-2xl animate-pulse rounded bg-white/10" />

            <div className="mt-9 flex gap-3">
              <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!hero) {
    return null;
  }

  const availabilityText = siteSettings?.availability_status
    ? "Available for new opportunities"
    : "Currently unavailable";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black pt-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-100px] top-20 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[120px]" />

      {/* CENTERED CONTAINER */}
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-[calc(100%-48px)] max-w-[1200px] items-center">
        <div className="w-full max-w-[850px]">
          {/* Availability */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                  siteSettings?.availability_status
                    ? "bg-green-400"
                    : "bg-red-400"
                } opacity-75`}
              />

              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  siteSettings?.availability_status
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              />
            </span>

            <span className="text-xs text-white/60 sm:text-sm">
              {availabilityText}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-8xl"
          >
            {hero.name.split(" ").slice(0, -1).join(" ")}

            <br />

            <span className="bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              {hero.name.split(" ").slice(-1)[0]}.
            </span>
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8"
          >
            <p className="text-xl font-medium text-purple-400 sm:text-2xl">
              {hero.headline}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base lg:text-lg">
              {hero.description}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href={
                siteSettings?.resume_url ||
                hero.primary_button_url ||
                "/resume.pdf"
              }
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
            >
              {hero.primary_button_text || "View Resume"}

              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <a
              href={hero.primary_button_url || "/projects"}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07]"
            >
              {hero.secondary_button_text || "View Projects"}
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 flex gap-3"
          >
            {siteSettings?.github_url && (
              <a
                href={siteSettings.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[19px] w-[19px]"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.908-.621.069-.608.069-.608 1.004.071 1.532 1.031 1.532 1.031.892 1.529 2.341 1.087 2.91.831.091-.646.349-1.087.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.6 9.6 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.743 0 .269.18.58.688.482A10.001 10.001 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
                </svg>
              </a>
            )}

            {siteSettings?.linkedin_url && (
              <a
                href={siteSettings.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[19px] w-[19px]"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.998h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.288ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0-4.124ZM3.559 20.452h3.557V8.998H3.559v11.454ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                </svg>
              </a>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="pointer-events-none absolute bottom-8 left-0 hidden w-full justify-center sm:flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center gap-3 text-white/30"
          >
            <span className="pl-[0.2em] text-xs uppercase tracking-[0.2em]">
              Scroll to explore
            </span>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowDown size={16} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Code2,
  Palette,
  Server,
  Database,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

import { getAbout } from "../services/aboutApi";
import { getSkills } from "../services/skillsApi";

const stats = [
  {
    icon: GraduationCap,
    value: "2025",
    label: "B.Tech Graduate",
  },
  {
    icon: BriefcaseBusiness,
    value: "9+",
    label: "Months Experience",
  },
];

function About() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const [aboutResponse, skillsResponse] = await Promise.all([
          getAbout(),
          getSkills(),
        ]);

        if (aboutResponse.success) {
          setAbout(aboutResponse.data);
        }

        if (skillsResponse.success) {
          setSkills(skillsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch About data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black py-28 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[-200px] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-200px] bottom-0 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[130px]" />

      {/* Main container */}
      <div className="relative mx-auto w-[calc(100%-48px)] max-w-[1200px]">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            About me
          </p>

          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            {about?.heading || "Building useful products"}
          </h2>
        </motion.div>

        {/* Content grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_0.8fr] lg:gap-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-lg leading-8 text-white/70 sm:text-xl">
              {about?.description ||
                "I'm Mohammed Tinwala, a MERN Stack Developer focused on building practical web applications with clean and intuitive interfaces."}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
              I enjoy working across the frontend and backend, turning ideas
              into functional products and solving real-world problems through
              code. My development approach combines modern technologies with
              thoughtful UI/UX.
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
              Currently, I'm focused on improving my full-stack development
              skills, building real projects, and growing as a professional
              software developer.
            </p>

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />

                    <p className="mt-4 text-2xl font-semibold">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Frontend */}
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Code2
                    size={21}
                    strokeWidth={1.5}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-medium">Frontend Development</h3>

                  <p className="mt-1 text-sm text-white/40">
                    React, JavaScript & modern UI
                  </p>
                </div>
              </div>
            </div>

            {/* UI/UX */}
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Palette
                    size={21}
                    strokeWidth={1.5}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-medium">UI / UX Design</h3>

                  <p className="mt-1 text-sm text-white/40">
                    Clean interfaces & user experiences
                  </p>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Server
                    size={21}
                    strokeWidth={1.5}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-medium">Backend Development</h3>

                  <p className="mt-1 text-sm text-white/40">
                    Node.js, Express & REST APIs
                  </p>
                </div>
              </div>
            </div>

            {/* Database */}
            <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.05]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <Database
                    size={21}
                    strokeWidth={1.5}
                    className="text-purple-400"
                  />
                </div>

                <div>
                  <h3 className="font-medium">Databases</h3>

                  <p className="mt-1 text-sm text-white/40">
                    MongoDB, MySQL & data management
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-24 border-t border-white/10 pt-10"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/60">
                Technologies I work with
              </p>

              <p className="mt-2 text-sm text-white/30">
                Tools I use to build and ship applications.
              </p>
            </div>

            <div className="flex max-w-2xl flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/55 transition-colors hover:border-purple-400/30 hover:text-white"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
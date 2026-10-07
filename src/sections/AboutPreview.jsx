import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, Palette, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { getAbout } from "../services/aboutApi";

const highlights = [
  {
    icon: Code2,
    title: "Frontend",
    description: "React, JavaScript and modern responsive interfaces.",
  },
  {
    icon: Palette,
    title: "UI/UX",
    description: "Clean interfaces designed around real user needs.",
  },
  {
    icon: Server,
    title: "Backend",
    description: "Node.js, Express, APIs and database integration.",
  },
];

function AboutPreview() {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await getAbout();

        if (response.success) {
          setAbout(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch about:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center border-t border-white/10 bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </section>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <section className="w-full border-t border-white/10 bg-black px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        {/* Section heading */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
              About Me
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {about.heading}
            </h2>
          </div>

          <div>
            <p className="max-w-2xl text-base leading-7 text-white/50 md:text-lg">
              {about.description}
            </p>

            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-white"
            >
              More about me

              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>

        {/* Highlights */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
                className="bg-black p-7 md:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-purple-400">
                  <Icon size={20} />
                </div>

                <h3 className="mt-6 text-lg font-medium text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutPreview;
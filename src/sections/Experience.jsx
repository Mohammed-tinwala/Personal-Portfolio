import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
  ExternalLink,
} from "lucide-react";

import { getExperience } from "../services/experienceApi";

function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await getExperience();

        if (response.success) {
          setExperience(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch experience:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  if (loading) {
    return (
      <section className="relative flex min-h-[50vh] w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </section>
    );
  }

  if (experience.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden border-t border-white/10 bg-black py-28 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[-200px] top-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-200px] bottom-0 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[130px]" />

      <div className="relative mx-auto w-[calc(100%-48px)] max-w-[1200px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
            Experience
          </p>

          <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Where I've worked
            <br />
            <span className="text-white/40">
              and what I've built.
            </span>
          </h2>
        </motion.div>

        {/* Experience list */}
        <div className="mt-16 space-y-6">
          {experience.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:border-purple-400/20 hover:bg-white/[0.04] sm:p-9"
            >
              {/* Top */}
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <BriefcaseBusiness
                      size={21}
                      strokeWidth={1.5}
                      className="text-purple-400"
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {item.job_title}
                    </h3>

                    <p className="mt-1 text-base text-purple-400">
                      {item.company_name}
                    </p>
                  </div>
                </div>

                {item.company_url && (
                  <a
                    href={item.company_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    Company
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/40">
                {(item.start_date || item.end_date || item.is_current) && (
                  <div className="flex items-center gap-2">
                    <CalendarDays size={15} />

                    <span>
                      {formatDate(item.start_date)} —{" "}
                      {item.is_current
                        ? "Present"
                        : formatDate(item.end_date)}
                    </span>
                  </div>
                )}

                {item.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={15} />
                    <span>{item.location}</span>
                  </div>
                )}

                {item.employment_type && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                    {item.employment_type}
                  </span>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/45 sm:text-base">
                  {item.description}
                </p>
              )}

              {/* Technologies */}
              {item.technologies?.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                  {item.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }

  const formattedDate = new Date(date);

  return formattedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default Experience;
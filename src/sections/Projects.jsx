import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CodeXml,
  ExternalLink,
} from "lucide-react";

import { getProjects } from "../services/projectsApi";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await getProjects();

        if (!isMounted) return;

        if (response.success) {
          setProjects(response.data || []);
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch projects:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProjects = projects.filter(
    (project) => Boolean(project.is_featured)
  );

  const otherProjects = projects.filter(
    (project) => !project.is_featured
  );

  if (loading) {
    return (
      <section className="relative flex min-h-[70vh] w-full items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black py-28 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-[-200px] top-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-200px] bottom-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/5 blur-[130px]" />

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
            Selected work
          </p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Things I've built
              <br />
              <span className="text-white/40">
                with code and curiosity.
              </span>
            </h2>

            <p className="max-w-sm text-sm leading-7 text-white/40 sm:text-base">
              A selection of projects where I worked on development,
              interfaces, APIs and real-world product requirements.
            </p>
          </div>
        </motion.div>

        {/* Featured projects */}
        {featuredProjects.length > 0 && (
          <div className="mt-16 space-y-8">
            {featuredProjects.map((project, index) => (
              <FeaturedProject
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {otherProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-sm text-white/40">
              No projects available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================
   TECHNOLOGIES HELPER
========================================= */

function getTechnologies(technologies) {
  if (Array.isArray(technologies)) {
    return technologies;
  }

  if (typeof technologies === "string") {
    try {
      const parsed = JSON.parse(technologies);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);
    }
  }

  return [];
}

/* =========================================
   FEATURED PROJECT
========================================= */

function FeaturedProject({ project, index }) {
  const technologies = getTechnologies(project.technologies);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-purple-400/20"
    >
      <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
        {/* Project image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03] lg:aspect-auto lg:min-h-[420px]">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
            />
          ) : (
            <ProjectPlaceholder />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/60 backdrop-blur-md">
            Featured
          </span>
        </div>

        {/* Project information */}
        <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
          <div>
            <p className="text-sm text-purple-400">
              {project.category}
            </p>

            <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {project.title}
            </h3>

            <p className="mt-5 text-sm leading-7 text-white/45 sm:text-base">
              {project.description}
            </p>

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-10 flex items-center gap-3">
            <ProjectLink
              href={project.github_url}
              icon={<CodeXml size={16} />}
              label="GitHub"
            />

            <ProjectLink
              href={project.live_url}
              icon={<ExternalLink size={16} />}
              label="Live Demo"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================
   NORMAL PROJECT CARD
========================================= */

function ProjectCard({ project, index }) {
  const technologies = getTechnologies(project.technologies);

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-purple-400/20"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <ProjectPlaceholder />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-purple-400">
          {project.category}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold">
            {project.title}
          </h3>

          <ArrowUpRight
            size={19}
            className="shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
          />
        </div>

        <p className="mt-3 text-sm leading-6 text-white/40">
          {project.description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {technologies.slice(0, 3).map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/40"
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-6 flex items-center gap-4">
          <ProjectTextLink
            href={project.github_url}
            icon={<CodeXml size={14} />}
            label="GitHub"
          />

          <ProjectTextLink
            href={project.live_url}
            icon={<ExternalLink size={14} />}
            label="Live"
          />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================
   PROJECT LINK
========================================= */

function ProjectLink({ href, icon, label }) {
  const isAvailable = Boolean(href);

  return (
    <a
      href={isAvailable ? href : undefined}
      target={isAvailable ? "_blank" : undefined}
      rel={isAvailable ? "noreferrer" : undefined}
      onClick={(event) => {
        if (!isAvailable) {
          event.preventDefault();
        }
      }}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm transition-all duration-300 ${
        isAvailable
          ? "text-white/60 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          : "cursor-not-allowed text-white/20"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}

/* =========================================
   PROJECT TEXT LINK
========================================= */

function ProjectTextLink({ href, icon, label }) {
  const isAvailable = Boolean(href);

  return (
    <a
      href={isAvailable ? href : undefined}
      target={isAvailable ? "_blank" : undefined}
      rel={isAvailable ? "noreferrer" : undefined}
      onClick={(event) => {
        if (!isAvailable) {
          event.preventDefault();
        }
      }}
      className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
        isAvailable
          ? "text-white/40 hover:text-white"
          : "cursor-not-allowed text-white/20"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}

/* =========================================
   IMAGE PLACEHOLDER
========================================= */

function ProjectPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-2xl border border-white/10 bg-white/[0.03]" />

        <p className="mt-4 text-xs text-white/20">
          Project Preview
        </p>
      </div>
    </div>
  );
}

export default Projects;

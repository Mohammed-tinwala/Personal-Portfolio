import { useEffect, useState } from "react";
import { ArrowUpRight, CodeXml } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { getProjects } from "../services/projectsApi";

function FeaturedProjects() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await getProjects();

        if (response.success) {
          const featured = response.data.filter(
            (project) => project.is_featured
          );

          setFeaturedProjects(featured);
        }
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <section className="w-full border-t border-white/10 bg-black px-6 py-24 md:px-12 lg:py-32">
      <div className="mx-auto max-w-[1200px]">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
              Selected Work
            </p>

            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Projects I've built.
            </h2>
          </div>

          <Link
            to="/projects"
            className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            View all projects
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-14 flex min-h-[250px] items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/10 border-t-purple-400" />
          </div>
        )}

        {/* Projects */}
        {!loading && (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-white/20">
                        Project Preview
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />

                  <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="text-xl font-medium text-white">
                        {project.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-white/45">
                        {project.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="shrink-0 text-white/30 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </div>

                  {/* Technologies */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.technologies?.slice(0, 4).map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-7 flex items-center gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                      >
                        <CodeXml size={14} />
                        GitHub
                      </a>
                    )}

                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition-transform hover:scale-105"
                      >
                        Live Demo
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && featuredProjects.length === 0 && (
          <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-white/30">
              No featured projects available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjects;
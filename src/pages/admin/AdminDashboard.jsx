import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FolderKanban,
  Code2,
  BriefcaseBusiness,
  Mail,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import { getDashboardStats } from "../../services/dashboardApi";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    messages: 0,
    unreadMessages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await getDashboardStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const response = await getDashboardStats();

        if (isMounted && response.success) {
          setStats(response.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error(
            "Failed to fetch dashboard stats:",
            error
          );

          setError(
            error.response?.data?.message ||
              "Failed to load dashboard statistics"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      path: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: Code2,
      path: "/admin/skills",
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: BriefcaseBusiness,
      path: "/admin/experience",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: Mail,
      path: "/admin/messages",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-white/40">
            Welcome back. Manage your portfolio from here.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchStats(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.path)}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-purple-400/30 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-white/40">
                    {item.label}
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-white">
                    {loading ? "—" : item.value}
                  </p>

                  <p className="mt-2 text-xs text-white/25 transition group-hover:text-purple-300/70">
                    Manage {item.label.toLowerCase()} →
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] transition group-hover:bg-purple-400/10">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Additional Statistics */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => navigate("/admin/education")}
          className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-purple-400/30 hover:bg-white/[0.05]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/40">
                Education
              </p>

              <p className="mt-3 text-3xl font-semibold text-white">
                {loading ? "—" : stats.education}
              </p>

              <p className="mt-2 text-xs text-white/25 transition group-hover:text-purple-300/70">
                Manage education →
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] transition group-hover:bg-purple-400/10">
              <GraduationCap className="h-5 w-5 text-purple-400" />
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin/messages")}
          className="group rounded-2xl border border-purple-400/20 bg-purple-400/[0.05] p-6 text-left transition hover:border-purple-400/40 hover:bg-purple-400/[0.08]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-200/60">
                Unread Messages
              </p>

              <p className="mt-3 text-3xl font-semibold text-purple-300">
                {loading ? "—" : stats.unreadMessages}
              </p>

              <p className="mt-2 text-xs text-purple-300/40 transition group-hover:text-purple-300/80">
                Open messages →
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
              <Mail className="h-5 w-5 text-purple-300" />
            </div>
          </div>
        </button>
      </div>

      {/* Portfolio Management */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-3">
          <BookOpen
            size={18}
            className="text-purple-400"
          />

          <h2 className="text-base font-medium text-white">
            Portfolio Management
          </h2>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          Use the sidebar to manage your portfolio content.
          Changes made through the admin panel are stored in your
          MySQL database and reflected on the public portfolio.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;

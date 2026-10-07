import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronLeft,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

import { logoutAdmin } from "../services/adminApi";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Site Settings",
    path: "/admin/site-settings",
    icon: Settings,
  },
  {
    label: "Hero",
    path: "/admin/hero",
    icon: Sparkles,
  },
  {
    label: "About",
    path: "/admin/about",
    icon: UserRound,
  },
  {
    label: "Skills",
    path: "/admin/skills",
    icon: Wrench,
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
  },
  {
    label: "Experience",
    path: "/admin/experience",
    icon: BriefcaseBusiness,
  },
  {
    label: "Education",
    path: "/admin/education",
    icon: GraduationCap,
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: Mail,
  },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const handleNavigation = () => {
    setIsMobileMenuOpen(false);
  };

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find((item) => {
      if (item.end) {
        return location.pathname === item.path;
      }

      return (
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
      );
    });

    return currentItem?.label || "Dashboard";
  };

  const currentPageTitle = getCurrentPageTitle();

  const renderNavigation = () => (
    <>
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
        Management
      </p>

      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  isActive
                    ? "bg-purple-500/10 text-purple-300"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={1.7} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-[#0b0b0b] lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-left"
          >
            <span className="text-xl font-bold tracking-tight">
              MT<span className="text-purple-400">.</span>
            </span>

            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
              Admin
            </span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation()}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ChevronLeft size={17} strokeWidth={1.7} />
            View Portfolio
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-colors hover:bg-red-400/5 hover:text-red-300"
          >
            <LogOut size={17} strokeWidth={1.7} />
            Logout
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0b0b0b] transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 text-left"
          >
            <span className="text-xl font-bold tracking-tight">
              MT<span className="text-purple-400">.</span>
            </span>

            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
              Admin
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={19} strokeWidth={1.7} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {renderNavigation()}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
            className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <ChevronLeft size={17} strokeWidth={1.7} />
            View Portfolio
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition-colors hover:bg-red-400/5 hover:text-red-300"
          >
            <LogOut size={17} strokeWidth={1.7} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-white/10 bg-[#080808]/90 px-6 backdrop-blur-xl lg:px-8">
          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <Menu size={19} strokeWidth={1.7} />
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/25">
              Portfolio Admin
            </p>

            <h1 className="mt-1 text-lg font-medium text-white">
              {currentPageTitle}
            </h1>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;

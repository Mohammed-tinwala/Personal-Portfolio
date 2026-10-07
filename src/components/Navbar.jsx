import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { getSiteSettings } from "../services/siteSettingsApi";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
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
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-[calc(100%-48px)] max-w-[1200px] items-center justify-between">
        <NavLink
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
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? "text-white" : "text-white/50 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contact"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform duration-300 hover:scale-105"
        >
          Let's Talk
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
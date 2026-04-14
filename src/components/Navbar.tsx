import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-3 transition-colors duration-500"
      style={{
        backgroundColor: scrolled ? "oklch(0.1 0.005 285 / 95%)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="flex items-center gap-8">
        <Link to="/" className="text-netflix-red font-display text-3xl md:text-4xl tracking-wider">
          STREAMFLIX
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link
            to="/"
            className={`transition-colors hover:text-foreground ${location.pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            Home
          </Link>
          <Link
            to="/my-list"
            className={`transition-colors hover:text-foreground ${location.pathname === "/my-list" ? "text-foreground font-semibold" : "text-muted-foreground"}`}
          >
            My List
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground">
        <Search className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
        <Bell className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors" />
        <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </motion.nav>
  );
}

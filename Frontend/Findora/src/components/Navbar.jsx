import { useEffect, useState } from "react";
import "./Navbar.css";

// Change these paths to match your routes.
// If you use react-router, swap each <a href> for <Link to>.
const links = [
  { label: "Home", href: "/" },
  { label: "Explore Reports", href: "/explore-reports" },
  { label: "Found items", href: "/found" },
  { label: "My reports", href: "/my-reports" },
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}


function Navbar({ user,onLogout }) {
  const [open, setOpen] = useState(false);
  const currentPath = window.location.pathname;

  // Close the menu with Esc, and when the screen gets wide again
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 900 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <header className="site-header">
      <a href="/" className="brand">
        <span className="brand-icon">✦</span>
        findora<span className="brand-dot">.</span>
      </a>

      <button
        type="button"
        className={"nav-toggle" + (open ? " open" : "")}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>

      <nav
        id="site-nav"
        className={"header-nav" + (open ? " open" : "")}
        aria-label="Main navigation"
      >
        {[...links, ...(user?.role === "admin" ? [{ label: "Admin", href: "/admin" }] : [])].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={currentPath === link.href ? "active" : undefined}
            aria-current={currentPath === link.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}

        {/* RIGHT-MOST: signed-in user + logout */}
        {user && (
          <div className="nav-user">
            <span className="user-avatar" aria-hidden="true">
              {getInitials(user.username)}
            </span>

            <div className="user-details">
              <strong title={user.username}>{user.username}</strong>
              <small title={user.email}>{user.email}</small>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={() => {
                setOpen(false);
                onLogout && onLogout();
              }}
            >
              Log out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
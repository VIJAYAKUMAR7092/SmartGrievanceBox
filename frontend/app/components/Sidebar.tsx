"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/",              icon: "🏠", label: "Dashboard"    },
  { href: "/new-complaint", icon: "✏️", label: "New Complaint" },
  { href: "/my-complaints", icon: "📋", label: "My Complaints" },
  { href: "/admin",         icon: "⚙️", label: "Admin Panel"  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">📬</div>
        <h1>Grievance Box</h1>
        <p>Smart Complaint System</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-label">Menu</div>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{padding:"16px 24px",borderTop:"1px solid rgba(99,102,241,0.1)",fontSize:"11px",color:"var(--slate)"}}>
        © 2025 Grievance Box
      </div>
    </aside>
  );
}
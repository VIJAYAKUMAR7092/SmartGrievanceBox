"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, ClipboardList, Settings, LogOut, Key, Inbox } from "lucide-react";
import { isAuthenticated, isAdmin, logout } from "../lib/auth";

const baseNavItems = [
  { href: "/",              icon: Home,          label: "Dashboard" },
  { href: "/new-complaint", icon: PenSquare,     label: "New Complaint" },
  { href: "/my-complaints", icon: ClipboardList, label: "My Complaints" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setAdmin(isAdmin());
  }, []);

  const navItems = [...baseNavItems];
  if (admin) {
    navItems.push({ href: "/admin/dashboard", icon: Settings, label: "Admin Panel" });
  }

  return (
    <aside className="w-64 min-h-screen bg-navy-light border-r border-indigo-500/15 fixed top-0 left-0 flex flex-col z-50">
      <div className="p-6 border-b border-indigo-500/10">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
          <Inbox className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-base font-bold text-white tracking-tight">Grievance Box</h1>
        <p className="text-xs text-brand font-medium mt-1">Powered by Code Manthar AI</p>
      </div>
      
      <nav className="flex-1 p-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-4">Menu</div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? "bg-indigo-500/15 text-indigo-400" : "text-slate-400 hover:bg-indigo-500/5 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t border-indigo-500/10 pt-4 space-y-1">
          {authenticated ? (
            <button 
              onClick={logout} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <Link 
              href="/login" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === "/login" ? "bg-indigo-500/15 text-indigo-400" : "text-slate-400 hover:bg-indigo-500/5 hover:text-white"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="p-5 border-t border-indigo-500/10">
        <div className="text-[11px] text-slate-500 text-center">
          © {new Date().getFullYear()} Smart Grievance Box<br />
          <span className="opacity-75">by Code Manthar AI</span>
        </div>
      </div>
    </aside>
  );
}

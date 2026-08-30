"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import { isAuthenticated } from "../lib/auth";
import { Home, Monitor, Folder, Star, Clock, Activity, CheckCircle, Search } from "lucide-react";

interface Complaint { id: number; title: string; category: string; status: string; rating?: number; }

const catColors: Record<string, string> = { hostel: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20", lab: "text-amber-400 bg-amber-400/10 border-amber-400/20", admin: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
const CatIcon = ({ cat }: { cat: string }) => {
  if (cat === "hostel") return <Home className="w-4 h-4 text-indigo-400" />;
  if (cat === "lab") return <Monitor className="w-4 h-4 text-amber-400" />;
  return <Folder className="w-4 h-4 text-emerald-400" />;
};

function StatusPill({ status }: { status: string }) {
  if (status === "Pending") return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" /> Pending
    </span>
  );
  if (status === "In Progress") return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
      <Activity className="w-3 h-3" /> In Progress
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <CheckCircle className="w-3 h-3" /> Resolved
    </span>
  );
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState("all");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  const filtered = filter === "all" ? complaints : complaints.filter(c => c.status.toLowerCase() === filter);
  const counts = { 
    all: complaints.length, 
    pending: complaints.filter(c => c.status === "Pending").length, 
    "in progress": complaints.filter(c => c.status === "In Progress").length, 
    resolved: complaints.filter(c => c.status === "Resolved").length 
  };
  const chips = [
    { key: "all", label: "All", color: "indigo" }, 
    { key: "pending", label: "Pending", color: "rose" }, 
    { key: "in progress", label: "In Progress", color: "orange" }, 
    { key: "resolved", label: "Resolved", color: "emerald" }
  ];

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      router.replace("/login");
      return;
    }
    api.get("/complaints/").then(res => setComplaints(res.data)).catch(console.error);
  }, [router]);

  if (!authenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-navy text-center px-4">
        <div className="text-xl font-bold">Please sign in to view your complaints.</div>
      </main>
    );
  }

  return (
    <div className="flex bg-navy min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">My Complaints</h1>
          <p className="text-sm text-slate-400">Track the status of all your submitted grievances</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {chips.map(c => {
            const isActive = filter === c.key;
            // Need to build these classes explicitly for Tailwind to compile them or use static mapping
            let activeClasses = "";
            let inactiveClasses = "";
            if (c.color === "indigo") { activeClasses = "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"; inactiveClasses = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20"; }
            if (c.color === "rose")   { activeClasses = "bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/20"; inactiveClasses = "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"; }
            if (c.color === "orange") { activeClasses = "bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/20"; inactiveClasses = "bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20"; }
            if (c.color === "emerald"){ activeClasses = "bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"; inactiveClasses = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"; }
            
            return (
              <button 
                key={c.key} 
                onClick={() => setFilter(c.key)} 
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 flex items-center gap-2 ${isActive ? activeClasses : inactiveClasses}`}
              >
                {c.label} 
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-navy-card'}`}>
                  {counts[c.key as keyof typeof counts]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-navy-card border border-indigo-500/15 rounded-2xl overflow-hidden shadow-xl shadow-indigo-900/10">
          {filtered.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                <Search className="w-8 h-8 text-indigo-400 opacity-80" />
              </div>
              <div className="text-lg font-bold text-white mb-1">No complaints found</div>
              <div className="text-sm text-slate-400">Try changing your filter or submit a new complaint.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-500/5 border-b border-indigo-500/10">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-indigo-500/5">
                  {filtered.map(c => (
                    <tr key={c.id} className="hover:bg-indigo-500/5 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 w-16">#{c.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${catColors[c.category]?.split(' ')[1] || 'bg-indigo-500/10'}`}>
                            <CatIcon cat={c.category} />
                          </div>
                          <span className="font-semibold text-sm text-white">{c.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-32">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${catColors[c.category] || "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"}`}>
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-40">
                        <StatusPill status={c.status} />
                      </td>
                      <td className="px-6 py-4 text-right w-32">
                        {c.status === "Resolved" ? (
                          <div className="flex justify-end gap-0.5">
                            {c.rating ? (
                              Array.from({ length: c.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)
                            ) : (
                              <span className="text-slate-500 font-medium text-sm">—</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600 font-medium text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
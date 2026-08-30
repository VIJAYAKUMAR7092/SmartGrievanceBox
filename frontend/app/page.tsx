"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import { api } from "./lib/api";
import { isAuthenticated } from "./lib/auth";
import { Plus, Trash2, Home, Monitor, Folder, Star, Clock, Activity, CheckCircle, AlertCircle } from "lucide-react";

interface Complaint { id: number; title: string; category: string; status: string; rating?: number; }

const catColors: Record<string, string> = { hostel: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20", lab: "text-amber-400 bg-amber-400/10 border-amber-400/20", admin: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
const CatIcon = ({ cat }: { cat: string }) => {
  if (cat === "hostel") return <Home className="w-4 h-4 text-indigo-400" />;
  if (cat === "lab") return <Monitor className="w-4 h-4 text-amber-400" />;
  return <Folder className="w-4 h-4 text-emerald-400" />;
};
const catBg: Record<string, string> = { hostel: "bg-indigo-500/10", lab: "bg-amber-500/10", admin: "bg-emerald-500/10" };

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

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/");
      setComplaints(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints. Please start the backend server or sign in.");
    }
  };

  const deleteComplaint = async (id: number) => {
    try { await api.delete(`/complaints/${id}/`); fetchComplaints(); showToast("Complaint deleted successfully"); }
    catch { console.log("Failed"); }
  };

  const updateRating = async (id: number, rating: number) => {
    try { await api.patch(`/complaints/${id}/`, { rating }); fetchComplaints(); showToast("Rating updated!"); }
    catch { console.log("Failed"); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      fetchComplaints();
    } else {
      setError("Please sign in to see your complaints.");
    }
  }, []);

  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  if (!authenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-navy text-center px-4">
        <div className="max-w-md w-full bg-navy-card p-8 rounded-2xl border border-indigo-500/10 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Smart Grievance Box</h1>
          <p className="text-sm text-slate-400 mb-8">Powered by Code Manthar AI</p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="btn btn-primary w-full justify-center">Sign In</Link>
            <Link href="/register" className="btn btn-ghost w-full justify-center bg-white/5">Create Account</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex bg-navy min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">Dashboard</h1>
            <p className="text-sm text-slate-400">Overview of all grievances in the system</p>
          </div>
          <Link href="/new-complaint" className="btn btn-primary">
            <Plus className="w-4 h-4" /> New Complaint
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-navy-card border border-rose-500/20 rounded-xl p-5 relative overflow-hidden shadow-lg shadow-rose-900/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400" />
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-black text-white mb-1">{pending}</div>
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Pending</div>
              </div>
              <div className="p-2 bg-rose-500/10 rounded-lg"><Clock className="w-5 h-5 text-rose-400" /></div>
            </div>
          </div>
          
          <div className="bg-navy-card border border-orange-500/20 rounded-xl p-5 relative overflow-hidden shadow-lg shadow-orange-900/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-400" />
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-black text-white mb-1">{inProgress}</div>
                <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">In Progress</div>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-lg"><Activity className="w-5 h-5 text-orange-400" /></div>
            </div>
          </div>
          
          <div className="bg-navy-card border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden shadow-lg shadow-emerald-900/10">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
            <div className="flex justify-between items-start">
              <div>
                <div className="text-3xl font-black text-white mb-1">{resolved}</div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved</div>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
            </div>
          </div>
        </div>

        <div className="bg-navy-card border border-indigo-500/15 rounded-xl p-6 shadow-xl shadow-indigo-900/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Recent Complaints
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                {complaints.length} total
              </span>
            </h2>
          </div>
          
          <div className="space-y-3">
            {error ? (
              <div className="py-12 text-center border border-dashed border-rose-500/30 rounded-xl bg-rose-500/5">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3 opacity-80" />
                <div className="text-sm font-semibold text-white mb-1">Unable to load complaints</div>
                <div className="text-xs text-rose-300/80 max-w-md mx-auto">{error}</div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-indigo-500/20 rounded-xl bg-indigo-500/5">
                <Folder className="w-8 h-8 text-indigo-400 mx-auto mb-3 opacity-60" />
                <div className="text-sm font-semibold text-white mb-1">No complaints yet</div>
                <div className="text-xs text-slate-400">When complaints are submitted, they will appear here.</div>
              </div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="flex items-start gap-4 p-4 rounded-xl border border-indigo-500/10 bg-navy-light/50 hover:bg-navy-light transition-colors group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${catBg[c.category] || "bg-indigo-500/10"}`}>
                    <CatIcon cat={c.category} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white mb-1.5 truncate pr-4">{c.title}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${catColors[c.category] || "text-indigo-400 bg-indigo-400/10 border-indigo-400/20"}`}>
                        {c.category}
                      </span>
                      <StatusPill status={c.status} />
                      {c.status === "Resolved" && c.rating && (
                        <div className="flex items-center gap-0.5 ml-2 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {Array.from({ length: c.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                        </div>
                      )}
                    </div>
                    {c.status === "Resolved" && (
                      <div className="flex gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button 
                            key={r} 
                            onClick={() => updateRating(c.id, r)} 
                            className={`p-1 rounded-md transition-all hover:scale-110 hover:bg-amber-500/10 ${c.rating && r <= c.rating ? "text-amber-400" : "text-slate-600"}`}
                          >
                            <Star className={`w-4 h-4 ${c.rating && r <= c.rating ? "fill-amber-400" : ""}`} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteComplaint(c.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-navy-card border border-indigo-500/30 shadow-2xl shadow-indigo-900/50 rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-white">{toast}</span>
        </div>
      )}
    </div>
  );
}
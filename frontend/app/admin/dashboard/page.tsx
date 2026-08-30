"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";
import { isAuthenticated, isAdmin } from "../../lib/auth";
import { ShieldCheck, Inbox, CheckCircle, Clock, Activity, ChevronDown, ChevronUp, Star, Trash2 } from "lucide-react";

interface Complaint { 
  id: number; 
  title: string; 
  description: string;
  category: string; 
  status: string; 
  rating?: number;
  assigned_to?: string;
}

const catColors: Record<string, string> = { hostel: "text-indigo-400 bg-indigo-400/10", lab: "text-amber-400 bg-amber-400/10", admin: "text-emerald-400 bg-emerald-400/10" };

function StatusPill({ status }: { status: string }) {
  if (status === "Pending") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Pending</span>;
  if (status === "In Progress") return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">In Progress</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    if (!isAdmin()) {
      setIsAuthorized(false);
      return;
    }
    setIsAuthorized(true);
    fetchComplaints();
  }, [router]);

  const fetchComplaints = async () => {
    try {
      // Assuming admins can fetch all complaints using a specific endpoint or regular endpoint returns all for staff
      const res = await api.get("/complaints/");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/complaints/${id}/`, { status });
      fetchComplaints();
      showToast("Status updated successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComplaint = async (id: number) => {
    if(!confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await api.delete(`/complaints/${id}/`);
      fetchComplaints();
      showToast("Complaint deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  if (isAuthorized === null) {
    return <div className="min-h-screen bg-navy flex items-center justify-center text-slate-400">Loading...</div>;
  }

  if (isAuthorized === false) {
    return (
      <div className="flex bg-navy min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="bg-navy-card border border-rose-500/20 rounded-2xl p-12 text-center shadow-2xl max-w-md w-full">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-sm text-slate-400 mb-6">You must be an Administrator (Staff) to view the Admin Panel.</p>
            <button onClick={() => router.push("/")} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm transition-all">
              Return to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-navy min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Panel</h1>
            <p className="text-sm text-slate-400">Manage and respond to all student grievances</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-navy-card border border-rose-500/20 rounded-xl p-5 shadow-lg shadow-rose-900/10 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white mb-1">{pending}</div>
              <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Needs Attention</div>
            </div>
            <Clock className="w-8 h-8 text-rose-500/50" />
          </div>
          <div className="bg-navy-card border border-orange-500/20 rounded-xl p-5 shadow-lg shadow-orange-900/10 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white mb-1">{inProgress}</div>
              <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">In Progress</div>
            </div>
            <Activity className="w-8 h-8 text-orange-500/50" />
          </div>
          <div className="bg-navy-card border border-emerald-500/20 rounded-xl p-5 shadow-lg shadow-emerald-900/10 flex items-center justify-between">
            <div>
              <div className="text-3xl font-black text-white mb-1">{resolved}</div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Resolved</div>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500/50" />
          </div>
        </div>

        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="bg-navy-card border border-indigo-500/15 rounded-2xl p-12 text-center">
              <Inbox className="w-12 h-12 text-indigo-400/50 mx-auto mb-4" />
              <div className="text-lg font-bold text-white">All clear!</div>
              <div className="text-slate-400">No complaints in the system currently.</div>
            </div>
          ) : (
            complaints.map(c => (
              <div key={c.id} className="bg-navy-card border border-indigo-500/15 rounded-xl overflow-hidden shadow-md transition-all hover:shadow-indigo-900/20">
                <div 
                  className="p-5 flex items-start gap-4 cursor-pointer select-none bg-navy-light/30 hover:bg-navy-light transition-colors"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-base text-white">{c.title}</span>
                      <StatusPill status={c.status} />
                    </div>
                    <div className="text-xs font-medium text-slate-400 flex items-center gap-2">
                      <span>#{c.id}</span>
                      <span>•</span>
                      <span className={`uppercase tracking-wider ${catColors[c.category]?.split(' ')[0] || 'text-indigo-400'}`}>{c.category}</span>
                      {c.rating && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-400">
                            {c.rating} <Star className="w-3 h-3 fill-amber-400" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {expanded === c.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>

                {expanded === c.id && (
                  <div className="p-5 border-t border-indigo-500/10 bg-navy/50">
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">{c.description || "No description provided."}</p>
                    
                    <div className="flex flex-wrap gap-6 items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Update Status</div>
                        <div className="flex gap-2">
                          {["Pending", "In Progress", "Resolved"].map(s => (
                            <button 
                              key={s} 
                              onClick={() => updateStatus(c.id, s)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                c.status === s 
                                  ? (s === "Pending" ? "bg-rose-500 text-white border-rose-500" : s === "In Progress" ? "bg-orange-500 text-white border-orange-500" : "bg-emerald-500 text-white border-emerald-500") 
                                  : "bg-navy border-indigo-500/20 text-slate-400 hover:border-indigo-500/50 hover:text-white"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => deleteComplaint(c.id)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-navy-card border border-emerald-500/30 shadow-2xl rounded-xl px-4 py-3 flex items-center gap-3 z-50">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-white">{toast}</span>
        </div>
      )}
    </div>
  );
}

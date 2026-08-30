"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { api } from "../lib/api";
import { isAuthenticated } from "../lib/auth";
import { Home, Monitor, Folder, Send, Loader2, Clock } from "lucide-react";

const categories = [
  { value:"hostel", label:"Hostel",  icon: Home,    desc:"Room, facilities, maintenance" },
  { value:"lab",    label:"Lab",     icon: Monitor, desc:"Computers, equipment, software" },
  { value:"admin",  label:"Admin",   icon: Folder,  desc:"Documents, fees, registration"  },
];

export default function NewComplaintPage() {
  const [title, setTitle]             = useState("");
  const [category, setCategory]       = useState("hostel");
  const [description, setDescription] = useState("");
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast("");

    try {
      const response = await api.post("/complaints/", { title, category, description });
      if (response.status === 201) {
        showToast("Complaint submitted successfully.");
        router.push("/");
      } else {
        showToast("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      showToast("Unable to submit. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-navy text-center px-4">
        <div className="text-xl font-bold">Please sign in to submit a complaint.</div>
      </main>
    );
  }

  return (
    <div className="flex bg-navy min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">New Complaint</h1>
          <p className="text-sm text-slate-400">Fill in the details below to submit your grievance</p>
        </div>
        
        <div className="max-w-2xl bg-navy-card border border-indigo-500/15 rounded-2xl p-8 shadow-xl shadow-indigo-900/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.value;
                  return (
                    <button 
                      key={cat.value} 
                      type="button" 
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-500/10 shadow-md shadow-indigo-500/20" 
                          : "border-indigo-500/20 bg-navy hover:bg-indigo-500/5 hover:border-indigo-500/40"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                      <div className="font-bold text-sm text-white mb-0.5">{cat.label}</div>
                      <div className="text-[11px] text-slate-400">{cat.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Title</label>
              <input 
                type="text" 
                className="w-full bg-navy border border-indigo-500/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all" 
                placeholder="Brief title for your complaint" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Description</label>
              <textarea 
                className="w-full bg-navy border border-indigo-500/20 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 outline-none transition-all min-h-[120px]" 
                placeholder="Describe your complaint in detail..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                rows={5}
              />
              <div className="text-[11px] text-slate-500 text-right mt-1 font-medium">{description.length} characters</div>
            </div>

            {title && (
              <div className="bg-navy border border-indigo-500/30 rounded-xl p-4 shadow-inner">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Preview</div>
                <div className="font-semibold text-sm text-white mb-1">{title}</div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    {(() => {
                      const Cat = categories.find(c => c.value === category);
                      return Cat ? <><Cat.icon className="w-3 h-3" /> {Cat.label}</> : null;
                    })()}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-rose-400">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3 text-sm">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Complaint</>}
            </button>
          </form>
        </div>
      </main>
      
      {toast && (
        <div className="fixed bottom-6 right-6 bg-navy-card border border-indigo-500/30 shadow-2xl shadow-indigo-900/50 rounded-xl px-4 py-3 text-sm font-medium text-white z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Sidebar from "./components/Sidebar";

interface Complaint { id: number; title: string; category: string; status: string; rating?: number; }

const catColors: Record<string,string> = { hostel:"cat-hostel", lab:"cat-lab", admin:"cat-admin" };
const catIcons:  Record<string,string> = { hostel:"🏠", lab:"🖥️", admin:"📁" };
const catBg:     Record<string,string> = { hostel:"rgba(99,102,241,0.15)", lab:"rgba(245,158,11,0.15)", admin:"rgba(16,185,129,0.15)" };

function StatusPill({ status }: { status: string }) {
  if (status === "Pending")     return <span className="pill pill-pending"><span className="dot"/>Pending</span>;
  if (status === "In Progress") return <span className="pill pill-progress">⟳ In Progress</span>;
  return <span className="pill pill-resolved">✓ Resolved</span>;
}

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/complaints/");
      setComplaints(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load complaints. Please start the backend server.");
    }
  };

  const deleteComplaint = async (id: number) => {
    try { await axios.delete(`http://127.0.0.1:8000/api/complaints/${id}/`); fetchComplaints(); showToast("🗑️ Complaint deleted"); }
    catch { console.log("Failed"); }
  };

  const updateRating = async (id: number, rating: number) => {
    try { await axios.patch(`http://127.0.0.1:8000/api/complaints/${id}/`, { rating }); fetchComplaints(); showToast("⭐ Rating updated!"); }
    catch { console.log("Failed"); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2800); };
  useEffect(() => { fetchComplaints(); }, []);

  const pending    = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved   = complaints.filter(c => c.status === "Resolved").length;

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><h1>Dashboard</h1><p>Overview of all grievances in the system</p></div>
          <Link href="/new-complaint" className="btn btn-primary">✏️ New Complaint</Link>
        </div>

        <div className="stats-row">
          <div className="stat-card pending">  <div className="stat-value" style={{color:"#FB7185"}}>{pending}</div>    <div className="stat-label">Pending</div></div>
          <div className="stat-card progress"> <div className="stat-value" style={{color:"#FB923C"}}>{inProgress}</div> <div className="stat-label">In Progress</div></div>
          <div className="stat-card resolved"> <div className="stat-value" style={{color:"#34D399"}}>{resolved}</div>   <div className="stat-label">Resolved</div></div>
        </div>

        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
            <h2 style={{margin:0,fontSize:"16px",fontWeight:700}}>
              Recent Complaints <span style={{marginLeft:"8px",fontSize:"12px",color:"var(--slate)",fontWeight:500}}>{complaints.length} total</span>
            </h2>
          </div>
          {error ? (
            <div className="empty-state"><div className="empty-icon">⚠️</div><div className="empty-title">Unable to load complaints</div><div className="empty-desc">{error}</div></div>
          ) : complaints.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">No complaints yet</div><div className="empty-desc">When students submit complaints, they'll appear here.</div></div>
          ) : complaints.map(c => (
            <div key={c.id} className="complaint-item">
              <div className="complaint-avatar" style={{background: catBg[c.category] || "rgba(99,102,241,0.15)"}}>{catIcons[c.category] || "📄"}</div>
              <div className="complaint-body">
                <div className="complaint-title">{c.title}</div>
                <div className="complaint-meta" style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
                  <span className={`cat-badge ${catColors[c.category]||""}`}>{c.category}</span>
                  <StatusPill status={c.status}/>
                  {c.status === "Resolved" && c.rating && <span style={{color:"var(--amber)",fontSize:"12px"}}>{"⭐".repeat(c.rating)}</span>}
                </div>
                {c.status === "Resolved" && (
                  <div style={{display:"flex",gap:"2px",marginTop:"8px"}}>
                    {[1,2,3,4,5].map(r => (
                      <button key={r} onClick={() => updateRating(c.id,r)} className={`star-btn ${c.rating && r<=c.rating?"filled":""}`}>★</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => deleteComplaint(c.id)} className="btn btn-ghost btn-sm">🗑️</button>
            </div>
          ))}
        </div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
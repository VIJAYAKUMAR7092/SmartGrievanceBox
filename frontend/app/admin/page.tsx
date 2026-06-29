"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

interface Complaint { id: number; title: string; category: string; description: string; status: string; assigned_to?: string; rating?: number; }

const catIcon: Record<string,string> = { hostel:"🏠", lab:"🖥️", admin:"📁" };
const catBg:   Record<string,string> = { hostel:"rgba(99,102,241,0.15)", lab:"rgba(245,158,11,0.15)", admin:"rgba(16,185,129,0.15)" };

function StatusPill({ status }: { status: string }) {
  if (status === "Pending")     return <span className="pill pill-pending"><span className="dot"/>Pending</span>;
  if (status === "In Progress") return <span className="pill pill-progress">⟳ In Progress</span>;
  return <span className="pill pill-resolved">✓ Resolved</span>;
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [expanded, setExpanded]     = useState<number|null>(null);
  const [toast, setToast]           = useState("");

  const fetchComplaints = () => { axios.get("http://127.0.0.1:8000/api/complaints/").then(res=>setComplaints(res.data)).catch(()=>{}); };
  const updateStatus    = (id:number,status:string)  => { axios.patch(`http://127.0.0.1:8000/api/complaints/${id}/`,{status}).then(()=>{fetchComplaints();showToast(`Status → "${status}"`);}).catch(()=>{}); };
  const updateRating    = (id:number,rating:number)  => { axios.patch(`http://127.0.0.1:8000/api/complaints/${id}/`,{rating}).then(()=>{fetchComplaints();showToast("Rating updated");}).catch(()=>{}); };
  const deleteComplaint = (id:number)                => { axios.delete(`http://127.0.0.1:8000/api/complaints/${id}/`).then(()=>{fetchComplaints();showToast("Deleted");setExpanded(null);}).catch(()=>{}); };
  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(""),2800); };

  useEffect(()=>{fetchComplaints();},[]);

  const pending    = complaints.filter(c=>c.status==="Pending").length;
  const inProgress = complaints.filter(c=>c.status==="In Progress").length;
  const resolved   = complaints.filter(c=>c.status==="Resolved").length;

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>Admin Panel</h1><p>Manage and respond to all student grievances</p></div>

        <div className="stats-row">
          <div className="stat-card pending">  <div className="stat-value" style={{color:"#FB7185"}}>{pending}</div>    <div className="stat-label">Needs Attention</div></div>
          <div className="stat-card progress"> <div className="stat-value" style={{color:"#FB923C"}}>{inProgress}</div> <div className="stat-label">In Progress</div></div>
          <div className="stat-card resolved"> <div className="stat-value" style={{color:"#34D399"}}>{resolved}</div>   <div className="stat-label">Resolved</div></div>
        </div>

        {complaints.length===0 ? (
          <div className="card"><div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">All clear!</div><div className="empty-desc">No complaints in the system.</div></div></div>
        ) : complaints.map(c => (
          <div key={c.id} className="admin-card">
            <div className="admin-card-header" onClick={()=>setExpanded(expanded===c.id?null:c.id)}>
              <div style={{width:"40px",height:"40px",borderRadius:"10px",background:catBg[c.category]||"rgba(99,102,241,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>
                {catIcon[c.category]||"📄"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                  <span style={{fontWeight:700,fontSize:"14px"}}>{c.title}</span>
                  <StatusPill status={c.status}/>
                </div>
                <div style={{fontSize:"12px",color:"var(--slate)"}}>#{c.id} · {c.category} · {c.assigned_to||"Unassigned"}{c.rating?` · ${"⭐".repeat(c.rating)}`:""}</div>
              </div>
              <span style={{color:"var(--slate)",fontSize:"14px",flexShrink:0}}>{expanded===c.id?"▲":"▼"}</span>
            </div>

            {expanded===c.id && (
              <div className="admin-card-body">
                <p style={{fontSize:"13.5px",color:"var(--slate)",marginTop:"14px",marginBottom:"16px",lineHeight:"1.6"}}>{c.description||"No description provided."}</p>
                <div style={{marginBottom:"14px"}}>
                  <div style={{fontSize:"11px",fontWeight:700,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"8px"}}>Update Status</div>
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                    {["Pending","In Progress","Resolved"].map(s => (
                      <button key={s} onClick={()=>updateStatus(c.id,s)} style={{padding:"6px 14px",borderRadius:"8px",border:"none",cursor:"pointer",fontSize:"12.5px",fontWeight:600,background:c.status===s?(s==="Pending"?"var(--rose)":s==="In Progress"?"var(--orange)":"var(--emerald)"):"rgba(148,163,184,0.1)",color:c.status===s?"white":"var(--slate)",transition:"all 0.15s"}}>
                        {s==="Pending"?"🔴":s==="In Progress"?"🟠":"🟢"} {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:"14px"}}>
                  <div style={{fontSize:"11px",fontWeight:700,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"8px"}}>Rating</div>
                  <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
                    {[1,2,3,4,5].map(r=>(
                      <button key={r} onClick={()=>updateRating(c.id,r)} className={`star-btn ${c.rating&&r<=c.rating?"filled":""}`} style={{fontSize:"22px"}}>★</button>
                    ))}
                    {c.rating && <span style={{fontSize:"12px",color:"var(--slate)",marginLeft:"8px"}}>{c.rating}/5</span>}
                  </div>
                </div>
                <button onClick={()=>deleteComplaint(c.id)} className="btn btn-ghost btn-sm" style={{color:"#FB7185"}}>🗑️ Delete Complaint</button>
              </div>
            )}
          </div>
        ))}
      </main>
      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

interface Complaint { id: number; title: string; category: string; status: string; rating?: number; }

const catClass: Record<string,string> = { hostel:"cat-hostel", lab:"cat-lab", admin:"cat-admin" };
const catIcon:  Record<string,string> = { hostel:"🏠", lab:"🖥️", admin:"📁" };

function StatusPill({ status }: { status: string }) {
  if (status === "Pending")     return <span className="pill pill-pending"><span className="dot"/>Pending</span>;
  if (status === "In Progress") return <span className="pill pill-progress">⟳ In Progress</span>;
  return <span className="pill pill-resolved">✓ Resolved</span>;
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/complaints/").then(res=>setComplaints(res.data)).catch(console.error);
  }, []);

  const filtered = filter==="all" ? complaints : complaints.filter(c=>c.status.toLowerCase()===filter);
  const counts   = { all:complaints.length, pending:complaints.filter(c=>c.status==="Pending").length, "in progress":complaints.filter(c=>c.status==="In Progress").length, resolved:complaints.filter(c=>c.status==="Resolved").length };
  const chips    = [ {key:"all",label:"All",cls:"chip-all"}, {key:"pending",label:"Pending",cls:"chip-pending"}, {key:"in progress",label:"In Progress",cls:"chip-progress"}, {key:"resolved",label:"Resolved",cls:"chip-resolved"} ];

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>My Complaints</h1><p>Track the status of all your submitted grievances</p></div>
        <div className="chip-row">
          {chips.map(c => (
            <button key={c.key} onClick={()=>setFilter(c.key)} className={`chip ${c.cls} ${filter===c.key?"active":""}`}>
              {c.label} <span style={{marginLeft:"6px",opacity:0.7}}>{counts[c.key as keyof typeof counts]}</span>
            </button>
          ))}
        </div>
        <div className="card" style={{padding:0,overflow:"hidden"}}>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔍</div><div className="empty-title">No complaints found</div><div className="empty-desc">Try a different filter or submit a new complaint.</div></div>
          ) : (
            <table className="data-table">
              <thead><tr><th style={{paddingLeft:"20px"}}>#</th><th>Title</th><th>Category</th><th>Status</th><th>Rating</th></tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td style={{paddingLeft:"20px",color:"var(--slate)",fontSize:"12px",fontWeight:600}}>#{c.id}</td>
                    <td><div style={{display:"flex",alignItems:"center",gap:"8px"}}><span style={{fontSize:"16px"}}>{catIcon[c.category]||"📄"}</span><span style={{fontWeight:600}}>{c.title}</span></div></td>
                    <td><span className={`cat-badge ${catClass[c.category]||""}`}>{c.category}</span></td>
                    <td><StatusPill status={c.status}/></td>
                    <td>{c.status==="Resolved"?<span style={{color:"var(--amber)"}}>{c.rating?"⭐".repeat(c.rating):"—"}</span>:<span style={{color:"var(--slate)"}}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
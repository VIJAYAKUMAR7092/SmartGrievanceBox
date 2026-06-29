"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const categories = [
  { value:"hostel", label:"🏠 Hostel", desc:"Room, facilities, maintenance" },
  { value:"lab",    label:"🖥️ Lab",    desc:"Computers, equipment, software" },
  { value:"admin",  label:"📁 Admin",  desc:"Documents, fees, registration"  },
];

export default function NewComplaintPage() {
  const [title, setTitle]             = useState("");
  const [category, setCategory]       = useState("hostel");
  const [description, setDescription] = useState("");
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState("");
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/complaints/", { title, category, description });
      if (response.status === 201) {
        showToast("Complaint submitted successfully.");
        window.location.href = "/";
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

  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>New Complaint</h1><p>Fill in the details below to submit your grievance</p></div>
        <div style={{maxWidth:"560px"}}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px"}}>
                {categories.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                    style={{padding:"12px",borderRadius:"12px",border:`2px solid ${category===cat.value?"var(--indigo)":"rgba(99,102,241,0.15)"}`,background:category===cat.value?"rgba(99,102,241,0.12)":"var(--navy-card)",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                    <div style={{fontSize:"20px",marginBottom:"4px"}}>{cat.label.split(" ")[0]}</div>
                    <div style={{fontSize:"12px",fontWeight:700,color:"var(--white)"}}>{cat.label.split(" ").slice(1).join(" ")}</div>
                    <div style={{fontSize:"11px",color:"var(--slate)",marginTop:"2px"}}>{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" className="form-input" placeholder="Brief title for your complaint" value={title} onChange={e=>setTitle(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe your complaint in detail..." value={description} onChange={e=>setDescription(e.target.value)} required rows={5}/>
              <div style={{fontSize:"12px",color:"var(--slate)",marginTop:"4px"}}>{description.length} characters</div>
            </div>
            {title && (
              <div className="card" style={{marginBottom:"18px",borderColor:"rgba(99,102,241,0.25)"}}>
                <div style={{fontSize:"11px",fontWeight:700,color:"var(--slate)",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.08em"}}>Preview</div>
                <div style={{fontWeight:600,fontSize:"14px"}}>{title}</div>
                <div style={{fontSize:"12px",color:"var(--slate)",marginTop:"4px"}}>
                  {categories.find(c=>c.value===category)?.label} · Status: <span style={{color:"#FB7185"}}>Pending</span>
                </div>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px"}}>
              {loading ? "⟳ Submitting..." : "📤 Submit Complaint"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
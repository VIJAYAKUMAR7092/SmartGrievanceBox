"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Complaint {
  id: number;
  title: string;
  category: string;
  description: string;
  status: string;
  assigned_to: string;
  rating?: number;
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const fetchComplaints = () => {
    axios
      .get("http://127.0.0.1:8000/api/complaints/")
      .then((res) => setComplaints(res.data))
      .catch(() => console.log("Failed to fetch complaints"));
  };

  const updateStatus = (id: number, status: string) => {
    axios
      .patch(`http://127.0.0.1:8000/api/complaints/${id}/`, { status })
      .then(fetchComplaints)
      .catch(() => console.log("Failed to update status"));
  };

  const updateRating = (id: number, rating: number) => {
    axios
      .patch(`http://127.0.0.1:8000/api/complaints/${id}/`, { rating })
      .then(fetchComplaints)
      .catch(() => console.log("Failed to update rating"));
  };

  const deleteComplaint = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/complaints/${id}/`)
      .then(fetchComplaints)
      .catch(() => console.log("Failed to delete complaint"));
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Admin Panel
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints found.</p>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="border-b py-4 last:border-b-0">
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-gray-600">{c.description}</p>
              <p className="text-sm text-gray-500">
                Category: {c.category} | Assigned: {c.assigned_to || "Not Assigned"} |{" "}
                Rating: {c.rating || "Not Rated"}
              </p>

              {/* Status Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => updateStatus(c.id, "Pending")}
                  className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600"
                >
                  Pending
                </button>
                <button
                  onClick={() => updateStatus(c.id, "In Progress")}
                  className="px-3 py-1 rounded-lg text-white bg-orange-500 hover:bg-orange-600"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(c.id, "Resolved")}
                  className="px-3 py-1 rounded-lg text-white bg-green-600 hover:bg-green-700"
                >
                  Resolved
                </button>
              </div>

              {/* Rating Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm">Rate:</span>
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => updateRating(c.id, r)}
                    className={`px-2 py-1 rounded text-white ${
                      c.rating === r
                        ? "bg-yellow-600"
                        : "bg-yellow-400 hover:bg-yellow-500"
                    }`}
                  >
                    {r}⭐
                  </button>
                ))}
              </div>

              {/* Delete Button */}
              <div className="mt-3">
                <button
                  onClick={() => deleteComplaint(c.id)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

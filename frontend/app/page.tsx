"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Complaint {
  id: number;
  title: string;
  status: string;
  rating?: number; // ⭐ optional rating
}

export default function HomePage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  // ✅ Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/complaints/");
      setComplaints(res.data);
    } catch (err) {
      console.log("Failed to fetch complaints");
    }
  };

  // ❌ Delete complaint
  const deleteComplaint = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/complaints/${id}/`);
      fetchComplaints();
    } catch (err) {
      console.log("Failed to delete complaint");
    }
  };

  // ⭐ Update rating
  const updateRating = async (id: number, rating: number) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/complaints/${id}/`, { rating });
      fetchComplaints();
    } catch (err) {
      console.log("Failed to update rating");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Smart Grievance Box
      </h1>

      {/* Submit Button */}
      <div className="text-center mb-6">
        <Link href="/new-complaint">
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Submit New Complaint
          </button>
        </Link>
      </div>

      {/* Complaints List */}
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>

        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints submitted yet.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="border-b py-3 last:border-none flex flex-col gap-2"
            >
              {/* Title + Status + Delete */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="block font-medium">{c.title}</span>
                  <span
                    className={
                      c.status === "Pending"
                        ? "text-red-500"
                        : c.status === "In Progress"
                        ? "text-orange-500"
                        : "text-green-600"
                    }
                  >
                    {c.status}
                  </span>
                </div>
                <button
                  onClick={() => deleteComplaint(c.id)}
                  className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-800"
                >
                  Delete
                </button>
              </div>

              {/* ⭐ Rating only for Resolved */}
              {c.status === "Resolved" && (
                <div className="flex items-center gap-1">
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

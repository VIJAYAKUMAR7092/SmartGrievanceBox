"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewComplaintPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("hostel");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post("http://127.0.0.1:8000/api/complaints/", {
      title,
      category,
      description,
    });

    // Reset form
    setTitle("");
    setCategory("hostel");
    setDescription("");

    // Redirect to home page
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Submit New Complaint
        </h1>

        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 mb-3 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="hostel">Hostel</option>
          <option value="lab">Lab</option>
          <option value="admin">Admin</option>
        </select>

        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

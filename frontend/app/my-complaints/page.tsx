'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Complaint {
  id: number;
  title: string;
  category: string;
  status: string;
}

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/complaints/')
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredComplaints =
    filter === 'all'
      ? complaints
      : complaints.filter((c) => c.status.toLowerCase() === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 font-bold';
      case 'In Progress':
        return 'text-blue-600 font-bold';
      case 'Resolved':
        return 'text-green-600 font-bold';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Complaints</h1>

      {/* Filter Buttons */}
      <div className="mb-4 space-x-2">
        <button onClick={() => setFilter('all')} className="px-3 py-1 bg-gray-200 rounded">All</button>
        <button onClick={() => setFilter('pending')} className="px-3 py-1 bg-yellow-200 rounded">Pending</button>
        <button onClick={() => setFilter('in progress')} className="px-3 py-1 bg-blue-200 rounded">In Progress</button>
        <button onClick={() => setFilter('resolved')} className="px-3 py-1 bg-green-200 rounded">Resolved</button>
      </div>

      {/* Complaints Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Title</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((c) => (
            <tr key={c.id}>
              <td className="border border-gray-300 p-2">{c.id}</td>
              <td className="border border-gray-300 p-2">{c.title}</td>
              <td className="border border-gray-300 p-2">{c.category}</td>
              <td className={`border border-gray-300 p-2 ${getStatusColor(c.status)}`}>
                {c.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

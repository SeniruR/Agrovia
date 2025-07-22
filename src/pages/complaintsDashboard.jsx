import React from 'react';
import { Eye } from 'react-feather';

const ComplaintsDashboard = ({ complaints, onViewComplaint }) => {
  return (
    <div>
      {complaints.map((complaint) => (
        <div key={complaint.id} className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{complaint.title}</h2>
            <p className="text-sm text-gray-500">{complaint.description}</p>
          </div>
          <button
            onClick={() => onViewComplaint(complaint.id, complaint.type)}
            className="p-2 bg-white hover:bg-white rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ComplaintsDashboard;